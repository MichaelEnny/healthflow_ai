export default function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} HealthFlow AI. All rights reserved.</p>
        <p className="mt-1">This tool is for informational purposes only and not a substitute for professional medical advice.</p>
      </div>
    </footer>
  );
}
