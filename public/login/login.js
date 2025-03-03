// Assuming 'api' is in a separate file named 'api.js'
import * as api from "./api.js"

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    try {
      const response = await api.login({ email, password })
      console.log("Login successful:", response)
      // 로그인 성공 시 홈페이지로 리다이렉트
      window.location.href = "/"
    } catch (error) {
      console.error("Login failed:", error)
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
    }
  })
})

