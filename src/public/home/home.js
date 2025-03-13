document.addEventListener('DOMContentLoaded', function () {
  // 게임 시작 버튼 이벤트 리스너
  const startGameBtn = document.getElementById('startGameBtn');
  const startGameBtnBottom = document.getElementById('startGameBtnBottom');

  if (startGameBtn) {
    startGameBtn.addEventListener('click', checkLoginAndStartGame);
  }

  if (startGameBtnBottom) {
    startGameBtnBottom.addEventListener('click', checkLoginAndStartGame);
  }

  // 모달 관련 이벤트 리스너
  const loginModal = document.getElementById('loginModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const goToLoginBtn = document.getElementById('goToLoginBtn');
  const closeModalX = document.querySelector('.close-modal');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (goToLoginBtn) {
    goToLoginBtn.addEventListener('click', redirectToLogin);
  }

  if (closeModalX) {
    closeModalX.addEventListener('click', closeModal);
  }

  // 캐릭터 슬라이더 설정
  setupCharacterSlider();

  // 스크롤 이벤트 리스너
  window.addEventListener('scroll', function () {
    // 스크롤 상단 버튼 표시/숨김
    toggleScrollToTopButton();

    // 요소들 애니메이션 적용
    animateOnScroll();
  });

  // 스크롤 상단 버튼 이벤트 리스너
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', scrollToTop);
  }

  // 게임 통계 데이터 로드
  loadGameStats();
});

// 로그인 확인 및 게임 시작
function checkLoginAndStartGame() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    showLoginModal();
  } else {
    startGame();
  }
}

// 게임 시작
function startGame() {
  // 기존 기능 유지
  window.location.href = '/roomList/roomList.html';
}

// 로그인 모달 표시
function showLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
  }
}

// 모달 닫기
function closeModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'none';
    document.body.style.overflow = ''; // 배경 스크롤 허용
  }
}

// 로그인 페이지로 이동
function redirectToLogin() {
  window.location.href = '/login/login.html';
}

// 캐릭터 슬라이더 설정
function setupCharacterSlider() {
  const slider = document.getElementById('characterSlider');
  const prevBtn = document.getElementById('prevCharacter');
  const nextBtn = document.getElementById('nextCharacter');
  const dotsContainer = document.getElementById('sliderDots');

  if (!slider || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = slider.querySelectorAll('.character-card');
  const cardWidth = cards[0].offsetWidth + 32; // 카드 너비 + 마진
  const visibleCards = Math.floor(slider.offsetWidth / cardWidth);
  const totalSlides = Math.ceil(cards.length / visibleCards);
  let currentSlide = 0;

  // 슬라이더 도트 생성
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
    dotsContainer.appendChild(dot);
  }

  // 이전 슬라이드 버튼
  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else {
      goToSlide(totalSlides - 1); // 마지막 슬라이드로 이동
    }
  });

  // 다음 슬라이드 버튼
  nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0); // 첫 슬라이드로 이동
    }
  });

  // 특정 슬라이드로 이동
  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    const offset = -cardWidth * visibleCards * slideIndex;
    slider.style.transform = `translateX(${offset}px)`;

    // 도트 활성화 상태 업데이트
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      if (index === slideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // 자동 슬라이드 (선택 사항)
  let autoSlideInterval = setInterval(() => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0);
    }
  }, 5000);

  // 마우스 호버 시 자동 슬라이드 일시 중지
  slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });

  slider.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
      if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(0);
      }
    }, 5000);
  });

  // 터치 이벤트 지원 (모바일)
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // 왼쪽으로 스와이프
      if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // 오른쪽으로 스와이프
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  }
}

// 스크롤 상단 버튼 표시/숨김
function toggleScrollToTopButton() {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (!scrollToTopBtn) return;

  if (window.scrollY > 300) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
}

// 페이지 상단으로 스크롤
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// 요소들 스크롤 애니메이션
function animateOnScroll() {
  const elements = document.querySelectorAll(
    '.feature-card, .character-card, .update-item, .section-title',
  );

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementPosition < windowHeight - 100) {
      element.classList.add('animated');
    }
  });
}

// 게임 통계 데이터 로드
function loadGameStats() {
  // 실제 구현에서는 API 호출로 대체
  // 예시 데이터
  setTimeout(() => {
    updateGameStats({
      totalPlayers: 12500,
      activeGames: 42,
      totalGames: 28750,
    });
  }, 1000);
}

// 게임 통계 업데이트
function updateGameStats(stats) {
  const totalPlayersElement = document.getElementById('totalPlayers');
  const activeGamesElement = document.getElementById('activeGames');
  const totalGamesElement = document.getElementById('totalGames');

  if (totalPlayersElement) {
    animateCounter(totalPlayersElement, 0, stats.totalPlayers, 2000);
  }

  if (activeGamesElement) {
    animateCounter(activeGamesElement, 0, stats.activeGames, 1500);
  }

  if (totalGamesElement) {
    animateCounter(totalGamesElement, 0, stats.totalGames, 2000);
  }
}

// 숫자 카운터 애니메이션
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
