import { editComputer } from "@/app/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EmployeeSelectDropdown } from "@/components/computers/employee-select-dropdown"

export default async function EditComputerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const computer = await prisma.computer.findUnique({
    where: { id },
    include: { currentEmployee: true }
  });

  if (!computer) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href={`/computers`} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Computer Profile</h2>
          <p className="text-muted-foreground">Update hardware details, software, or assignments.</p>
        </div>
      </div>
      
      <form action={editComputer} className="rounded-md border bg-card text-card-foreground shadow-sm p-6 space-y-8">
        <input type="hidden" name="id" value={computer.id} />
        
        {/* Basic Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="assetTag" className="text-sm font-medium">System No / Asset ID</label>
              <input required id="assetTag" name="assetTag" defaultValue={computer.assetTag} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="computerName" className="text-sm font-medium">Device Name</label>
              <input required id="computerName" name="computerName" defaultValue={computer.computerName} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="brand" className="text-sm font-medium">Brand</label>
              <input id="brand" name="brand" defaultValue={computer.brand || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="model" className="text-sm font-medium">Laptop Model</label>
              <input id="model" name="model" defaultValue={computer.model || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="serialNumber" className="text-sm font-medium">Serial #</label>
              <input id="serialNumber" name="serialNumber" defaultValue={computer.serialNumber || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="macId" className="text-sm font-medium">MAC ID</label>
              <input id="macId" name="macId" defaultValue={computer.macId || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* Hardware Specs Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">2. Hardware Specifications</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="processor" className="text-sm font-medium">Processor</label>
              <input id="processor" name="processor" defaultValue={computer.processor || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="graphicsCard" className="text-sm font-medium">Graphics Card</label>
              <input id="graphicsCard" name="graphicsCard" defaultValue={computer.graphicsCard || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="ram" className="text-sm font-medium">RAM</label>
              <input id="ram" name="ram" defaultValue={computer.ram || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="storage" className="text-sm font-medium">Storage (ROM)</label>
              <input id="storage" name="storage" defaultValue={computer.storage || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* Software & Assignment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">3. Software & Assignment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="operatingSystem" className="text-sm font-medium">Windows Edition</label>
              <input id="operatingSystem" name="operatingSystem" defaultValue={computer.operatingSystem || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="office365Login" className="text-sm font-medium">Office 365 Login</label>
              <input id="office365Login" name="office365Login" defaultValue={computer.office365Login || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="currentEmployeeId" className="text-sm font-medium">Assigned User</label>
              <EmployeeSelectDropdown 
                inputName="currentEmployeeId"
                valueType="id"
                initialEmployeeId={computer.currentEmployeeId} 
                initialEmployeeName={computer.currentEmployee?.name} 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="oldUsers" className="text-sm font-medium">Old User</label>
              <EmployeeSelectDropdown 
                inputName="oldUsers"
                valueType="name"
                initialEmployeeName={computer.oldUsers}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="department" className="text-sm font-medium">Team / Department</label>
              <input id="department" name="department" defaultValue={computer.department || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="antivirusInstalled" name="antivirusInstalled" defaultChecked={computer.antivirusInstalled} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="antivirusInstalled" className="text-sm font-medium">Seqrite Antivirus Installed</label>
          </div>
        </div>

        {/* Status & Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">4. Status & Remarks</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select id="status" name="status" defaultValue={computer.status} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Not In Use">Not In Use</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="complaints" className="text-sm font-medium">Complaints</label>
              <input id="complaints" name="complaints" defaultValue={computer.complaints || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">Remarks (Notes)</label>
            <textarea id="notes" name="notes" defaultValue={computer.notes || ''} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
