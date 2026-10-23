import { prisma } from "@/lib/prisma"
import { unassignSoftwareAsset } from "@/app/actions"
import Link from "next/link"
import { ArrowLeft, Monitor, User, Trash2 } from "lucide-react"
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

  // Fetch computers and employees for the dropdowns
  const computers = await prisma.computer.findMany({
    orderBy: { computerName: 'asc' },
    include: { currentEmployee: true }
  })

  const employees = await prisma.employee.findMany({
    orderBy: { name: 'asc' }
  })

  const serializedComputers = computers.map(c => ({
    id: c.id,
    computerName: c.computerName,
    assetTag: c.assetTag,
    brand: c.brand,
    model: c.model,
    currentEmployeeName: c.currentEmployee?.name || null,
  }))

  const serializedEmployees = employees.map(e => ({
    id: e.id,
    name: e.name,
    employeeId: e.employeeId,
    department: e.department,
    designation: e.designation,
    email: e.email,
  }))

  const remainingInstallations = asset.allowedInstallations - asset.assignments.length

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/software-licenses" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assign License: {asset.name}</h2>
          <p className="text-muted-foreground">Assign this license to a computer or employee.</p>
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
              employees={serializedEmployees}
            />
          ) : (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 dark:bg-indigo-950/20 dark:border-indigo-900/40 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                Fully Assigned ({asset.assignments.length} / {asset.allowedInstallations})
              </div>
              <div className="font-bold text-xl text-foreground">Installation Limit Reached</div>
              <p className="text-sm text-muted-foreground max-w-md">
                This software license has reached its maximum allowed installations ({asset.allowedInstallations}). To assign this license to a new system or employee, please unassign an active assignment below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Active Assignments Section */}
      <div className="mt-12 border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Active Assignments</h3>
            <p className="text-sm text-muted-foreground">Systems and employees currently using this software license</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted border">
            {asset.assignments.length} of {asset.allowedInstallations} Used
          </span>
        </div>

        {asset.assignments.length === 0 ? (
          <div className="text-muted-foreground bg-muted/20 border border-dashed p-8 rounded-xl text-center">
            No active assignments found for this license yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {asset.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-indigo-500/20 bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 border-l-4 border-l-indigo-500"
              >
                {/* Header status bar */}
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Assignment
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">
                    Assigned: {new Date(assignment.installedDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Assignment details (Computer & Employee) */}
                <div className="space-y-2.5">
                  {assignment.computer && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-100">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-md shrink-0">
                          <Monitor className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                            Assigned Computer
                          </div>
                          <div className="font-bold text-sm truncate">
                            {assignment.computer.computerName}
                          </div>
                          {assignment.computer.model && (
                            <div className="text-[11px] text-muted-foreground truncate">
                              {assignment.computer.model}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                        {assignment.computer.assetTag}
                      </span>
                    </div>
                  )}

                  {assignment.employee && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-100">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-md shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
                            Assigned Employee
                          </div>
                          <div className="font-bold text-sm truncate">
                            {assignment.employee.name}
                          </div>
                          {assignment.employee.department && (
                            <div className="text-[11px] text-muted-foreground truncate">
                              {assignment.employee.department}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-bold px-2 py-1 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                        {assignment.employee.employeeId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer with Unassign Action */}
                <div className="pt-2 border-t flex justify-end">
                  <form action={unassignSoftwareAsset.bind(null, assignment.id, asset.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Unassign this license"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Unassign License</span>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
