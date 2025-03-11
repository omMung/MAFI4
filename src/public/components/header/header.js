function updateAuthDisplay() {
  const authButtons = document.getElementById('authButtons');
  if (!authButtons) {
    // 마이페이지처럼 authButtons 요소가 없는 경우에는 별도 처리를 하지 않음
    return;
  }
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    api
      .getProfile()
      .then((user) => {
        authButtons.innerHTML = `
          <div class="auth-container">
            <span class="user-info">
      안녕하세요,<br>
      ${user.nickName}님
    </span>
            <span class="user-money">내 머니: ${user.money || '0'}</span>
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
        // showLoginSignup(authButtons);
      });
  } else {
    // showLoginSignup(authButtons);
  }
}
