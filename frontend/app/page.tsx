import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center">
        <div className="relative w-full h-64 md:h-80">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%281%29-z2GIZttTcqQdDMSbVFAOTlkGtC2HsH.png"
            alt="MAFI4 캐릭터"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="mt-6 text-5xl font-bold text-[#1a2e4a]">
          MAFI<span className="text-[#e74c3c]">4</span>
        </h1>
        <p className="mt-4 text-xl text-[#555] max-w-lg">함께하는 즐거운 게임 세상에 오신 것을 환영합니다!</p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="rounded-xl bg-[#1a2e4a] hover:bg-[#152238] text-white py-6 px-8 text-lg">
            <Link href="/login">로그인</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-[#1a2e4a] hover:bg-[#f5ecd7] text-[#1a2e4a] py-6 px-8 text-lg"
          >
            <Link href="/signup">회원가입</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

