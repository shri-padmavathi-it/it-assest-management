import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SyncEMSButton } from "@/components/employees/sync-ems-button";
import { TableSearch } from "@/components/ui/table-search";
import { EmployeesTableClient } from "@/components/employees/employees-table-client";

export const revalidate = 60;

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialPage = parseInt(resolvedSearchParams.page || "1");
  const query = (resolvedSearchParams.q || "").trim();

  const where = query
    ? {
        OR: [
          { name: { contains: query } },
          { employeeId: { contains: query } },
          { email: { contains: query } },
          { department: { contains: query } },
          { designation: { contains: query } },
          { location: { contains: query } },
          { status: { contains: query } },
          {
            computers: {
              some: {
                OR: [
                  { assetTag: { contains: query } },
                  { computerName: { contains: query } },
                ],
              },
            },
          },
        ],
      }
    : {};

  const employees = await prisma.employee.findMany({
    where,
    include: {
      computers: {
        select: {
          id: true,
          assetTag: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">Manage employees and view their assigned assets.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TableSearch basePath="/employees" placeholder="Search employee, ID, dept..." initialQuery={query} />
          <SyncEMSButton />
          <Link
            href="/employees/new"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {query && (
        <div className="flex items-center justify-between bg-muted/40 border rounded-lg px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Search results for <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
            </span>
            <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-0.5 rounded-full">
              {employees.length} {employees.length === 1 ? "employee" : "employees"} found
            </span>
          </div>
          <Link href="/employees" className="text-xs text-primary hover:underline font-medium">
            Clear search
          </Link>
        </div>
      )}

      <EmployeesTableClient
        employees={employees}
        query={query}
        initialPage={initialPage}
        pageSize={10}
      />
    </div>
  );
}
