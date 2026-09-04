import { prisma } from "@/lib/prisma";
import { Users, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteEmployee } from "@/app/actions";
import { SyncEMSButton } from "@/components/employees/sync-ems-button";
import { PaginationContainer } from "@/components/ui/pagination-container";
import { EditEmployeeModal } from "@/components/employees/edit-employee-modal";

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [employees, totalEmployees] = await Promise.all([
    prisma.employee.findMany({
      skip,
      take: pageSize,
      include: {
        computers: true
      },
      orderBy: { name: 'asc' }
    }),
    prisma.employee.count()
  ]);

  const totalPages = Math.ceil(totalEmployees / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">Manage employees and view their assigned assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncEMSButton />
          <Link href="/employees/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        </div>
      </div>
      
      <PaginationContainer totalPages={totalPages} currentPage={page} basePath="/employees">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3">Employee ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Assigned Computers</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{emp.employeeId}</td>
                  <td className="px-6 py-4">
                    <div>{emp.name}</div>
                    <div className="text-xs text-muted-foreground">{emp.email}</div>
                  </td>
                  <td className="px-6 py-4">{emp.department || '—'}</td>
                  <td className="px-6 py-4">
                    {emp.computers.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {emp.computers.map(c => (
                          <Link key={c.id} href={`/computers/${c.id}`} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                            {c.assetTag}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      emp.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted text-muted-foreground'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <EditEmployeeModal employee={emp} />
                    <form action={deleteEmployee.bind(null, emp.id)}>
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
