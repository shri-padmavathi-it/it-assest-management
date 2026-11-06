import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Boxes, Edit2 } from "lucide-react";
import { OfficeAssetForm } from "@/components/office-assets/office-asset-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOfficeAssetPage({ params }: PageProps) {
  const { id } = await params;

  let asset: any = null;
  try {
    asset = await (prisma as any).officeAsset.findUnique({
      where: { id },
    });
  } catch (err) {
    console.warn("Error fetching office asset for edit:", err);
  }

  if (!asset) {
    notFound();
  }

  const initialData = {
    ...asset,
    purchaseDate: asset.purchaseDate ? asset.purchaseDate.toISOString() : null,
    warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.toISOString() : null,
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300 pb-12 select-none">
      <div className="flex items-center gap-3">
        <Link
          href={`/office-assets/${asset.id}`}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary" />
            Edit Office Asset — {asset.assetTag}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update asset details, location, specifications, or assigned custody.
          </p>
        </div>
      </div>

      <OfficeAssetForm initialData={initialData} isEdit={true} />
    </div>
  );
}

