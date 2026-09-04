import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const brands = ["Dell", "HP", "Lenovo", "Apple", "Asus"]
const models = ["Latitude", "ThinkPad", "MacBook Pro", "EliteBook", "ZenBook"]
const processors = ["Intel Core i5-12400", "Intel Core i7-12700H", "Intel Core i9-13900K", "AMD Ryzen 5 5600X", "AMD Ryzen 9 5900X", "Apple M1 Pro", "Apple M2 Max"]
const graphicsCards = ["Integrated Graphics", "NVIDIA RTX 3060", "NVIDIA RTX 4070", "NVIDIA RTX A2000", "AMD Radeon RX 6700 XT"]
const rams = ["8GB DDR4", "16GB DDR4", "32GB DDR5", "64GB DDR5"]
const storages = ["256GB SSD", "512GB NVMe SSD", "1TB NVMe SSD", "2TB NVMe SSD"]
const operatingSystems = ["Windows 11 Pro", "Windows 10 Enterprise", "macOS Ventura", "macOS Sonoma", "Ubuntu 22.04 LTS"]

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateRandomMac() {
  return "XX:XX:XX:XX:XX:XX".replace(/X/g, () => {
    return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  })
}

function generateRandomSerial() {
  return Math.random().toString(36).substring(2, 12).toUpperCase()
}

async function main() {
  const computers = await prisma.computer.findMany()

  for (const pc of computers) {
    const isMac = pc.computerName.toLowerCase().includes("mac") || pc.brand === "Apple"
    
    await prisma.computer.update({
      where: { id: pc.id },
      data: {
        brand: pc.brand || (isMac ? "Apple" : getRandom(brands.filter(b => b !== "Apple"))),
        model: pc.model || (isMac ? "MacBook Pro" : getRandom(models.filter(m => m !== "MacBook Pro"))),
        processor: pc.processor || (isMac ? "Apple M2 Max" : getRandom(processors.filter(p => !p.includes("Apple")))),
        graphicsCard: pc.graphicsCard || getRandom(graphicsCards),
        ram: pc.ram || getRandom(rams),
        storage: pc.storage || getRandom(storages),
        operatingSystem: pc.operatingSystem || (isMac ? "macOS Sonoma" : getRandom(operatingSystems.filter(o => !o.includes("macOS")))),
        serialNumber: pc.serialNumber || generateRandomSerial(),
        macId: pc.macId || generateRandomMac(),
        office365Login: pc.office365Login || `user.${pc.assetTag.replace('@', '')}@company.com`.toLowerCase()
      }
    })
  }

  console.log(`Successfully populated hardware details for ${computers.length} computers.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
