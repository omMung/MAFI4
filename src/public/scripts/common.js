document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    fetch('/components/header/header.html')
      .then((response) => response.text())
      .then((html) => {
        headerContainer.innerHTML = html;
        // 헤더가 로드된 후 로그인 상태 업데이트 함수 호출
        updateAuthDisplay();
      })
      .catch((err) => console.error('헤더 로드 에러:', err));
  }

  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    fetch('/components/footer/footer.html')
      .then((response) => response.text())
      .then((html) => {
        footerContainer.innerHTML = html;
      })
      .catch((err) => console.error('푸터 로드 에러:', err));
  }
});
