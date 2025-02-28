"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="flex flex-col justify-center p-8">
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-[#1a2e4a]">회원가입</h2>
        <p className="text-sm text-[#666]">새로운 계정을 만들고 게임을 시작하세요</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-[#1a2e4a] font-medium">
            닉네임
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="게임에서 사용할 닉네임"
            className="rounded-xl border-[#ddd] focus:border-[#1a2e4a] focus:ring-[#1a2e4a]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#1a2e4a] font-medium">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            className="rounded-xl border-[#ddd] focus:border-[#1a2e4a] focus:ring-[#1a2e4a]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#1a2e4a] font-medium">
            비밀번호
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              className="rounded-xl border-[#ddd] pr-10 focus:border-[#1a2e4a] focus:ring-[#1a2e4a]"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          <p className="text-xs text-[#666]">8자 이상, 영문, 숫자, 특수문자 포함</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#1a2e4a] font-medium">
            비밀번호 확인
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호를 다시 입력하세요"
              className="rounded-xl border-[#ddd] pr-10 focus:border-[#1a2e4a] focus:ring-[#1a2e4a]"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm text-[#666]">
            <span>이용약관 및 개인정보 처리방침에 동의합니다</span>
            <Link href="#" className="text-[#e74c3c] hover:underline ml-1">
              (보기)
            </Link>
          </Label>
        </div>

        <Button className="w-full rounded-xl bg-[#1a2e4a] hover:bg-[#152238] text-white py-6 mt-4">회원가입</Button>

        <div className="text-center mt-4">
          <p className="text-sm text-[#666]">
            이미 계정이 있으신가요?
            <Link href="/login" className="text-[#e74c3c] hover:underline ml-1">
              로그인
            </Link>
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#ddd]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-[#666]">또는</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="rounded-xl border-[#ddd] hover:bg-[#f5f5f5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </Button>
          <Button variant="outline" className="rounded-xl border-[#ddd] hover:bg-[#f5f5f5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Button>
          <Button variant="outline" className="rounded-xl border-[#ddd] hover:bg-[#f5f5f5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000">
              <path d="M22.2125 5.65605C21.4491 5.99375 20.6395 6.21555 19.8106 6.31411C20.6839 5.79132 21.3374 4.9689 21.6493 4.00005C20.8287 4.48761 19.9305 4.83077 18.9938 5.01461C18.2031 4.17106 17.098 3.66555 15.9418 3.66555C13.6326 3.66555 11.7597 5.52992 11.7597 7.82981C11.7597 8.14926 11.7957 8.45869 11.8659 8.75443C8.39043 8.58175 5.31005 6.93941 3.24678 4.4411C2.87529 5.0402 2.68005 5.72266 2.68005 6.44922C2.68005 7.82245 3.41825 9.03475 4.54882 9.74922C3.87547 9.73002 3.22445 9.55673 2.66 9.27132V9.32231C2.66 11.3361 4.10946 13.0202 6.00769 13.3971C5.12133 13.6579 4.21327 13.6767 3.33282 13.4721C3.87635 15.1335 5.42056 16.3432 7.23071 16.3765C5.70792 17.5733 3.84741 18.2408 1.96106 18.2384C1.61657 18.2372 1.27226 18.2148 0.930054 18.1714C2.85544 19.4437 5.09559 20.13 7.41648 20.13C15.9316 20.13 20.5583 13.1837 20.5583 7.18517C20.5583 6.99997 20.5536 6.81477 20.5466 6.63174C21.3636 6.03237 22.0793 5.29907 22.6518 4.47594C21.8952 4.8153 21.0911 5.04906 20.2636 5.16369C21.1092 4.62949 21.7525 3.8145 22.0449 2.85499C21.2383 3.33099 20.3473 3.68036 19.4099 3.8772C18.6547 3.09396 17.6422 2.61133 16.5099 2.52467C15.3776 2.43801 14.2903 2.75412 13.4142 3.4114C12.5381 4.06869 11.9323 5.02679 11.7092 6.10269C11.4861 7.17858 11.6612 8.29425 12.2019 9.24992C10.3677 9.16512 8.57123 8.7038 6.92936 7.89876C5.28748 7.09373 3.84366 5.96683 2.69283 4.59042C2.0355 5.62838 1.86088 6.86889 2.20225 8.03265C2.54362 9.19641 3.37382 10.1765 4.47823 10.7559C3.82355 10.7354 3.18433 10.5719 2.60868 10.2785V10.334C2.60887 11.5512 3.05534 12.7266 3.86842 13.6384C4.6815 14.5503 5.80616 15.1261 7.0165 15.2516C6.41299 15.4038 5.78939 15.4279 5.17555 15.3226C5.49365 16.3697 6.12968 17.2863 6.98987 17.9253C7.85006 18.5643 8.88911 18.8889 9.95988 18.8517C8.21842 20.2539 6.05332 21.0176 3.82391 21.0125C3.49129 21.0118 3.15909 20.9925 2.82812 20.9545C5.09399 22.4198 7.72488 23.2048 10.4149 23.2C17.6033 23.2 21.5573 17.4368 21.5573 12.4772C21.5573 12.2993 21.5573 12.1214 21.5455 11.9435C22.5293 11.2702 23.3848 10.4369 24.0777 9.48634C23.2533 9.84856 22.3808 10.0834 21.4926 10.1845C22.4129 9.62509 23.1147 8.74645 23.4452 7.72048C22.5611 8.23058 21.6012 8.58867 20.6012 8.77898C19.7984 7.92686 18.7045 7.40382 17.5298 7.31333C16.3551 7.22284 15.1978 7.56979 14.2815 8.28278C13.3652 8.99577 12.7494 10.0273 12.5537 11.1745C12.3581 12.3216 12.5961 13.4984 13.2281 14.4703C11.0334 14.3837 8.89472 13.7743 6.97571 12.6896C5.0567 11.6048 3.40752 10.0762 2.15833 8.22577C1.50615 9.36515 1.35566 10.7078 1.73806 11.9539C2.12046 13.2 2.99881 14.2362 4.19833 14.8159C3.49308 14.7935 2.80133 14.6106 2.17708 14.2821V14.3339C2.17741 15.6743 2.6658 16.9689 3.55248 17.9841C4.43915 18.9993 5.66691 19.6684 6.99708 19.8705C6.34294 20.0358 5.66066 20.0621 4.99521 19.9479C5.3493 21.1069 6.05121 22.1285 6.99982 22.8782C7.94843 23.6279 9.09608 24.0715 10.2849 24.1441C8.54639 25.4863 6.39302 26.2133 4.17708 26.2089C3.84693 26.2082 3.51702 26.1889 3.18833 26.1511C5.43816 27.5578 8.05388 28.3037 10.7249 28.3C17.8512 28.3 21.7643 22.6097 21.7643 17.6989C21.7643 17.5228 21.7643 17.3467 21.7526 17.1706C22.7332 16.5063 23.5862 15.6831 24.2774 14.7441C23.4604 15.1021 22.5958 15.3342 21.7139 15.4339C22.6253 14.8737 23.3242 14.0002 23.6518 12.9789C22.7721 13.4899 21.8166 13.8494 20.8249 14.0397C20.0229 13.1866 18.9398 12.6644 17.7849 12.5721C16.63 12.4798 15.4808 12.8233 14.5693 13.5311C13.6578 14.2389 13.0443 15.2622 12.8502 16.3994C12.6562 17.5366 12.8941 18.7031 13.5249 19.6659C11.3456 19.5795 9.22124 18.9743 7.31474 17.8967C5.40824 16.8191 3.77006 15.3004 2.52833 13.4624C1.87997 14.5915 1.73106 15.9214 2.11149 17.1559C2.49192 18.3904 3.36486 19.4171 4.55708 19.9909C3.85743 19.9686 3.17124 19.7876 2.55208 19.4624V19.5141C2.55241 20.8413 3.03606 22.1231 3.91523 23.1282C4.7944 24.1332 6.01138 24.7955 7.33021 24.9959C6.68165 25.1599 6.00508 25.1859 5.34521 25.0729C5.69681 26.2202 6.39401 27.2315 7.33612 27.9732C8.27824 28.7148 9.41805 29.1528 10.5971 29.2249C8.87389 30.5557 6.73996 31.2751 4.54521 31.2709C4.21761 31.2702 3.89025 31.2511 3.56408 31.2139C5.79668 32.5582 8.39284 33.3 11.0411 33.2959C18.1171 33.2959 21.9849 27.6709 21.9849 22.8159C21.9849 22.6416 21.9849 22.4673 21.9731 22.2929C22.9491 21.6339 23.7979 20.8175 24.4849 19.8859C23.6733 20.2409 22.8144 20.4709 21.9379 20.5699C22.8438 20.0139 23.5387 19.1471 23.8639 18.1329" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  )
}

