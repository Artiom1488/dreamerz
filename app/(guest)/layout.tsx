import GuestNavbar from "@/components/header/GuestNavbar";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GuestNavbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
