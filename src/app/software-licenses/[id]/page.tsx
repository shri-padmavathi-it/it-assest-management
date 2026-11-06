import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Monitor, User, Edit2, ShieldCheck, KeyRound, Calendar } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

export default async function SoftwareDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const asset = await prisma.softwareAsset.findUnique({
    where: { id },
    include: {
      assignments: {
        where: { status: 'Active' },
        include: { computer: true, employee: true }
      },
      history: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!asset) {
    notFound()
  }

  const remainingInstallations = asset.allowedInstallations - asset.assignments.length;

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{asset.name}</h2>
            <p className="text-muted-foreground">Vendor: {asset.vendor || '—'} • Category: {asset.category || '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/software-licenses/${asset.id}/assign`} className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 text-secondary-foreground">
            Assign License
          </Link>
          <Link href={`/software-licenses/${asset.id}/edit`} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Edit2 className="h-4 w-4" />
            Edit License
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: License Details */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h3 className="font-semibold border-b pb-2 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              Credentials & Status
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs font-semibold">STATUS</span>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold w-fit mt-1 ${
                  asset.status === 'Available' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  asset.status === 'In Use' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {asset.status}
                </span>
              </div>
              
              <div className="flex flex-col pt-2 border-t">
                <span className="text-muted-foreground text-xs font-semibold">LICENSE TYPE</span>
                <span className="font-medium mt-1">{asset.licenseType}</span>
              </div>

              <div className="flex flex-col pt-2 border-t">
                <span className="text-muted-foreground text-xs font-semibold">KEY / USERNAME</span>
                <span className="font-mono mt-1">{asset.credentials || '—'}</span>
              </div>

              <div className="flex flex-col pt-2 border-t">
                <span className="text-muted-foreground text-xs font-semibold">PASSWORD</span>
                <span className="font-mono mt-1 text-muted-foreground">{asset.password ? '••••••••' : '—'}</span>
              </div>

              <div className="flex flex-col pt-2 border-t">
                <span className="text-muted-foreground text-xs font-semibold">LICENSE START</span>
                <span className="font-medium mt-1">
                  {(() => {
                    const match = asset.description?.match(/\[START_DATE:([\d-]+)\]/);
                    if (match && match[1]) {
                      const parts = match[1].split("-");
                      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                    return new Date(asset.createdAt).toLocaleDateString();
                  })()}
                </span>
              </div>

              <div className="flex flex-col pt-2 border-t">
                <span className="text-muted-foreground text-xs font-semibold">LICENSE END</span>
                <span className="font-medium mt-1 flex items-center gap-1.5">
                  {asset.neverExpires ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Never Ending
                    </span>
                  ) : (
                    asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : '—'
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
             <h3 className="font-semibold border-b pb-2 text-sm uppercase text-muted-foreground tracking-wider">Installations</h3>
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

        {/* Middle/Right Column: Assignments */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Active Assignments */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <h3 className="font-semibold">Active Assignments</h3>
            </div>
            <div className="p-4">
              {asset.assignments.length === 0 ? (
                <div className="text-muted-foreground text-center py-6 border border-dashed rounded-lg bg-muted/20">
                  No active assignments found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {asset.assignments.map(assignment => (
                    <div key={assignment.id} className="border border-indigo-500/20 rounded-xl p-4 flex flex-col space-y-2.5 bg-card shadow-sm border-l-4 border-l-indigo-500">
                      {assignment.computer && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-100">
                          <div className="flex items-center gap-2 min-w-0">
                            <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <Link href={`/computers/${assignment.computer.id}`} className="font-semibold text-sm hover:underline truncate">
                              {assignment.computer.computerName}
                            </Link>
                          </div>
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 shrink-0">
                            {assignment.computer.assetTag}
                          </span>
                        </div>
                      )}
                      {assignment.employee && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-100">
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                            <span className="font-semibold text-sm truncate">{assignment.employee.name}</span>
                          </div>
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 shrink-0">
                            {assignment.employee.employeeId}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pt-1 border-t flex justify-between items-center">
                        <span>Assigned: {new Date(assignment.installedDate).toLocaleDateString()}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      </div>
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
