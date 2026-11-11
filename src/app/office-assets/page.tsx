import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Boxes, Plus } from "lucide-react";
import { 
  OfficeAssetsTableClient, 
  OfficeAssetItem 
} from "@/components/office-assets/office-assets-table-client";

export const revalidate = 60;

export default async function OfficeAssetsPage() {
  let assets: OfficeAssetItem[] = [];

  try {
    const rawAssets = await (prisma as any).officeAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    assets = rawAssets.map((item: any) => ({
      ...item,
      purchaseDate: item.purchaseDate ? item.purchaseDate.toISOString() : null,
      warrantyExpiry: item.warrantyExpiry ? item.warrantyExpiry.toISOString() : null,
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    }));
  } catch (err) {
    console.warn("OfficeAsset query fallback:", err);
    assets = [];
  }

  const totalAssets = assets.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Office Assets
            </h2>
            <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
              {totalAssets} {totalAssets === 1 ? "Item" : "Items"}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Track and manage monitors, printers, air conditioners, and physical office equipment.
          </p>
        </div>

        <Link
          href="/office-assets/new"
          prefetch={true}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Office Asset
        </Link>
      </div>

      {/* Interactive Category Filter Cards & Table / Empty State */}
      <OfficeAssetsTableClient assets={assets} />
    </div>
  );
}
