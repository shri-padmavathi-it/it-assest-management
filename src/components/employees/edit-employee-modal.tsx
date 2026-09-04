"use client";

import { useState } from "react";
import { Edit2, X, Loader2 } from "lucide-react";
import { editEmployee } from "@/app/actions";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string | null;
}

export function EditEmployeeModal({ employee }: { employee: Employee }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      await editEmployee(formData);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-500/10 transition-colors"
        title="Edit"
      >
        <Edit2 className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={employee.id} />
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <input required type="text" name="name" defaultValue={employee.name} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input required type="email" name="email" defaultValue={employee.email} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Department</label>
                <input type="text" name="department" defaultValue={employee.department || ''} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                <button disabled={isPending} type="submit" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
