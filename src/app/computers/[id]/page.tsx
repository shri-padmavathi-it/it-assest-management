import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Monitor, ShieldCheck, User } from "lucide-react"
import { notFound } from "next/navigation"
import { AssignComputerModal } from "@/components/computers/assign-computer-modal"

export default async function ComputerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const computer = await prisma.computer.findUnique({
    where: { id },
    include: {
      currentEmployee: true,
      history: {
        include: { previousEmployee: true, newEmployee: true },
        orderBy: { createdAt: 'desc' }
      },
      softwareAssignments: {
        include: { softwareAsset: true },
        orderBy: { installedDate: 'desc' }
      }
    }
  })

  if (!computer) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/computers" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{computer.computerName} Profile</h2>
          <p className="text-muted-foreground">Asset ID: {computer.assetTag}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 font-semibold">
                <Monitor className="h-5 w-5 text-primary" />
                Device Status
              </div>
              <AssignComputerModal computerId={computer.id} currentEmployee={computer.currentEmployee as any} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold ${computer.status === 'In Use' ? 'text-green-500' : 'text-blue-500'}`}>
                  {computer.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current User</span>
                <span className="font-medium">{computer.currentEmployee?.name || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{computer.department || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seqrite Antivirus</span>
                <span className="font-medium flex items-center gap-1">
                  {computer.antivirusInstalled ? (
                    <><ShieldCheck className="h-4 w-4 text-green-500" /> Yes</>
                  ) : 'No'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 font-semibold border-b pb-2 text-red-500">
              Remarks & Complaints
            </div>
            <div className="text-sm space-y-4">
              <div>
                <span className="font-semibold text-muted-foreground block text-xs">COMPLAINTS</span>
                <p>{computer.complaints || 'None reported.'}</p>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block text-xs">REMARKS</span>
                <p>{computer.notes || 'No remarks added.'}</p>
              </div>
            </div>
          </div>
          
          {/* Installed Licenses */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h3 className="font-semibold border-b pb-2">Assigned Software & Licenses</h3>
            <div className="space-y-2">
              {computer.softwareAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active software assignments.</p>
              ) : (
                computer.softwareAssignments.map(assignment => (
                  <div key={assignment.id} className="flex justify-between items-center p-3 border rounded-md text-sm">
                    <div>
                      <div className="font-semibold">{assignment.softwareAsset.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{assignment.softwareAsset.credentials || 'No Key/Username'}</div>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-500">
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Hardware & History */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Hardware Specs */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="font-semibold">Hardware Specifications</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium w-1/3">Brand / Model</td><td className="px-4 py-3">{computer.brand} {computer.model}</td></tr>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium">Processor</td><td className="px-4 py-3">{computer.processor || '—'}</td></tr>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium">Graphics Card</td><td className="px-4 py-3">{computer.graphicsCard || '—'}</td></tr>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium">RAM</td><td className="px-4 py-3">{computer.ram || '—'}</td></tr>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium">Storage (ROM)</td><td className="px-4 py-3">{computer.storage || '—'}</td></tr>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium">Serial #</td><td className="px-4 py-3 font-mono">{computer.serialNumber || '—'}</td></tr>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium">MAC ID</td><td className="px-4 py-3 font-mono">{computer.macId || '—'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Software Specs */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="font-semibold">Software Details</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium w-1/3">Windows Edition</td><td className="px-4 py-3">{computer.operatingSystem || '—'}</td></tr>
                  <tr className="border-b last:border-0"><td className="px-4 py-3 bg-muted/20 font-medium">Office 365 Login</td><td className="px-4 py-3">{computer.office365Login || '—'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>



          {/* Old Users History */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h3 className="font-semibold border-b pb-2">Old Users (Assignment History)</h3>
            <div className="space-y-4">
              {computer.history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assignment history found.</p>
              ) : (
                <div className="relative border-l border-muted ml-3 space-y-6">
                  {computer.history.map(hist => (
                    <div key={hist.id} className="pl-6 relative">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1"></div>
                      <div className="text-sm font-medium">{hist.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {hist.previousEmployee ? `${hist.previousEmployee.name} -> ` : ''}
                        {hist.newEmployee ? hist.newEmployee.name : 'Unassigned'}
                      </div>
                      <div className="text-xs text-muted-foreground/50 mt-1">{new Date(hist.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
