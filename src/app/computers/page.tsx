import { prisma } from "@/lib/prisma";
import { Monitor, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteComputer } from "@/app/actions";
import { ImportCSVButton } from "@/components/computers/import-csv-button";
import { PaginationContainer } from "@/components/ui/pagination-container";
import { Edit2 } from "lucide-react";

export default async function ComputersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [computers, totalComputers] = await Promise.all([
    prisma.computer.findMany({
      skip,
      take: pageSize,
      include: {
        currentEmployee: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.computer.count()
  ]);

  const totalPages = Math.ceil(totalComputers / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Computers</h2>
          <p className="text-muted-foreground">Manage all company computers and laptops.</p>
        </div>
        <div className="flex items-center gap-3">
          <ImportCSVButton />
          <Link href="/computers/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Computer
          </Link>
        </div>
      </div>

      <PaginationContainer totalPages={totalPages} currentPage={page} basePath="/computers">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3">Asset ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Current User</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {computers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No computers found.
                </td>
              </tr>
            ) : (
              computers.map((comp) => (
                <tr key={comp.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <Link href={`/computers/${comp.id}`} className="text-primary hover:underline">
                      {comp.assetTag}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{comp.computerName}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {comp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{comp.currentEmployee?.name || '—'}</td>
                  <td className="px-6 py-4">{comp.location || '—'}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/computers/${comp.id}/edit`} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-500/10 transition-colors" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <form action={deleteComputer.bind(null, comp.id)}>
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
      </PaginationContainer>
    </div>
  );
}
