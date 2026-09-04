import { Activity, Clock } from "lucide-react"

export function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <div className="glass-card rounded-xl p-6 border-t-4 border-t-primary/80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[800ms] fill-mode-both mt-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recent activity found.
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {activities.map((activity, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Activity className="h-4 w-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{activity.entityType}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} on <span className="text-foreground font-medium">{activity.entityId.substring(0, 8)}...</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
