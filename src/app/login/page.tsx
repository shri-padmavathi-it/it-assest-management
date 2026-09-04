import { signIn } from "@/auth"
import { Monitor } from "lucide-react"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="flex h-screen w-full items-center justify-center transition-colors duration-500 absolute inset-0 z-50 bg-mesh bg-background">
      <div className="glass-card w-full max-w-md p-8 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-2">
            <Monitor className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to IT Asset Manager</p>
        </div>

        {resolvedParams.error && (
          <div className="w-full rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center font-medium">
            Invalid credentials. Please try again.
          </div>
        )}

        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
          }}
          className="w-full space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue="admin@example.com"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue="password123"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
