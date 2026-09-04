import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10)
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      name: "IT Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin"
    }
  })
  
  console.log("Admin user seeded/updated:", admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
