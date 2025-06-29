
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* No Header or Footer on auth pages for a cleaner look */}
      <main className="flex-grow w-full h-full">
        {children}
      </main>
    </div>
  );
}
