
import SymptomAnalyzerClient from "./symptom-analyzer-client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AnalyzePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <SymptomAnalyzerClient />
      </main>
      <Footer />
    </div>
  );
}

    