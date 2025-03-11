document.addEventListener('DOMContentLoaded', () => {
  // 페이지네이션 관련 변수
  let currentPage = 1;
  const itemsPerPage = 10;
  let totalPages = 1;
  let allUsers = [];

  // DOM 요소
  const rankingTableBody = document.querySelector('#rankingTable tbody');
  const emptyState = document.querySelector('.ranking-empty');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const pageNumbersContainer = document.getElementById('pageNumbers');

  // 최상위 랭커 요소
  const firstPlace = document.getElementById('first-place');
  const secondPlace = document.getElementById('second-place');
  const thirdPlace = document.getElementById('third-place');

  // API에서 유저 점수 데이터 가져오기
  async function fetchUserScores() {
    try {
      // getRanking API 호출
      const response = await api.getRanking();

      // 응답이 직접 배열 형태로 오는 경우 처리
      if (Array.isArray(response)) {
        allUsers = response;
      }
      // 응답이 객체 형태로 오는 경우 처리 (data.users 또는 users 속성 확인)
      else if (response.data && Array.isArray(response.data.users)) {
        allUsers = response.data.users;
      } else if (Array.isArray(response.users)) {
        allUsers = response.users;
      } else {
        console.error('Unexpected API response structure:', response);
        allUsers = [];
      }

      // 이미 서버에서 정렬된 상태로 온다고 가정
      // 만약 클라이언트에서 정렬이 필요하다면 아래 주석을 해제
      // allUsers.sort((a, b) => (b.score || 0) - (a.score || 0));

      // 페이지네이션 설정 및 데이터 렌더링
      setupPagination();
      renderTopRankers();
      renderRankingTable();
    } catch (error) {
      console.error('Failed to fetch user scores:', error);
      showEmptyState();
    }
  }

  // 페이지네이션 설정
  function setupPagination() {
    if (allUsers.length === 0) {
      showEmptyState();
      return;
    }

    totalPages = Math.ceil(allUsers.length / itemsPerPage);
    renderPageNumbers();
    updatePaginationButtons();
  }

  // 페이지 번호 렌더링
  function renderPageNumbers() {
    pageNumbersContainer.innerHTML = '';

    // 표시할 페이지 번호 범위 계산 (최대 5개)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    // 첫 페이지 버튼 (필요시)
    if (startPage > 1) {
      addPageNumberButton(1);
      if (startPage > 2) {
        addEllipsis();
      }
    }

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      addPageNumberButton(i);
    }

    // 마지막 페이지 버튼 (필요시)
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        addEllipsis();
      }
      addPageNumberButton(totalPages);
    }
  }

  // 페이지 번호 버튼 추가
  function addPageNumberButton(pageNum) {
    const pageButton = document.createElement('div');
    pageButton.classList.add('page-number');
    if (pageNum === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.textContent = pageNum;
    pageButton.addEventListener('click', () => {
      if (pageNum !== currentPage) {
        currentPage = pageNum;
        renderRankingTable();
        renderPageNumbers();
        updatePaginationButtons();
      }
    });
    pageNumbersContainer.appendChild(pageButton);
  }

  // 생략 부호(...) 추가
  function addEllipsis() {
    const ellipsis = document.createElement('div');
    ellipsis.classList.add('page-number');
    ellipsis.textContent = '...';
    ellipsis.style.cursor = 'default';
    pageNumbersContainer.appendChild(ellipsis);
  }

  // 페이지네이션 버튼 상태 업데이트
  function updatePaginationButtons() {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  // 이전 페이지 버튼 클릭 이벤트
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderRankingTable();
      renderPageNumbers();
      updatePaginationButtons();
    }
  });

  // 다음 페이지 버튼 클릭 이벤트
  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderRankingTable();
      renderPageNumbers();
      updatePaginationButtons();
    }
  });

  // 사용자 점수 가져오기 (score 속성이 없는 경우 대체 속성 사용)
  function getUserScore(user) {
    // 점수 속성이 있는 경우 사용
    if (user.score !== undefined) {
      return user.score;
    }

    // 점수 속성이 없는 경우 대체 속성 사용 (예: postCount, commentCount 등)
    // 실제 데이터 구조에 맞게 수정 필요
    if (user.postCount !== undefined) {
      return user.postCount;
    }

    if (user.commentCount !== undefined) {
      return user.commentCount;
    }

    // 대체 속성도 없는 경우 0 반환
    return 0;
  }

  // 상위 3명 랭커 렌더링
  function renderTopRankers() {
    if (allUsers.length === 0) return;

    // 1등
    if (allUsers.length >= 1) {
      const firstUser = allUsers[0];
      firstPlace.querySelector('.user-name').textContent =
        firstUser.nickName || '익명';
      firstPlace.querySelector('.user-score span').textContent =
        getUserScore(firstUser).toLocaleString();
      // 프로필 이미지가 있는 경우
      if (firstUser.profileImage) {
        firstPlace.querySelector('img').src = firstUser.profileImage;
      }
    }

    // 2등
    if (allUsers.length >= 2) {
      const secondUser = allUsers[1];
      secondPlace.querySelector('.user-name').textContent =
        secondUser.nickName || '익명';
      secondPlace.querySelector('.user-score span').textContent =
        getUserScore(secondUser).toLocaleString();
      if (secondUser.profileImage) {
        secondPlace.querySelector('img').src = secondUser.profileImage;
      }
    }

    // 3등
    if (allUsers.length >= 3) {
      const thirdUser = allUsers[2];
      thirdPlace.querySelector('.user-name').textContent =
        thirdUser.nickName || '익명';
      thirdPlace.querySelector('.user-score span').textContent =
        getUserScore(thirdUser).toLocaleString();
      if (thirdUser.profileImage) {
        thirdPlace.querySelector('img').src = thirdUser.profileImage;
      }
    }
  }

  // 랭킹 테이블 렌더링
  function renderRankingTable() {
    rankingTableBody.innerHTML = '';

    if (allUsers.length === 0) {
      showEmptyState();
      return;
    }

    // 현재 페이지에 표시할 데이터 계산
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allUsers.length);
    const currentPageUsers = allUsers.slice(startIndex, endIndex);

    // 테이블 행 생성
    currentPageUsers.forEach((user, index) => {
      const actualRank = startIndex + index + 1; // 실제 순위 계산

      const row = document.createElement('tr');

      // 순위 셀
      const rankCell = document.createElement('td');
      rankCell.classList.add('rank-number');
      if (actualRank <= 3) {
        rankCell.classList.add(`rank-${actualRank}`);
      }
      rankCell.textContent = actualRank;
      row.appendChild(rankCell);

      // 유저 정보 셀
      const userCell = document.createElement('td');
      userCell.classList.add('user-cell');

      const userAvatar = document.createElement('img');
      userAvatar.src =
        user.file || `/imageFile/placeholder.svg?height=40&width=40`;
      userAvatar.alt = '유저 아바타';

      const userName = document.createElement('span');
      userName.classList.add('user-name');
      userName.textContent = user.nickName || '익명';

      userCell.appendChild(userAvatar);
      userCell.appendChild(userName);
      row.appendChild(userCell);

      // 점수 셀
      const scoreCell = document.createElement('td');
      scoreCell.classList.add('score-cell');
      scoreCell.textContent = getUserScore(user).toLocaleString();
      row.appendChild(scoreCell);

      // 가입일 셀
      const joinDateCell = document.createElement('td');
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        joinDateCell.textContent = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } else {
        joinDateCell.textContent = '-';
      }
      row.appendChild(joinDateCell);

      rankingTableBody.appendChild(row);
    });

    // 테이블 표시
    document.querySelector('.ranking-table-container').style.display = 'block';
    emptyState.style.display = 'none';
  }

  // 빈 상태 표시
  function showEmptyState() {
    document.querySelector('.ranking-table-container').style.display = 'none';
    document.querySelector('.pagination-container').style.display = 'none';
    emptyState.style.display = 'block';
  }

  // 초기 데이터 로드
  fetchUserScores();
});
