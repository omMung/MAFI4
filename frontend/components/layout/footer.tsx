import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#1a2e4a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">MAFI4</h2>
            <p className="text-sm mt-2">© 2025 MAFI4. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-4">
            <Link href="#" className="hover:text-[#e74c3c]">
              이용약관
            </Link>
            <Link href="#" className="hover:text-[#e74c3c]">
              개인정보처리방침
            </Link>
            <Link href="#" className="hover:text-[#e74c3c]">
              고객센터
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

