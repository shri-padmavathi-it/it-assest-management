import Link from "next/link";
import { ArrowLeft, Boxes } from "lucide-react";
import { OfficeAssetForm } from "@/components/office-assets/office-asset-form";

export const metadata = {
  title: "Add Office Asset | IT Asset Manager",
};

export default async function NewOfficeAssetPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolved = await searchParams;
  const categoryParam = resolved?.category || "Monitor";

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300 pb-12 select-none">
      <div className="flex items-center gap-3">
        <Link
          href="/office-assets"
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary" />
            Register New Office Asset
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add a monitor, printer, air conditioner, or office appliance to inventory.
          </p>
        </div>
      </div>

      <OfficeAssetForm isEdit={false} initialCategory={categoryParam} />
    </div>
  );
}
