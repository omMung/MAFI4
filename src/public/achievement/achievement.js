document.addEventListener('DOMContentLoaded', () => {
  // 현재 로그인한 사용자 ID 가져오기 (예시: localStorage에서 가져오거나 API 호출)
  const currentUserId = getCurrentUserId();

  // 모든 업적 가져오기
  fetchAllAchievements();

  // 사용자 업적 가져오기
  fetchUserAchievements(currentUserId);

  // 필터링 및 검색 이벤트 리스너
  setupFiltersAndSearch();

  // 모달 관련 이벤트 리스너
  setupModalListeners();
});

// 현재 로그인한 사용자 ID 가져오기 (예시 함수)
function getCurrentUserId() {
  // 실제 구현에서는 로그인 시스템에 맞게 사용자 ID를 가져오는 로직 구현
  // 예: localStorage, sessionStorage, 쿠키 등에서 가져오기
  const userId = localStorage.getItem('userId') || 1; // 기본값 1
  return Number.parseInt(userId);
}

// 전역 변수로 업적 데이터 저장
let allAchievements = [];
let userAchievements = [];
let filteredAchievements = [];

// 모든 업적 가져오기
async function fetchAllAchievements() {
  try {
    // API 호출 - 응답이 직접 배열로 옴 (data 속성 없음)
    const achievements = await api.achievements.findAll();
    allAchievements = achievements;
    console.log('모든 업적:', allAchievements);
  } catch (error) {
    console.error('업적 목록 가져오기 오류:', error);
    showErrorMessage('업적 목록을 불러오는데 실패했습니다.');
  }
}

// 사용자 업적 가져오기
async function fetchUserAchievements(userId) {
  const achievementsContainer = document.getElementById(
    'achievementsContainer',
  );

  // 로딩 스피너 표시
  achievementsContainer.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>업적을 불러오는 중...</p>
    </div>
  `;

  try {
    // API 호출 - 응답이 직접 배열로 옴 (data 속성 없음)
    const achievements = await api.achievements.getUserAchievements(userId);
    userAchievements = achievements;
    console.log('사용자 업적:', userAchievements);

    // 모든 업적 데이터가 로드될 때까지 기다림
    if (allAchievements.length === 0) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (allAchievements.length > 0) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    // 업적 데이터 처리 및 표시
    processAchievements();
  } catch (error) {
    console.error('사용자 업적 가져오기 오류:', error);
    achievementsContainer.innerHTML = `
      <div class="error-message">
        <p>업적을 불러오는데 실패했습니다. 다시 시도해주세요.</p>
        <button class="retry-btn" onclick="fetchUserAchievements(${userId})">다시 시도</button>
      </div>
    `;
  }
}

// 업적 데이터 처리 및 표시
function processAchievements() {
  // 사용자 업적 ID 맵 생성 (빠른 조회용)
  // 응답 구조에 맞게 수정: userAchievement.achieve.id를 키로 사용
  const userAchievementMap = {};
  userAchievements.forEach((userAchievement) => {
    if (userAchievement.achieve && userAchievement.achieve.id) {
      userAchievementMap[userAchievement.achieve.id] = userAchievement;
    }
  });

  // 모든 업적에 사용자 진행 상황 추가
  filteredAchievements = allAchievements.map((achievement) => {
    const userAchievement = userAchievementMap[achievement.id];
    const isCompleted =
      userAchievement && userAchievement.value >= achievement.conditionCount;

    return {
      ...achievement,
      userValue: userAchievement ? userAchievement.value : 0,
      isCompleted: isCompleted,
      achievedAt: userAchievement ? userAchievement.achievedAt : null,
      progress: userAchievement
        ? Math.min(
            100,
            (userAchievement.value / achievement.conditionCount) * 100,
          )
        : 0,
    };
  });

  // 업적 표시
  displayAchievements(filteredAchievements);

  // 진행 상황 업데이트
  updateProgressBar(filteredAchievements);
}

// 업적 표시
function displayAchievements(achievements) {
  const achievementsContainer = document.getElementById(
    'achievementsContainer',
  );
  achievementsContainer.innerHTML = '';

  if (achievements.length === 0) {
    achievementsContainer.innerHTML = `
      <div class="no-achievements">
        <p>표시할 업적이 없습니다.</p>
      </div>
    `;
    return;
  }

  achievements.forEach((achievement) => {
    const achievementCard = createAchievementCard(achievement);
    achievementsContainer.appendChild(achievementCard);
  });
}

// 업적 카드 생성 함수에서 이미지 URL 생성 부분 수정
function createAchievementCard(achievement) {
  const achievementCard = document.createElement('div');
  const isCompleted = achievement.isCompleted;
  const isHidden = achievement.hidden && !isCompleted;

  achievementCard.className = `achievement-card ${isCompleted ? 'completed' : 'incomplete'}`;

  if (isHidden) {
    achievementCard.classList.add('hidden-achievement');
  }

  achievementCard.dataset.achievementId = achievement.id;
  achievementCard.dataset.condition = achievement.condition;

  // ID 기반 이미지 경로 생성
  const badgeUrl =
    isHidden && !isCompleted
      ? `/imageFile/placeholder.svg?height=100&width=100&text=${encodeURIComponent('히든')}`
      : `../imageFile/achievement${achievement.id}.png`;

  // 히든 업적이고 완료되지 않은 경우 정보 숨기기
  const title = isHidden ? '히든 업적' : achievement.title;

  // 미달성 업적은 설명 숨기기
  const description = isHidden
    ? '이 업적은 달성해야 확인할 수 있습니다.'
    : isCompleted
      ? achievement.description
      : '이 업적을 달성하면 상세 정보를 확인할 수 있습니다.';

  // 미달성 업적은 진행 상황 및 조건 정보 숨기기
  const shouldShowDetails = isCompleted;

  achievementCard.innerHTML = `
    <div class="achievement-badge-container">
      <img src="${badgeUrl}" alt="${title}" class="achievement-badge ${!isCompleted ? 'blurred-content' : ''}" 
        onerror="this.src='/imageFile/placeholder.svg?height=100&width=100&text=배지'; this.onerror=null;">
      <div class="achievement-status ${isCompleted ? 'completed' : 'incomplete'}"></div>
    </div>
    <div class="achievement-details">
      <h3 class="achievement-title">${title}</h3>
      ${
        shouldShowDetails
          ? `<p class="achievement-description">${achievement.description}</p>
         <p class="condition-text condition-${achievement.condition}">${getConditionText(achievement.condition)}</p>
         <div class="achievement-progress">
           <div class="achievement-progress-bar-container">
             <div class="achievement-progress-bar" style="width: ${achievement.progress}%"></div>
           </div>
           <div class="achievement-progress-text">
             <span>${achievement.userValue}/${achievement.conditionCount}</span>
             <span>${achievement.progress.toFixed(0)}%</span>
           </div>
         </div>
         ${
           achievement.achievedAt
             ? `<p class="achievement-date">달성일: ${formatDate(achievement.achievedAt)}</p>`
             : ''
         }`
          : `<p class="achievement-description blurred-content">달성 시 확인 가능</p>`
      }
    </div>
  `;

  // 업적 클릭 시 모달 표시
  achievementCard.addEventListener('click', () => {
    showAchievementModal(achievement);
  });

  return achievementCard;
}

// 조건 텍스트 변환 함수
function getConditionText(condition) {
  switch (condition) {
    case 'mafia_kills':
      return '마피아 킬';
    case 'detective_checks':
      return '경찰 조사';
    case 'heal_used':
      return '의사 치료';
    case 'game_play':
      return '게임 플레이';
    default:
      return condition;
  }
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 진행 상황 업데이트
function updateProgressBar(achievements) {
  const completedCount = achievements.filter((a) => a.isCompleted).length;
  const totalCount = achievements.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const progressBar = document.getElementById('achievementProgressBar');
  const progressText = document.getElementById('achievementProgressText');
  const countText = document.getElementById('achievementCountText');

  progressBar.style.width = `${progressPercent}%`;
  progressText.textContent = `${progressPercent.toFixed(1)}%`;
  countText.textContent = `${completedCount}/${totalCount} 달성`;
}

// 필터링 및 검색 설정
function setupFiltersAndSearch() {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // 카테고리 필터 변경 이벤트
  categoryFilter.addEventListener('change', () => {
    applyFilters();
  });

  // 검색 버튼 클릭 이벤트
  searchBtn.addEventListener('click', () => {
    applyFilters();
  });

  // 검색 입력 필드에서 엔터키 이벤트
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  });
}

// 필터 적용
function applyFilters() {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const searchInput = document
    .getElementById('searchInput')
    .value.trim()
    .toLowerCase();

  // 필터링된 업적 목록
  let filtered = [...filteredAchievements];

  // 카테고리 필터 적용
  if (categoryFilter === 'completed') {
    filtered = filtered.filter((a) => a.isCompleted);
  } else if (categoryFilter === 'incomplete') {
    filtered = filtered.filter((a) => !a.isCompleted);
  }

  // 검색
  if (searchInput) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(searchInput) ||
        a.description.toLowerCase().includes(searchInput) ||
        a.condition.toLowerCase().includes(searchInput),
    );
  }

  // 필터링된 업적 표시
  displayAchievements(filtered);
}

// 업적 모달 표시 함수에서 이미지 URL 생성 부분 수정
function showAchievementModal(achievement) {
  const modal = document.getElementById('achievementModal');
  const modalTitle = document.getElementById('modalAchievementTitle');
  const modalBadge = document.getElementById('modalAchievementBadge');
  const modalStatus = document.getElementById('modalAchievementStatus');
  const modalDescription = document.getElementById(
    'modalAchievementDescription',
  );
  const modalCondition = document.getElementById('modalAchievementCondition');
  const modalProgress = document.getElementById('modalAchievementProgress');
  const modalProgressText = document.getElementById(
    'modalAchievementProgressText',
  );
  const modalDate = document.getElementById('modalAchievementDate');

  // 달성 여부 및 히든 여부 확인
  const isCompleted = achievement.isCompleted;
  const isHidden = achievement.hidden && !isCompleted;

  // 미달성 업적은 제목만 표시하고 나머지는 블러 처리
  const title = isHidden ? '히든 업적' : achievement.title;
  const description = isHidden
    ? '이 업적은 달성해야 확인할 수 있습니다.'
    : isCompleted
      ? achievement.description
      : '이 업적을 달성하면 상세 정보를 확인할 수 있습니다.';

  // 조건 텍스트 변환
  const conditionText = getConditionText(achievement.condition);
  const condition =
    isHidden || !isCompleted
      ? '???'
      : `${conditionText} ${achievement.conditionCount}회`;

  // 모달 내용 설정
  modalTitle.textContent = title;

  // ID 기반 이미지 경로 생성
  const badgeUrl =
    isHidden && !isCompleted
      ? `/imageFile/placeholder.svg?height=150&width=150&text=${encodeURIComponent('히든')}`
      : `../imageFile/achievement${achievement.id}.png`;

  modalBadge.src = badgeUrl;
  modalBadge.alt = title;

  // 이미지 로드 오류 시 대체 이미지 설정
  modalBadge.onerror = function () {
    this.src = '/imageFile/placeholder.svg?height=150&width=150&text=배지';
    this.onerror = null;
  };

  // 미달성 업적은 이미지도 블러 처리
  if (!isCompleted) {
    modalBadge.classList.add('blurred-content');
  } else {
    modalBadge.classList.remove('blurred-content');
  }

  // 상태 표시
  modalStatus.className = `achievement-status ${isCompleted ? 'completed' : 'incomplete'}`;

  // 설명 설정 - 미달성 업적은 블러 처리
  modalDescription.textContent = description;
  if (!isCompleted) {
    modalDescription.classList.add('blurred-content');
  } else {
    modalDescription.classList.remove('blurred-content');
  }

  // 조건 설정 - 미달성 업적은 조건 숨김
  modalCondition.textContent = condition;
  if (!isCompleted) {
    modalCondition.classList.add('blurred-content');
  } else {
    modalCondition.classList.remove('blurred-content');
    modalCondition.classList.add(`condition-${achievement.condition}`);
  }

  // 진행 상황 설정 - 미달성 업적은 진행 상황도 숨김
  const progressContainer = modalProgress.parentElement;
  if (isHidden || !isCompleted) {
    modalProgress.style.width = '0%';
    modalProgressText.textContent = '??? / ???';
    progressContainer.classList.add('blurred-content');
  } else {
    modalProgress.style.width = `${achievement.progress}%`;
    modalProgressText.textContent = `${achievement.userValue}/${achievement.conditionCount}`;
    progressContainer.classList.remove('blurred-content');
  }

  // 달성 날짜 설정
  if (achievement.achievedAt) {
    modalDate.textContent = `달성일: ${formatDate(achievement.achievedAt)}`;
    modalDate.style.display = 'block';
  } else {
    modalDate.style.display = 'none';
  }

  // 모달 표시
  modal.style.display = 'flex';
}

// 모달 관련 이벤트 리스너 설정
function setupModalListeners() {
  const modal = document.getElementById('achievementModal');
  const closeModal = document.getElementById('closeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // 모달 닫기 버튼
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 모달 외부 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// 오류 메시지 표시
function showErrorMessage(message) {
  const achievementsContainer = document.getElementById(
    'achievementsContainer',
  );
  achievementsContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <button class="retry-btn" onclick="location.reload()">다시 시도</button>
    </div>
  `;
}
