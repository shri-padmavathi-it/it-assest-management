import { prisma } from "@/lib/prisma"
import { unassignSoftwareAsset } from "@/app/actions"
import Link from "next/link"
import { ArrowLeft, Monitor, Trash2 } from "lucide-react"
import { AssignLicenseForm } from "@/components/software-licenses/assign-license-form"

export default async function AssignSoftwarePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const asset = await prisma.softwareAsset.findUnique({
    where: { id },
    include: { 
      assignments: { 
        where: { status: 'Active' },
        include: { computer: true, employee: true }
      } 
    }
  })

  if (!asset) {
    return <div>Software Asset not found</div>
  }

  // Fetch computers for the dropdown
  const computers = await prisma.computer.findMany({
    orderBy: { computerName: 'asc' },
    include: { currentEmployee: true }
  })

  const serializedComputers = computers.map(c => ({
    id: c.id,
    computerName: c.computerName,
    assetTag: c.assetTag,
    brand: c.brand,
    model: c.model,
    currentEmployeeName: c.currentEmployee?.name || null,
  }))

  const remainingInstallations = asset.allowedInstallations - asset.assignments.length
  const isSubscription = asset.licenseType.toLowerCase().includes("subscription");
  const backHref = isSubscription ? "/software-licenses/subscriptions" : "/software-licenses/permanent";

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href={backHref} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assign License: {asset.name}</h2>
          <p className="text-muted-foreground">Assign this license to a company computer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold border-b pb-2 mb-4 text-sm uppercase text-muted-foreground tracking-wider">License Status</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Used Installations</div>
                <div className="text-2xl font-bold">{asset.assignments.length} <span className="text-muted-foreground text-lg">/ {asset.allowedInstallations}</span></div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Remaining</div>
                <div className={`text-xl font-bold ${remainingInstallations === 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {remainingInstallations}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {remainingInstallations > 0 ? (
            <AssignLicenseForm
              softwareAssetId={asset.id}
              computers={serializedComputers}
            />
          ) : (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 dark:bg-indigo-950/20 dark:border-indigo-900/40 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                Fully Assigned ({asset.assignments.length} / {asset.allowedInstallations})
              </div>
              <p className="text-xs text-muted-foreground max-w-sm">
                All available installations for this software license have been assigned. To assign to a new computer, unassign one of the existing installations below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Active Installations Table */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg">Active Installations ({asset.assignments.length})</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3">Installed On (Computer)</th>
                <th className="px-6 py-3">Assigned User</th>
                <th className="px-6 py-3">Installation Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {asset.assignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No active installations. Use the form above to assign this license.
                  </td>
                </tr>
              ) : (
                asset.assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      {assignment.computer ? (
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-semibold">{assignment.computer.computerName}</div>
                            <div className="text-xs text-muted-foreground font-mono">{assignment.computer.assetTag}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not attached to computer</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {assignment.computer?.currentEmployee ? (
                        <div>
                          <div className="font-medium">{assignment.computer.currentEmployee.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{assignment.computer.currentEmployee.employeeId}</div>
                        </div>
                      ) : assignment.employee ? (
                        <div>
                          <div className="font-medium">{assignment.employee.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{assignment.employee.employeeId}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(assignment.installedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={unassignSoftwareAsset.bind(null, assignment.id, asset.id)}>
                        <button type="submit" className="text-destructive hover:underline text-xs flex items-center gap-1 ml-auto cursor-pointer">
                          <Trash2 className="h-3.5 w-3.5" />
                          Unassign
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
