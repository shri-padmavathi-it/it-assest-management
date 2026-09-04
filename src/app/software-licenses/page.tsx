import { prisma } from "@/lib/prisma";
import { PackageSearch, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteSoftwareAsset } from "@/app/actions";

export default async function SoftwareLicensesPage() {
  const assets = await prisma.softwareAsset.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Software & Licenses</h2>
          <p className="text-muted-foreground">Manage your entire software portfolio and license keys.</p>
        </div>
        <Link href="/software-licenses/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Software
        </Link>
      </div>
      
      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3">Software</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">License Type</th>
                <th className="px-6 py-3">Key / Username</th>
                <th className="px-6 py-3">Expiry</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground flex flex-col items-center">
                    <PackageSearch className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    No software or licenses found.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      <div>{asset.name}</div>
                      {asset.vendor && <div className="text-xs text-muted-foreground">{asset.vendor}</div>}
                    </td>
                    <td className="px-6 py-4">{asset.category || '—'}</td>
                    <td className="px-6 py-4">{asset.licenseType}</td>
                    <td className="px-6 py-4 font-mono text-xs">{asset.credentials || '—'}</td>
                    <td className="px-6 py-4">
                      {asset.neverExpires ? (
                        <span className="text-green-600 font-medium">Perpetual</span>
                      ) : (
                        asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : '—'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        asset.status === 'Available' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        asset.status === 'In Use' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                        'bg-muted text-muted-foreground'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={deleteSoftwareAsset.bind(null, asset.id)}>
                        <button type="submit" className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-500/10 transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
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
  );
}
