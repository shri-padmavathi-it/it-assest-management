import { addComputer } from "@/app/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { EmployeeSelectDropdown } from "@/components/computers/employee-select-dropdown"

export default async function NewComputerPage() {

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/computers" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Computer</h2>
          <p className="text-muted-foreground">Register a new company computer with hardware details.</p>
        </div>
      </div>
      
      <form action={addComputer} className="rounded-md border bg-card text-card-foreground shadow-sm p-6 space-y-8">
        
        {/* Basic Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="assetTag" className="text-sm font-medium">System No / Asset ID</label>
              <input required id="assetTag" name="assetTag" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. SPC@100" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="computerName" className="text-sm font-medium">Device Name</label>
              <input required id="computerName" name="computerName" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. LAPTOP-X8C9D" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="brand" className="text-sm font-medium">Brand</label>
              <input id="brand" name="brand" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Dell" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="model" className="text-sm font-medium">Laptop Model</label>
              <input id="model" name="model" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Latitude 7420" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="serialNumber" className="text-sm font-medium">Serial #</label>
              <input id="serialNumber" name="serialNumber" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 5CG0123456" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="macId" className="text-sm font-medium">MAC ID</label>
              <input id="macId" name="macId" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 00:1B:44:11:3A:B7" />
            </div>
          </div>
        </div>

        {/* Hardware Specs Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">2. Hardware Specifications</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="processor" className="text-sm font-medium">Processor</label>
              <input id="processor" name="processor" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Intel Core i7 12th Gen" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="graphicsCard" className="text-sm font-medium">Graphics Card</label>
              <input id="graphicsCard" name="graphicsCard" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. NVIDIA RTX 3060" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="ram" className="text-sm font-medium">RAM</label>
              <input id="ram" name="ram" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 16GB DDR4" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="storage" className="text-sm font-medium">Storage (ROM)</label>
              <input id="storage" name="storage" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. 512GB NVMe SSD" />
            </div>
          </div>
        </div>

        {/* Software & Assignment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">3. Software & Assignment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="operatingSystem" className="text-sm font-medium">Windows Edition</label>
              <input id="operatingSystem" name="operatingSystem" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Windows 11 Pro" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="office365Login" className="text-sm font-medium">Office 365 Login</label>
              <input id="office365Login" name="office365Login" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. user@company.com" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="currentEmployeeId" className="text-sm font-medium">Assigned User</label>
              <EmployeeSelectDropdown inputName="currentEmployeeId" valueType="id" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="oldUsers" className="text-sm font-medium">Old User</label>
              <EmployeeSelectDropdown inputName="oldUsers" valueType="name" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="department" className="text-sm font-medium">Team / Department</label>
              <input id="department" name="department" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Engineering" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="antivirusInstalled" name="antivirusInstalled" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="antivirusInstalled" className="text-sm font-medium">Seqrite Antivirus Installed</label>
          </div>
        </div>

        {/* Status & Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">4. Status & Remarks</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select id="status" name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Not In Use">Not In Use</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="complaints" className="text-sm font-medium">Complaints</label>
              <input id="complaints" name="complaints" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Battery drains quickly" />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">Remarks (Notes)</label>
            <textarea id="notes" name="notes" rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Any additional notes about this machine..."></textarea>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
            Save Computer Profile
          </button>
        </div>
      </form>
    </div>
  )
}
