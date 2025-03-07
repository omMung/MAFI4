document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const verificationDiv = document.getElementById('verificationDiv');
  const verifyCodeInput = document.getElementById('verifyCode');
  const verifyCodeBtn = document.getElementById('verifyCodeBtn');

  let registeredEmail = ''; // 회원가입 시 입력한 이메일을 저장

  // 회원가입 폼 제출 이벤트 리스너
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nickName = document.getElementById('nickName').value;

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await api.signUp({ email, password, nickName });
      console.log('Signup successful:', response);
      registeredEmail = email; // 인증 API 호출 시 사용할 이메일 저장
      alert('회원가입이 완료되었습니다. 이메일로 인증 코드가 전송되었습니다.');
      // 회원가입 폼을 숨기고 인증 div 표시
      signupForm.style.display = 'none';
      verificationDiv.style.display = 'block';
    } catch (error) {
      console.error('Signup failed:', error);
      alert('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    }
  });

  // 인증 코드 확인 버튼 이벤트 리스너
  verifyCodeBtn.addEventListener('click', async () => {
    const verifyCode = verifyCodeInput.value;
    try {
      await api.verifyEmail({ email: registeredEmail, verifyCode });
      alert('이메일이 성공적으로 인증되었습니다.');
      window.location.href = '/login/login.html';
    } catch (error) {
      console.error('Email verification failed:', error);
      alert('이메일 인증에 실패했습니다. 코드를 확인해주세요.');
    }
  });
});
