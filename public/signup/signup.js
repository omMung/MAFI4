// Assuming 'api' is an object with 'verifyEmail' and 'signUp' methods.  Replace this with your actual import statement.
const api = {
  verifyEmail: async (data) => {
    // Replace with your actual API call
    const response = await fetch("/api/verifyEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Email verification failed")
    }
    return await response.json()
  },
  signUp: async (data) => {
    // Replace with your actual API call
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Signup failed")
    }
    return await response.json()
  },
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm")
  const verifyEmailBtn = document.getElementById("verifyEmailBtn")
  const verifyCodeBtn = document.getElementById("verifyCodeBtn")
  const verifyCodeGroup = document.getElementById("verifyCodeGroup")
  let isEmailVerified = false

  verifyEmailBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value
    try {
      await api.verifyEmail({ email })
      verifyCodeGroup.style.display = "block"
      alert("인증 코드가 이메일로 전송되었습니다.")
    } catch (error) {
      console.error("Email verification failed:", error)
      alert("이메일 인증 코드 전송에 실패했습니다.")
    }
  })

  verifyCodeBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value
    const verifyCode = document.getElementById("verifyCode").value
    try {
      await api.verifyEmail({ email, verifyCode })
      isEmailVerified = true
      alert("이메일이 성공적으로 인증되었습니다.")
    } catch (error) {
      console.error("Email verification failed:", error)
      alert("이메일 인증에 실패했습니다. 코드를 확인해주세요.")
    }
  })

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!isEmailVerified) {
      alert("이메일 인증이 필요합니다.")
      return
    }

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value
    const nickName = document.getElementById("nickName").value
    const title = document.getElementById("title").value

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    try {
      const response = await api.signUp({ email, password, nickName, title })
      console.log("Signup successful:", response)
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.")
      window.location.href = "/login/login.html"
    } catch (error) {
      console.error("Signup failed:", error)
      alert("회원가입에 실패했습니다. 입력 정보를 확인해주세요.")
    }
  })
})

