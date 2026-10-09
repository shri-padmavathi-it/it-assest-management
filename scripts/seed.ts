import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create or update Employees
  const employees = [
    {
      employeeId: 'EMP001',
      name: 'Rakesh',
      email: '[rakesh@example.com](mailto:rakesh@example.com)',
      department: 'Engineering',
      designation: 'Engineer',
      location: 'Bangalore',
    },
    {
      employeeId: 'EMP002',
      name: 'Rahul',
      email: '[rahul@example.com](mailto:rahul@example.com)',
      department: 'Engineering',
      designation: 'Senior Engineer',
      location: 'Bangalore',
    },
    {
      employeeId: 'EMP003',
      name: 'Arun',
      email: '[arun@example.com](mailto:arun@example.com)',
      department: 'Design',
      designation: 'Designer',
      location: 'Bangalore',
    },
    {
      employeeId: 'EMP004',
      name: 'Priya',
      email: '[priya@example.com](mailto:priya@example.com)',
      department: 'Management',
      designation: 'Manager',
      location: 'Bangalore',
    },
  ]

  const employeeRecords = []

  for (const employee of employees) {
    const record = await prisma.employee.upsert({
      where: { employeeId: employee.employeeId },
      update: employee,
      create: employee,
    })

      ```
employeeRecords.push(record)
```

  }

  const [rakesh, rahul, arun, priya] = employeeRecords

  // Create or update Computers
  const computers = [
    {
      assetTag: 'SPC@008',
      computerName: 'Engineering Laptop',
      status: 'In Use',
      currentEmployeeId: rakesh.id,
      department: 'Engineering',
      location: 'Bangalore',
    },
    {
      assetTag: 'SPC@014',
      computerName: 'Engineering Laptop 2',
      status: 'In Use',
      currentEmployeeId: rahul.id,
      department: 'Engineering',
      location: 'Bangalore',
    },
    {
      assetTag: 'SPC@021',
      computerName: 'Design Workstation',
      status: 'In Use',
      currentEmployeeId: arun.id,
      department: 'Design',
      location: 'Bangalore',
    },
    {
      assetTag: 'SPC@025',
      computerName: 'Spare Laptop',
      status: 'Available',
      currentEmployeeId: null,
      location: 'IT Storage',
    },
    {
      assetTag: 'SPC@031',
      computerName: 'Management Laptop',
      status: 'In Use',
      currentEmployeeId: priya.id,
      department: 'Management',
      location: 'Bangalore',
    },
  ]

  for (const computer of computers) {
    await prisma.computer.upsert({
      where: { assetTag: computer.assetTag },
      update: computer,
      create: computer,
    })
  }

  // Create or update Software Assets
  const expDate = new Date()
  expDate.setFullYear(expDate.getFullYear() + 1)

  const expiringSoonDate = new Date()
  expiringSoonDate.setDate(expiringSoonDate.getDate() + 15)

  const softwareAssets = [
    {
      name: 'ZW CAD',
      vendor: 'ZWSOFT',
      category: 'CAD',
      licenseType: 'Per Device',
      allowedInstallations: 5,
      expiryDate: expDate,
    },
    {
      name: 'Creo',
      vendor: 'PTC',
      category: 'CAD',
      licenseType: 'Per Device',
      allowedInstallations: 1,
      expiryDate: expDate,
    },
    {
      name: 'SolidWorks',
      vendor: 'Dassault Systèmes',
      category: 'CAD',
      licenseType: 'Per User',
      allowedInstallations: 1,
      expiryDate: expDate,
    },
  ]

  for (const software of softwareAssets) {
    const existing = await prisma.softwareAsset.findFirst({
      where: { name: software.name },
    })

      ```
if (existing) {
  await prisma.softwareAsset.update({
    where: { id: existing.id },
    data: software,
  })
} else {
  await prisma.softwareAsset.create({
    data: software,
  })
}
```

  }

  // The current schema has no separate License model.
  // Individual license records must not be created through
  // SoftwareAssignment, which represents installations/assignments.

  console.log('Database seeded successfully!')
}

main()
  .catch((error) => {
    console.error('Database seeding failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
