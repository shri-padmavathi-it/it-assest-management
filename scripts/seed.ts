import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create Employees
  const rakesh = await prisma.employee.create({
    data: { employeeId: 'EMP001', name: 'Rakesh', email: 'rakesh@example.com', department: 'Engineering', designation: 'Engineer', location: 'Bangalore' }
  })
  const rahul = await prisma.employee.create({
    data: { employeeId: 'EMP002', name: 'Rahul', email: 'rahul@example.com', department: 'Engineering', designation: 'Senior Engineer', location: 'Bangalore' }
  })
  const arun = await prisma.employee.create({
    data: { employeeId: 'EMP003', name: 'Arun', email: 'arun@example.com', department: 'Design', designation: 'Designer', location: 'Bangalore' }
  })
  const priya = await prisma.employee.create({
    data: { employeeId: 'EMP004', name: 'Priya', email: 'priya@example.com', department: 'Management', designation: 'Manager', location: 'Bangalore' }
  })

  // Create Computers
  const spc008 = await prisma.computer.create({
    data: { assetTag: 'SPC@008', computerName: 'Engineering Laptop', status: 'In Use', currentEmployeeId: rakesh.id, department: 'Engineering', location: 'Bangalore' }
  })
  const spc014 = await prisma.computer.create({
    data: { assetTag: 'SPC@014', computerName: 'Engineering Laptop 2', status: 'In Use', currentEmployeeId: rahul.id, department: 'Engineering', location: 'Bangalore' }
  })
  const spc021 = await prisma.computer.create({
    data: { assetTag: 'SPC@021', computerName: 'Design Workstation', status: 'In Use', currentEmployeeId: arun.id, department: 'Design', location: 'Bangalore' }
  })
  const spc025 = await prisma.computer.create({
    data: { assetTag: 'SPC@025', computerName: 'Spare Laptop', status: 'Available', location: 'IT Storage' }
  })
  const spc031 = await prisma.computer.create({
    data: { assetTag: 'SPC@031', computerName: 'Management Laptop', status: 'In Use', currentEmployeeId: priya.id, department: 'Management', location: 'Bangalore' }
  })

  // Create Software
  const zwcad = await prisma.software.create({
    data: { name: 'ZW CAD', vendor: 'ZWSOFT', category: 'CAD', licenseType: 'Per Device' }
  })
  const creo = await prisma.software.create({
    data: { name: 'Creo', vendor: 'PTC', category: 'CAD', licenseType: 'Per Device' }
  })
  const solidworks = await prisma.software.create({
    data: { name: 'SolidWorks', vendor: 'Dassault Systèmes', category: 'CAD', licenseType: 'Per User' }
  })

  // Create Licenses
  const expDate = new Date()
  expDate.setFullYear(expDate.getFullYear() + 1)
  
  const expiringSoonDate = new Date()
  expiringSoonDate.setDate(expiringSoonDate.getDate() + 15)

  // ZW CAD Licenses
  await prisma.license.create({ data: { licenseNumber: 'ZW-001', softwareId: zwcad.id, status: 'Assigned', expiryDate: expDate }})
  await prisma.license.create({ data: { licenseNumber: 'ZW-002', softwareId: zwcad.id, status: 'Assigned', expiryDate: expDate }})
  await prisma.license.create({ data: { licenseNumber: 'ZW-003', softwareId: zwcad.id, status: 'Assigned', expiryDate: expiringSoonDate }})
  await prisma.license.create({ data: { licenseNumber: 'ZW-004', softwareId: zwcad.id, status: 'Available', expiryDate: expDate }})
  await prisma.license.create({ data: { licenseNumber: 'ZW-005', softwareId: zwcad.id, status: 'Assigned', expiryDate: expDate }})

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
