import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/ui/back-button"
import { editSoftwareAsset } from "@/app/actions"

export default async function EditSoftwarePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const asset = await prisma.softwareAsset.findUnique({
    where: { id }
  })

  if (!asset) {
    notFound()
  }

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
          <h2 className="text-3xl font-bold tracking-tight">Edit License: {asset.name}</h2>
          <p className="text-muted-foreground">Update software details, credentials, or expiry information.</p>
        </div>
      </div>

      <form action={editSoftwareAsset} className="rounded-md border bg-card text-card-foreground shadow-sm p-6 space-y-8">
        <input type="hidden" name="id" value={asset.id} />
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Basic Information</h3>
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
              <input id="category" name="category" defaultValue={asset.category || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Productivity, Development" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="licenseType" className="text-sm font-medium">License Type *</label>
              <select required id="licenseType" name="licenseType" defaultValue={asset.licenseType} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <optgroup label="Permanent / Perpetual">
                  <option value="Per Device License">Permanent - Per Device License (Node-Locked)</option>
                  <option value="Network License">Permanent - Network / Floating License</option>
                  <option value="Per User License">Permanent - Standalone / Per User</option>
                  <option value="Perpetual">Permanent - Perpetual</option>
                </optgroup>
                <optgroup label="Subscription / Renewable">
                  <option value="Subscription">Subscription - Cloud / Recurring</option>
                </optgroup>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="allowedInstallations" className="text-sm font-medium">Allowed Installations *</label>
              <input required id="allowedInstallations" name="allowedInstallations" defaultValue={asset.allowedInstallations} type="number" min="1" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">2. Licensing & Credentials</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="credentials" className="text-sm font-medium">License Key / Username</label>
              <input id="credentials" name="credentials" defaultValue={asset.credentials || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. XXXX-XXXX-XXXX or user@company.com" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input id="password" name="password" defaultValue={asset.password || ''} type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Leave blank if none" />
            </div>
          </div>
        </div>

        {/* Validity & Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">3. Validity & Dates</h3>
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="grid gap-2">
              <label htmlFor="startDate" className="text-sm font-medium">License Start Date</label>
              <input id="startDate" name="startDate" defaultValue={formattedStartDate} type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="expiryDate" className="text-sm font-medium">License End / Expiry Date</label>
              <input id="expiryDate" name="expiryDate" defaultValue={formattedExpiryDate} type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input type="checkbox" id="neverExpires" name="neverExpires" defaultChecked={asset.neverExpires} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="neverExpires" className="text-sm font-medium">Never Ending (Permanent)</label>
            </div>
          </div>
          <div className="grid gap-2 pt-2">
            <label htmlFor="description" className="text-sm font-medium">Description / Remarks</label>
            <textarea id="description" name="description" defaultValue={cleanDescription} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Any additional notes about this software..."></textarea>
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
