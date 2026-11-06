import { redirect } from "next/navigation";

export default async function SoftwareLicensesRootPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q;
  if (q) {
    redirect(`/software-licenses/permanent?q=${encodeURIComponent(q)}`);
  }
  redirect("/software-licenses/permanent");
}
