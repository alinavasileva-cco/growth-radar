import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardApp } from "@/components/DashboardApp";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <DashboardApp />;
}
