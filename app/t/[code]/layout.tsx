import { BottomNav } from "@/components/BottomNav";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <>
      <div className="flex-1">{children}</div>
      <BottomNav code={code} />
    </>
  );
}
