document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const { headers } = await api.login({ email, password });
      const accessToken = headers.get('Authorization');
      console.log('로그인 토큰', accessToken);

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        // 화면 전환 등 후속 처리
        window.location.href = '/home/home.html';
      } else {
        throw new Error('토큰이 없습니다.');
      }
    } catch (error) {
      document.getElementById('message').textContent =
        '로그인 실패: ' + error.message;
      console.error('Login failed:', error);
    }
  });
});
