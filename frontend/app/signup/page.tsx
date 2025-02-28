import Image from "next/image"
import SignupForm from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-8 bg-[#f5ecd7]">
          <div className="relative w-full h-64 md:h-80">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%281%29-z2GIZttTcqQdDMSbVFAOTlkGtC2HsH.png"
              alt="MAFI4 캐릭터"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mt-6 text-4xl font-bold text-[#1a2e4a]">
            MAFI<span className="text-[#e74c3c]">4</span>
          </h1>
          <p className="mt-2 text-[#555] text-center">새로운 모험을 시작하세요!</p>
        </div>

        <SignupForm />
      </div>
    </div>
  )
}

