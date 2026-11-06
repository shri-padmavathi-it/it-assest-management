import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/ui/back-button"
import { editSoftwareAsset } from "@/app/actions"
import { ShieldCheck, Calendar, Key, RefreshCw } from "lucide-react"

export default async function EditSoftwarePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const asset = await prisma.softwareAsset.findUnique({
    where: { id }
  })

  if (!asset) {
    notFound()
  }

  const isSubscription = asset.licenseType.toLowerCase().includes("subscription");

  // Format expiry date for the input field (YYYY-MM-DD)
  const formattedExpiryDate = asset.expiryDate 
    ? new Date(asset.expiryDate).toISOString().split('T')[0] 
    : '';

  const startDateMatch = asset.description?.match(/\[START_DATE:([\d-]+)\]/);
  const formattedStartDate = startDateMatch
    ? startDateMatch[1]
    : asset.createdAt
    ? new Date(asset.createdAt).toISOString().split('T')[0]
    : '';

  const cleanDescription = (asset.description || '').replace(/\[START_DATE:[\d-]+\]\n?/, '').trim();

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {isSubscription ? (
              <>
                <RefreshCw className="h-7 w-7 text-primary" />
                Edit Subscription: {asset.name}
              </>
            ) : (
              <>
                <Key className="h-7 w-7 text-primary" />
                Edit Permanent License: {asset.name}
              </>
            )}
          </h2>
          <p className="text-muted-foreground mt-0.5">
            Update software details, credentials, or license information.
          </p>
        </div>
      </div>

      <form action={editSoftwareAsset} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-8">
        <input type="hidden" name="id" value={asset.id} />
        
        {/* 1. Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Software Information</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Software Name *</label>
              <input required id="name" name="name" defaultValue={asset.name} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Microsoft Office 365" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="vendor" className="text-sm font-medium">Vendor / Publisher</label>
              <input id="vendor" name="vendor" defaultValue={asset.vendor || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Microsoft" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <input id="category" name="category" defaultValue={asset.category || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. MS Office, CAD, Finance" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="licenseType" className="text-sm font-medium">License Type *</label>
              {isSubscription ? (
                <select required id="licenseType" name="licenseType" defaultValue={asset.licenseType} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Subscription">Subscription - Cloud / Recurring</option>
                  <option value="Subscription License">Subscription - SaaS Seat</option>
                  <option value="Subscription - Annual">Subscription - Annual Plan</option>
                  <option value="Subscription - Monthly">Subscription - Monthly Plan</option>
                </select>
              ) : (
                <select required id="licenseType" name="licenseType" defaultValue={asset.licenseType} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Permanent - Per Device License">Permanent - Per Device License (Node-Locked)</option>
                  <option value="Permanent - Network License">Permanent - Network / Floating License</option>
                  <option value="Permanent - Standalone">Permanent - Standalone / Per User</option>
                  <option value="Permanent - Perpetual">Permanent - Perpetual Lifetime</option>
                  <option value="Per Device License">Per Device License (Legacy)</option>
                  <option value="Network License">Network License (Legacy)</option>
                  <option value="Per User License">Per User License (Legacy)</option>
                </select>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="allowedInstallations" className="text-sm font-medium">Allowed Installations / Seats *</label>
              <input required id="allowedInstallations" name="allowedInstallations" defaultValue={asset.allowedInstallations} type="number" min="1" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* 2. Credentials */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            2. {isSubscription ? "Account Credentials & Seats" : "Licensing & Credentials"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="credentials" className="text-sm font-medium">
                {isSubscription ? "Login Email / Key" : "License Key / Serial Number"}
              </label>
              <input id="credentials" name="credentials" defaultValue={asset.credentials || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. XXXX-XXXX-XXXX or user@company.com" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">Password / Activation Code (Optional)</label>
              <input id="password" name="password" defaultValue={asset.password || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Leave blank if unchanged" />
            </div>
          </div>
        </div>

        {/* 3. Validity & Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            3. {isSubscription ? "Subscription Validity & Renewal" : "License Validity"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="grid gap-2">
              <label htmlFor="startDate" className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                License Start Date
              </label>
              <input id="startDate" name="startDate" defaultValue={formattedStartDate} type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>

            {isSubscription ? (
              <div className="grid gap-2">
                <label htmlFor="expiryDate" className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  Subscription Renewal Date *
                </label>
                <input required id="expiryDate" name="expiryDate" defaultValue={formattedExpiryDate} type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            ) : (
              <div className="grid gap-2">
                <span className="text-sm font-medium">License End</span>
                <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  Permanent / Lifetime (Never Ending)
                </div>
                <input type="hidden" name="neverExpires" value="on" />
              </div>
            )}
          </div>
          <div className="grid gap-2 pt-2">
            <label htmlFor="description" className="text-sm font-medium">Description / Remarks (Optional)</label>
            <textarea id="description" name="description" defaultValue={cleanDescription} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Any additional notes about this software..."></textarea>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md cursor-pointer">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
