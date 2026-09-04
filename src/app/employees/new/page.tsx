import { addEmployee } from "@/app/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewEmployeePage() {
  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/employees" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Employee</h2>
          <p className="text-muted-foreground">Register a new company employee.</p>
        </div>
      </div>
      
      <form action={addEmployee} className="rounded-md border bg-card text-card-foreground shadow-sm p-6 space-y-4">
        <div className="grid gap-2">
          <label htmlFor="employeeId" className="text-sm font-medium">Employee ID</label>
          <input required id="employeeId" name="employeeId" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g. EMP-001" />
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
          <input required id="name" name="name" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g. John Doe" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <input required id="email" name="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g. john@company.com" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="department" className="text-sm font-medium">Department</label>
            <input id="department" name="department" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g. Engineering" />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Save Employee
          </button>
        </div>
      </form>
    </div>
  )
}
