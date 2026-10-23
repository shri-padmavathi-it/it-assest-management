"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteComputer(id: string) {
  try {
    await prisma.softwareHistory.updateMany({ where: { fromComputerId: id }, data: { fromComputerId: null } })
    await prisma.softwareHistory.updateMany({ where: { toComputerId: id }, data: { toComputerId: null } })
    await prisma.softwareAssignment.deleteMany({ where: { computerId: id } })
    await prisma.computerHistory.deleteMany({ where: { computerId: id } })
    await prisma.computer.delete({ where: { id } })
    revalidatePath('/computers')
  } catch (error) {
    console.error("Error deleting computer:", error)
    throw new Error("Failed to delete computer. It may have dependencies.")
  }
}

export async function deleteSoftwareAsset(id: string) {
  try {
    await prisma.softwareAssignment.deleteMany({ where: { softwareAssetId: id } })
    await prisma.softwareHistory.deleteMany({ where: { softwareAssetId: id } })
    await prisma.softwareAsset.delete({ where: { id } })
    revalidatePath('/software-licenses')
  } catch (error) {
    console.error("Error deleting software asset:", error)
    throw new Error("Failed to delete software asset.")
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.computerHistory.updateMany({ where: { previousEmployeeId: id }, data: { previousEmployeeId: null } })
    await prisma.computerHistory.updateMany({ where: { newEmployeeId: id }, data: { newEmployeeId: null } })
    await prisma.softwareHistory.updateMany({ where: { fromEmployeeId: id }, data: { fromEmployeeId: null } })
    await prisma.softwareHistory.updateMany({ where: { toEmployeeId: id }, data: { toEmployeeId: null } })
    await prisma.softwareAssignment.updateMany({ where: { employeeId: id }, data: { employeeId: null } })
    await prisma.computer.updateMany({ where: { currentEmployeeId: id }, data: { currentEmployeeId: null, status: 'Available' } })
    await prisma.employee.delete({ where: { id } })
    revalidatePath('/employees')
  } catch (error) {
    console.error("Error deleting employee:", error)
    throw new Error("Failed to delete employee.")
  }
}

export async function addComputer(formData: FormData) {
  const assetTag = formData.get('assetTag') as string
  const computerName = formData.get('computerName') as string
  const brand = formData.get('brand') as string
  const model = formData.get('model') as string
  const rawStatus = formData.get('status') as string
  const department = formData.get('department') as string
  const processor = formData.get('processor') as string
  const graphicsCard = formData.get('graphicsCard') as string
  const ram = formData.get('ram') as string
  const storage = formData.get('storage') as string
  const operatingSystem = formData.get('operatingSystem') as string
  const office365Login = formData.get('office365Login') as string
  const serialNumber = formData.get('serialNumber') as string
  const macId = formData.get('macId') as string
  const antivirusInstalled = formData.get('antivirusInstalled') === 'on'
  const complaints = formData.get('complaints') as string
  const notes = formData.get('notes') as string
  const currentEmployeeId = formData.get('currentEmployeeId') as string || null
  const oldUsers = formData.get('oldUsers') as string || null

  let status = rawStatus || (currentEmployeeId ? 'In Use' : 'Available')
  if (currentEmployeeId && status === 'Available') {
    status = 'In Use'
  } else if (!currentEmployeeId && status === 'In Use') {
    status = 'Available'
  }

  await prisma.computer.create({
    data: {
      assetTag,
      computerName,
      brand,
      model,
      status,
      department,
      processor,
      graphicsCard,
      ram,
      storage,
      operatingSystem,
      office365Login,
      serialNumber,
      macId,
      oldUsers,
      antivirusInstalled,
      complaints,
      notes,
      currentEmployeeId
    }
  })

  revalidatePath('/computers')
  redirect('/computers')
}

export async function addSoftwareAsset(formData: FormData) {
  const name = formData.get('name') as string
  const vendor = formData.get('vendor') as string
  const category = formData.get('category') as string
  const licenseType = formData.get('licenseType') as string

  const credentials = formData.get('credentials') as string
  const password = formData.get('password') as string
  const expiryDate = formData.get('expiryDate') as string
  const neverExpires = formData.get('neverExpires') === 'on'
  const description = formData.get('description') as string
  const allowedInstallationsRaw = formData.get('allowedInstallations') as string
  const allowedInstallations = allowedInstallationsRaw ? parseInt(allowedInstallationsRaw, 10) : 1

  await prisma.softwareAsset.create({
    data: {
      name,
      vendor,
      category,
      licenseType,
      credentials,
      password,
      expiryDate: expiryDate && !neverExpires ? new Date(expiryDate) : null,
      neverExpires,
      description,
      allowedInstallations,
      status: 'Available'
    }
  })

  revalidatePath('/software-licenses')
  redirect('/software-licenses')
}

export async function addEmployee(formData: FormData) {
  const employeeId = formData.get('employeeId') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const department = formData.get('department') as string

  await prisma.employee.create({
    data: {
      employeeId,
      name,
      email,
      department
    }
  })

  revalidatePath('/employees')
  redirect('/employees')
}

export async function importComputersFromCSV(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const text = await file.text();

  // Robust CSV parser to handle newlines inside quotes
  const parseCSV = (csvText: string) => {
    const result: string[][] = [];
    let row: string[] = [];
    let currentVal = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      if (char === '"') {
        if (inQuotes && csvText[i + 1] === '"') {
          currentVal += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && csvText[i + 1] === '\n') i++;
        row.push(currentVal.trim());
        if (row.some(val => val !== '')) result.push(row);
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    if (currentVal || row.length > 0) {
      row.push(currentVal.trim());
      if (row.some(val => val !== '')) result.push(row);
    }
    return result;
  };

  const lines = parseCSV(text);
  if (lines.length < 2) throw new Error("CSV file is empty or missing headers");

  let successCount = 0;

  for (let i = 1; i < lines.length; i++) {
    try {
      const currentline = lines[i];

      const assetTag = currentline[1];
      if (!assetTag || assetTag === 'System No' || assetTag.trim() === '') continue;

      const model = currentline[4];
      const computerNameRaw = currentline[5] ? currentline[5] : (model || 'Unknown PC');
      const computerName = computerNameRaw.substring(0, 100);

      const processor = currentline[6];
      const graphicsCard = currentline[7];
      const ram = currentline[8];
      const storage = currentline[9];
      const operatingSystem = currentline[10];
      const office365Login = currentline[11];
      const serialNumber = currentline[12];
      const deviceId = currentline[13];
      const macId = currentline[14];
      const oldUsers = currentline[15];
      const isAntivirus = currentline[16]?.toLowerCase() === 'yes';
      const complaints = currentline[17];
      const notes = currentline[18] || '';
      const department = currentline[2];

      const status = "Available";
      const employeeId = null;

      await prisma.computer.upsert({
        where: { assetTag: assetTag },
        update: {
          computerName: computerName,
          model: model,
          processor: processor,
          graphicsCard: graphicsCard,
          ram: ram,
          storage: storage,
          operatingSystem: operatingSystem,
          office365Login: office365Login,
          serialNumber: serialNumber,
          deviceId: deviceId,
          macId: macId,
          oldUsers: oldUsers,
          antivirusInstalled: isAntivirus,
          complaints: complaints,
          notes: notes,
          department: department,
          status: status,
          currentEmployeeId: employeeId
        },
        create: {
          assetTag: assetTag,
          computerName: computerName,
          model: model,
          processor: processor,
          graphicsCard: graphicsCard,
          ram: ram,
          storage: storage,
          operatingSystem: operatingSystem,
          office365Login: office365Login,
          serialNumber: serialNumber,
          deviceId: deviceId,
          macId: macId,
          oldUsers: oldUsers,
          antivirusInstalled: isAntivirus,
          complaints: complaints,
          notes: notes,
          department: department,
          status: status,
          currentEmployeeId: employeeId
        }
      });

      successCount++;
    } catch (err: any) {
      console.error(`Error importing row:`, err.message);
    }
  }

  revalidatePath('/computers');
  return { success: true, count: successCount };
}

export async function syncEmployeesFromEMS() {
  try {
    const [resActive, resInactive] = await Promise.all([
      fetch('https://api.shripadmavathi.com/auth/users?page=0&size=500&isActive=true', { cache: 'no-store' }),
      fetch('https://api.shripadmavathi.com/auth/users?page=0&size=500&isActive=false', { cache: 'no-store' })
    ]);

    if (!resActive.ok || !resInactive.ok) {
      throw new Error(`Failed to fetch from EMS API (Active: ${resActive.status}, Inactive: ${resInactive.status})`);
    }

    const dataActive = await resActive.json();
    const dataInactive = await resInactive.json();

    const extractUsers = (data: any) => {
      if (Array.isArray(data)) return data;
      if (data.content && Array.isArray(data.content)) return data.content;
      if (data.users && Array.isArray(data.users)) return data.users;
      if (data.data && Array.isArray(data.data)) return data.data;
      const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
      return arrayKey ? data[arrayKey] : [];
    };

    const users = [...extractUsers(dataActive), ...extractUsers(dataInactive)];

    if (users.length === 0) {
      throw new Error("Could not find an array of users in the EMS response.");
    }

    let count = 0;
    for (const user of users) {
      if (!user.employeeId) continue;

      await prisma.employee.upsert({
        where: { employeeId: user.employeeId.toString() },
        update: {
          name: user.name || "Unknown",
          email: user.email || `${user.employeeId}@example.com`,
          department: user.department || null,
          designation: user.Designation || null,
          location: user.location || null,
          status: user.isActive !== false ? "Active" : "Inactive"
        },
        create: {
          employeeId: user.employeeId.toString(),
          name: user.name || "Unknown",
          email: user.email || `${user.employeeId}@example.com`,
          department: user.department || null,
          designation: user.Designation || null,
          location: user.location || null,
          status: user.isActive !== false ? "Active" : "Inactive"
        }
      });
      count++;
    }

    revalidatePath('/employees');
    return { success: true, count };
  } catch (err: any) {
    console.error("EMS Sync Error:", err);
    throw new Error(err.message);
  }
}

export async function editEmployee(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const department = formData.get('department') as string

  await prisma.employee.update({
    where: { id },
    data: { name, email, department }
  })

  revalidatePath('/employees')
}

export async function editComputer(formData: FormData) {
  const id = formData.get('id') as string
  const assetTag = formData.get('assetTag') as string
  const computerName = formData.get('computerName') as string
  const brand = formData.get('brand') as string
  const model = formData.get('model') as string
  const rawStatus = formData.get('status') as string

  const department = formData.get('department') as string
  const processor = formData.get('processor') as string
  const graphicsCard = formData.get('graphicsCard') as string
  const ram = formData.get('ram') as string
  const storage = formData.get('storage') as string
  const operatingSystem = formData.get('operatingSystem') as string
  const office365Login = formData.get('office365Login') as string
  const serialNumber = formData.get('serialNumber') as string
  const macId = formData.get('macId') as string
  const antivirusInstalled = formData.get('antivirusInstalled') === 'on'
  const complaints = formData.get('complaints') as string
  const notes = formData.get('notes') as string
  const newEmployeeId = formData.get('currentEmployeeId') as string || null
  const oldUsers = formData.get('oldUsers') as string || null

  const existingComputer = await prisma.computer.findUnique({
    where: { id },
    include: { currentEmployee: true }
  });

  let status = rawStatus || (newEmployeeId ? 'In Use' : 'Available')
  if (newEmployeeId && status === 'Available') {
    status = 'In Use'
  } else if (!newEmployeeId && status === 'In Use') {
    status = 'Available'
  }

  const resolvedOldUsers = oldUsers ||
    (existingComputer && existingComputer.currentEmployeeId !== newEmployeeId && existingComputer.currentEmployee?.name
      ? existingComputer.currentEmployee.name
      : existingComputer?.oldUsers || null);

  await prisma.computer.update({
    where: { id },
    data: {
      assetTag,
      computerName,
      brand,
      model,
      status,
      department,
      processor,
      graphicsCard,
      ram,
      storage,
      operatingSystem,
      office365Login,
      serialNumber,
      macId,
      oldUsers: resolvedOldUsers,
      antivirusInstalled,
      complaints,
      notes,
      currentEmployeeId: newEmployeeId
    }
  })

  // Track history if user changed
  if (existingComputer && existingComputer.currentEmployeeId !== newEmployeeId) {
    await prisma.computerHistory.create({
      data: {
        computerId: id,
        previousEmployeeId: existingComputer.currentEmployeeId,
        newEmployeeId,
        action: newEmployeeId ? 'Assigned' : 'Unassigned',
        performedBy: 'System'
      }
    });
  }

  revalidatePath('/computers')
  revalidatePath(`/computers/${id}`)
  redirect(`/computers/${id}`)
}

export async function assignComputer(computerId: string, newEmployeeId: string | null) {
  const computer = await prisma.computer.findUnique({ where: { id: computerId } });
  if (!computer) throw new Error("Computer not found");

  const previousEmployeeId = computer.currentEmployeeId;

  if (previousEmployeeId !== newEmployeeId) {
    await prisma.computer.update({
      where: { id: computerId },
      data: {
        currentEmployeeId: newEmployeeId,
        status: newEmployeeId ? 'In Use' : 'Available'
      }
    });

    await prisma.computerHistory.create({
      data: {
        computerId,
        previousEmployeeId,
        newEmployeeId,
        action: newEmployeeId ? 'Assigned' : 'Unassigned',
        performedBy: 'System'
      }
    });

    // Unassign software from old user and assign to new user (optional, depending on logic, but let's keep it simple for now)
  }

  revalidatePath('/computers');
  revalidatePath(`/computers/${computerId}`);
}

export async function searchEmployees(query: string, page: number = 1) {
  const pageSize = 5;
  const skip = (page - 1) * pageSize;

  const where = query ? {
    OR: [
      { name: { contains: query } },
      { email: { contains: query } },
      { employeeId: { contains: query } }
    ]
  } : {};

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: 'asc' }
    }),
    prisma.employee.count({ where })
  ]);

  return {
    employees,
    totalPages: Math.ceil(total / pageSize)
  };
}

export async function assignSoftwareAsset(formData: FormData) {
  const softwareAssetId = formData.get('softwareAssetId') as string
  const computerId = formData.get('computerId') as string | null
  const employeeId = formData.get('employeeId') as string | null

  if (!softwareAssetId || (!computerId && !employeeId)) {
    throw new Error('Invalid assignment data')
  }

  // Check if we have available installations
  const asset = await prisma.softwareAsset.findUnique({
    where: { id: softwareAssetId },
    include: { assignments: { where: { status: 'Active' } } }
  })

  if (!asset) throw new Error('Asset not found')

  if (asset.assignments.length >= asset.allowedInstallations) {
    throw new Error('No available installations for this license')
  }

  // Create assignment
  await prisma.softwareAssignment.create({
    data: {
      softwareAssetId,
      computerId: computerId || null,
      employeeId: employeeId || null,
      status: 'Active'
    }
  })

  // Update status to 'In Use'
  await prisma.softwareAsset.update({
    where: { id: softwareAssetId },
    data: { status: 'In Use' }
  })

  revalidatePath('/software-licenses')
  redirect('/software-licenses')
}

export async function unassignSoftwareAsset(assignmentId: string, softwareAssetId: string) {
  // Update the assignment status to 'Removed'
  await prisma.softwareAssignment.update({
    where: { id: assignmentId },
    data: {
      status: 'Removed',
      removedDate: new Date()
    }
  })

  // Check if there are any remaining active assignments
  const activeAssignments = await prisma.softwareAssignment.count({
    where: { softwareAssetId, status: 'Active' }
  })

  // If none, set asset status back to 'Available'
  if (activeAssignments === 0) {
    await prisma.softwareAsset.update({
      where: { id: softwareAssetId },
      data: { status: 'Available' }
    })
  }

  revalidatePath(`/software-licenses/${softwareAssetId}/assign`)
  revalidatePath('/software-licenses')
}

export async function editSoftwareAsset(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const vendor = formData.get('vendor') as string;
  const category = formData.get('category') as string;
  const licenseType = formData.get('licenseType') as string;
  const credentials = formData.get('credentials') as string;
  const password = formData.get('password') as string;
  const allowedInstallations = parseInt(formData.get('allowedInstallations') as string) || 1;
  const expiryDate = formData.get('expiryDate') as string;
  const neverExpires = formData.get('neverExpires') === 'on';

  await prisma.softwareAsset.update({
    where: { id },
    data: {
      name,
      vendor: vendor || null,
      category: category || null,
      licenseType,
      credentials: credentials || null,
      password: password || null,
      allowedInstallations,
      expiryDate: (neverExpires || !expiryDate) ? null : new Date(expiryDate),
      neverExpires,
    }
  });

  revalidatePath('/software-licenses');
  revalidatePath(`/software-licenses/${id}`);
  redirect(`/software-licenses/${id}`);
}
