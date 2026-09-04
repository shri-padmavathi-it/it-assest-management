import { addSoftwareAsset } from "@/app/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewSoftwareLicensePage() {
  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/software-licenses" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Software / License</h2>
          <p className="text-muted-foreground">Register a new software product or license into the system.</p>
        </div>
      </div>
      
      <form action={addSoftwareAsset} className="rounded-md border bg-card text-card-foreground shadow-sm p-6 space-y-8">
        
        {/* Core Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Software Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Software Name</label>
              <input required id="name" name="name" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. AutoCAD 2024" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="vendor" className="text-sm font-medium">Vendor</label>
              <input id="vendor" name="vendor" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Autodesk" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">-- Select Category --</option>
                <option value="MS Office">MS Office</option>
                <option value="CAD">CAD</option>
                <option value="Finance">Finance</option>
                <option value="Design">Design</option>
                <option value="Utility">Utility</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="licenseType" className="text-sm font-medium">License Type</label>
              <select required id="licenseType" name="licenseType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Per Device License">Per Device License</option>
                <option value="Network License">Network License</option>
                <option value="Per User License">Per User License</option>
                <option value="Subscription">Subscription</option>
              </select>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">2. Licensing & Credentials</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="credentials" className="text-sm font-medium">License Key / Username</label>
              <input id="credentials" name="credentials" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. XXXX-XXXX-XXXX or user@company.com" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">Password (Optional)</label>
              <input id="password" name="password" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. •••••••••" />
            </div>
          </div>
        </div>

        {/* Expiry & Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">3. Validity & Status</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</label>
              <input id="expiryDate" name="expiryDate" type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="neverExpires" name="neverExpires" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="neverExpires" className="text-sm font-medium">Never Expires (Perpetual)</label>
            </div>
          </div>
          
          <div className="grid gap-2 pt-2">
            <label htmlFor="description" className="text-sm font-medium">Description / Remarks</label>
            <textarea id="description" name="description" rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Any additional notes about this software..."></textarea>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
            Save Software / License
          </button>
        </div>
      </form>
    </div>
  )
}
