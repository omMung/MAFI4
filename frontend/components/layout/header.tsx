import Link from "next/link"
import { Frame } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-[#1a2e4a] text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Frame size={24} />
          <span className="text-xl font-bold">MAFI4</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/board" className="hover:text-[#e74c3c]">
            게시판
          </Link>
          <Link href="#" className="hover:text-[#e74c3c]">
            랭킹
          </Link>
          <Link href="#" className="hover:text-[#e74c3c]">
            상점
          </Link>
          <Link href="#" className="hover:text-[#e74c3c]">
            고객센터
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost" className="text-white hover:text-[#e74c3c]">
            <Link href="/login">로그인</Link>
          </Button>
          <Button asChild className="bg-[#e74c3c] hover:bg-[#c0392b] text-white">
            <Link href="/signup">회원가입</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

