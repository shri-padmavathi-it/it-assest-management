import { prisma } from "@/lib/prisma";
import { SoftwareLicenseList } from "@/components/software-licenses/software-license-list";

export const revalidate = 60;

export default async function PermanentLicensesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q || "").trim();

  // Search filter combined with permanent criteria
  const where: any = {
    NOT: {
      licenseType: "Subscription",
    },
  };

  if (query) {
    where.AND = [
      {
        OR: [
          { name: { contains: query } },
          { vendor: { contains: query } },
          { category: { contains: query } },
          { licenseType: { contains: query } },
          { credentials: { contains: query } },
          { status: { contains: query } },
          {
            assignments: {
              some: {
                status: "Active",
                OR: [
                  { computer: { computerName: { contains: query } } },
                  { computer: { assetTag: { contains: query } } },
                  { employee: { name: { contains: query } } },
                  { employee: { employeeId: { contains: query } } },
                ],
              },
            },
          },
        ],
      },
    ];
  }

  const [assets, permanentCount, subscriptionCount] = await Promise.all([
    prisma.softwareAsset.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        assignments: {
          where: { status: "Active" },
          include: {
            computer: true,
            employee: true,
          },
        },
      },
    }),
    prisma.softwareAsset.count({
      where: {
        NOT: { licenseType: "Subscription" },
      },
    }),
    prisma.softwareAsset.count({
      where: {
        licenseType: "Subscription",
      },
    }),
  ]);

  return (
    <SoftwareLicenseList
      type="permanent"
      assets={assets}
      query={query}
      permanentCount={permanentCount}
      subscriptionCount={subscriptionCount}
    />
  );
}

