function updateAuthDisplay() {
  const authButtons = document.getElementById('authButtons');
  if (!authButtons) {
    console.error('authButtons 요소를 찾지 못했습니다.');
    return;
  }
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    // 토큰이 있으면 getProfile 호출
    api
      .getProfile()
      .then((user) => {
        authButtons.innerHTML = `
        <div class="auth-container">
            <span class="user-info">안녕하세요, ${user.nickName}님</span>
            <a href="/myPage/myPage.html" id="mypageBtn" class="btn btn-secondary">마이페이지</a>
            <a id="logoutBtn" class="btn btn-secondary">로그아웃</a>
            </div>
          `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
          api
            .logout()
            .then(() => {
              localStorage.removeItem('accessToken');
              window.location.reload();
            })
            .catch((err) => console.error('로그아웃 실패:', err));
        });
      })
      .catch((error) => {
        console.error('사용자 정보를 가져오지 못했습니다:', error);
        showLoginSignup(authButtons);
      });
  } else {
    // 토큰이 없으면 로그인/회원가입 버튼 표시
    showLoginSignup(authButtons);
  }
}

function showLoginSignup(container) {
  container.innerHTML = `
      <a href="/login/login.html" class="btn btn-ghost">로그인</a>
      <a href="/signup/signup.html" class="btn btn-primary">회원가입</a>
    `;
}
