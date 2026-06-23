export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: add authenticated Navbar here (search, profile, chat, notifications) */}
      <main className="flex-1">{children}</main>
    </>
  );
}
