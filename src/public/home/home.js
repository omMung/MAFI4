function startGame() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인 후 게임을 시작할 수 있습니다.');
    return;
  }
  window.location.href = `${CONFIG.API_BASE_URL}/game.html`;
}
