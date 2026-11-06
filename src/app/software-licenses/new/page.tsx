import { addSoftwareAsset } from "@/app/actions"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Calendar, Key, RefreshCw } from "lucide-react"

export default async function NewSoftwareLicensePage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const typeParam = resolvedSearchParams?.type?.toLowerCase()
  const isSubscription = typeParam === "subscription" || typeParam === "subscriptions"
  const backHref = isSubscription ? "/software-licenses/subscriptions" : "/software-licenses/permanent"

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href={backHref} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {isSubscription ? (
              <>
                <RefreshCw className="h-7 w-7 text-primary" />
                Add Subscription License
              </>
            ) : (
              <>
                <Key className="h-7 w-7 text-primary" />
                Add Permanent Software
              </>
            )}
          </h2>
          <p className="text-muted-foreground mt-0.5">
            {isSubscription
              ? "Register a recurring cloud subscription, seat account, or SaaS license."
              : "Register a perpetual, standalone, or network software license."}
          </p>
        </div>
      </div>

      <form action={addSoftwareAsset} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-8">

        {/* 1. Software Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
            1. Software Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Software Name *</label>
              <input
                required
                id="name"
                name="name"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder={isSubscription ? "e.g. MS Office 365, PTC Creo Cloud" : "e.g. AutoCAD 2024, SolidWorks 2024"}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="vendor" className="text-sm font-medium">Vendor / Publisher</label>
              <input
                id="vendor"
                name="vendor"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g. Microsoft, Dassault Systèmes, Autodesk"
              />
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
              <label htmlFor="licenseType" className="text-sm font-medium">License Type *</label>
              {isSubscription ? (
                <select
                  required
                  id="licenseType"
                  name="licenseType"
                  defaultValue="Subscription License"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Subscription License">Subscription - Cloud / SaaS Seat</option>
                  <option value="Subscription - Annual">Subscription - Annual Plan</option>
                  <option value="Subscription - Monthly">Subscription - Monthly Plan</option>
                </select>
              ) : (
                <select
                  required
                  id="licenseType"
                  name="licenseType"
                  defaultValue="Permanent - Per Device License"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Permanent - Per Device License">Permanent - Per Device License (Node-Locked)</option>
                  <option value="Permanent - Network License">Permanent - Network / Floating License</option>
                  <option value="Permanent - Standalone">Permanent - Standalone / Per User</option>
                  <option value="Permanent - Perpetual">Permanent - Perpetual Lifetime</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* 2. Credentials & Installations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            2. {isSubscription ? "Account Credentials & Seats" : "Licensing & Keys"}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label htmlFor="credentials" className="text-sm font-medium">
                {isSubscription ? "Login Email / Key" : "License Key / Serial Number"}
              </label>
              <input
                id="credentials"
                name="credentials"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder={isSubscription ? "user@company.com or key" : "XXXX-XXXX-XXXX-XXXX"}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">Password / Activation Code (Optional)</label>
              <input
                id="password"
                name="password"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g. •••••••••"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="allowedInstallations" className="text-sm font-medium">Allowed Installations / Seats *</label>
              <input
                required
                id="allowedInstallations"
                name="allowedInstallations"
                type="number"
                defaultValue="1"
                min="1"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g. 1"
              />
            </div>
          </div>
        </div>

        {/* 3. Validity & Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            3. {isSubscription ? "Subscription Validity & Renewal" : "License Validity"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="startDate" className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                License Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            {isSubscription ? (
              <div className="grid gap-2">
                <label htmlFor="expiryDate" className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  Subscription Renewal Date *
                </label>
                <input
                  required
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
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
            <textarea
              id="description"
              name="description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Any additional notes about this software..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md cursor-pointer"
          >
            {isSubscription ? "Save Subscription License" : "Save Permanent Software"}
          </button>
        </div>
      </form>
    </div>
  )
}
