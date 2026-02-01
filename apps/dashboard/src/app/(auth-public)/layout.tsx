export default function AuthPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <section className="flex w-full max-w-md flex-col items-center justify-center p-4">
        <div className="w-full">{children}</div>
      </section>
    </div>
  );
}
