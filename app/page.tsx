import { WavyBackground } from "@/components/ui/wavy-background";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
          AuditAI, Smart Contract Auditor
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
          Leverage the power of canvas to create a beautiful hero section
        </p>
      </WavyBackground>
    </main>
  );
}
