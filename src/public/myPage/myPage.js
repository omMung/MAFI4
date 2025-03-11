document.addEventListener('DOMContentLoaded', () => {
  // 초기 작업
  updateAuthDisplay();
  loadUserProfile();
  loadMyPosts();
  loadMyComments();
  loadGameStats();

  // 프로필 이미지 변경
  document
    .getElementById('profileImageUpload')
    .addEventListener('change', saveProfileImage);

  // 닉네임 수정 관련 이벤트
  document
    .getElementById('editNicknameBtn')
    .addEventListener('click', showNicknameEdit);
  document
    .getElementById('saveNicknameBtn')
    .addEventListener('click', saveNickname);
  document
    .getElementById('cancelNicknameBtn')
    .addEventListener('click', hideNicknameEdit);

  // 모달 닫기 이벤트 (모달 내부의 닫기 아이콘)
  document.querySelectorAll('.modal .close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', (e) => {
      const targetModal = e.target.getAttribute('data-target');
      closeModal(targetModal);
    });
  });
  // 모달 취소 버튼 (btn-secondary)에 닫기 이벤트 적용
  document.querySelectorAll('.btn-secondary').forEach((cancelBtn) => {
    cancelBtn.addEventListener('click', (e) => {
      const targetModal = e.target.getAttribute('data-target');
      if (targetModal) closeModal(targetModal);
    });
  });

  // 게시글 수정 모달 저장 이벤트
  document
    .getElementById('savePostEdit')
    .addEventListener('click', function () {
      const postId = document.getElementById('postEditForm').dataset.postId;
      const updatedTitle = document.getElementById('postTitle').value;
      const updatedContent = document.getElementById('postContent').value;
      // API를 호출하여 게시글 업데이트 (api.updatePost가 있다고 가정)
      api
        .updatePost(postId, { title: updatedTitle, content: updatedContent })
        .then(() => {
          loadMyPosts();
          closeModal('postEditModal');
          alert('게시글이 수정되었습니다.');
        })
        .catch((error) => {
          console.error('게시글 수정 실패:', error);
          alert('게시글 수정에 실패했습니다.');
        });
    });

  // 댓글 수정 모달 저장 이벤트
  document
    .getElementById('saveCommentEdit')
    .addEventListener('click', function () {
      const commentId =
        document.getElementById('commentEditForm').dataset.commentId;
      const updatedContent = document.getElementById('commentContent').value;
      // API를 호출하여 댓글 업데이트 (api.updateComment가 있다고 가정)
      api
        .updateComment(commentId, { content: updatedContent })
        .then(() => {
          loadMyComments();
          closeModal('commentEditModal');
          alert('댓글이 수정되었습니다.');
        })
        .catch((error) => {
          console.error('댓글 수정 실패:', error);
          alert('댓글 수정에 실패했습니다.');
        });
    });
});

/* ================================
   사용자 프로필 정보 로드
================================ */
function loadUserProfile() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = '/login/login.html';
    return;
  }

  api
    .getProfile()
    .then((user) => {
      console.log(user);
      document.getElementById('currentNickname').textContent = user.nickName;
      // 상태 컨테이너 생성
      const statusContainer = document.createElement('div');
      statusContainer.classList.add('status-container');

      // 커뮤니티 상태
      const communityStatus = document.createElement('div');
      if (user.communityBanDate) {
        const banDate = new Date(user.communityBanDate);
        communityStatus.classList.add('status-item', 'restricted');

        // 날짜 형식 개선
        const formattedDate = `${banDate.getFullYear()}년 ${banDate.getMonth() + 1}월 ${banDate.getDate()}일 ${String(banDate.getHours()).padStart(2, '0')}시 ${String(banDate.getMinutes()).padStart(2, '0')}분`;

        communityStatus.innerHTML = `<span>커뮤니티: ${formattedDate}까지 제한</span>`;
      } else {
        communityStatus.classList.add('status-item', 'active');
        communityStatus.innerHTML = `<span>커뮤니티: 활성</span>`;
      }
      statusContainer.appendChild(communityStatus);

      // 게임 상태
      const gameStatus = document.createElement('div');
      if (user.gameBanDate) {
        const banDate = new Date(user.gameBanDate);
        gameStatus.classList.add('status-item', 'restricted');

        // 날짜 형식 개선
        const formattedDate = `${banDate.getFullYear()}년 ${banDate.getMonth() + 1}월 ${banDate.getDate()}일 ${String(banDate.getHours()).padStart(2, '0')}시 ${String(banDate.getMinutes()).padStart(2, '0')}분`;

        gameStatus.innerHTML = `<span>게임: ${formattedDate}까지 제한</span>`;
      } else {
        gameStatus.classList.add('status-item', 'active');
        gameStatus.innerHTML = `<span>게임: 활성</span>`;
      }
      statusContainer.appendChild(gameStatus);

      // 닉네임 컨테이너에 상태 추가
      const nicknameDisplay = document.getElementById('nicknameDisplay');
      const existingStatus = nicknameDisplay.querySelector('.status-container');
      if (existingStatus) {
        existingStatus.remove();
      }
      nicknameDisplay.appendChild(statusContainer);

      document.getElementById('joinDate').textContent = new Date(
        user.createdAt,
      ).toLocaleDateString();
      document.getElementById('userEmail').textContent = user.email;
      if (user.file) {
        document.getElementById('profileImage').src = user.file;
      } else {
        // 기본 프로필 이미지 설정
        document.getElementById('profileImage').src =
          '/images/default-profile.png';
      }
    })
    .catch((error) => {
      console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      window.location.href = '/login/login.html';
    });
}

/* ================================
   게시글 로드 및 페이지네이션
================================ */
let allMyPosts = [];

async function loadMyPosts() {
  try {
    const response = await api.getPostsByUser();
    allMyPosts = response.data.posts;
    renderMyPosts(1);
    updateStats();
  } catch (error) {
    console.error('게시글을 가져오는데 실패했습니다:', error);
    showEmptyPosts();
  }
}

function renderMyPosts(currentPage) {
  const postsPerPage = 5;
  const totalPosts = allMyPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = allMyPosts.slice(startIndex, startIndex + postsPerPage);
  renderPostsList(currentPosts);
  renderPagination('postsPagenation', totalPages, currentPage, renderMyPosts);
}

function renderPostsList(posts) {
  const postsListElement = document.getElementById('myPostsList');
  const emptyMessage = document.getElementById('emptyPostsMessage');
  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }
  if (!posts || posts.length === 0) {
    showEmptyPosts();
    return;
  }
  if (postsListElement) {
    postsListElement.innerHTML = '';
    posts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.className = 'post-item';
      postElement.innerHTML = `
        <div class="post-content">
          <div class="post-title">
            <a href="../post/post.html?postId=${post.id}">${post.title}</a>
          </div>
          <div class="post-meta">
            작성일: ${new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div class="post-actions">
          <button class="action-btn edit-btn" data-id="${post.id}">수정</button>
          <button class="action-btn delete-btn" data-id="${post.id}">삭제</button>
        </div>
      `;
      // 전체 영역 클릭 시 상세 페이지 이동
      postElement.addEventListener('click', (event) => {
        if (
          event.target.closest('.post-actions') ||
          event.target.tagName.toLowerCase() === 'a'
        ) {
          return;
        }
        window.location.href = `../post/post.html?postId=${post.id}`;
      });
      postsListElement.appendChild(postElement);
    });

    // 게시글 수정 버튼 이벤트 등록 (모달 열기)
    const editButtons = postsListElement.querySelectorAll('.edit-btn');
    editButtons.forEach((button) => {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        const postId = this.getAttribute('data-id');
        const post = allMyPosts.find((p) => p.id == postId);
        if (post) {
          // 게시글 수정 모달의 제목, 내용 필드에 기존 데이터를 채워넣음
          document.getElementById('postTitle').value = post.title;
          // post.content가 없을 경우 빈 문자열을 할당 (데이터 구조에 맞게 조정)
          document.getElementById('postContent').value = post.content || '';
          // 수정할 게시글 id를 폼에 저장
          document.getElementById('postEditForm').dataset.postId = postId;
          openModal('postEditModal');
        }
      });
    });

    // 게시글 삭제 버튼 이벤트 등록
    const deleteButtons = postsListElement.querySelectorAll('.delete-btn');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        const postId = this.getAttribute('data-id');
        if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
          deletePost(postId);
        }
      });
    });
  }
}

/* ================================
   댓글 로드 및 페이지네이션
================================ */
let allMyComments = [];

async function loadMyComments() {
  try {
    const response = await api.getCommentsByUser();
    console.log(response);
    allMyComments = response.data.comments;
    renderMyComments(1);
    updateStats();
  } catch (error) {
    console.error('댓글을 가져오는데 실패했습니다:', error);
    showEmptyComments();
  }
}

function renderMyComments(currentPage) {
  const commentsPerPage = 5;
  const totalComments = allMyComments.length;
  const totalPages = Math.ceil(totalComments / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = allMyComments.slice(
    startIndex,
    startIndex + commentsPerPage,
  );
  renderCommentsList(currentComments);
  renderPagination(
    'commentsPagenation',
    totalPages,
    currentPage,
    renderMyComments,
  );
}

function renderCommentsList(comments) {
  const commentsListElement = document.getElementById('myCommentsList');
  const emptyMessage = document.getElementById('emptyCommentsMessage');
  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }
  if (!comments || comments.length === 0) {
    showEmptyComments();
    return;
  }
  if (commentsListElement) {
    commentsListElement.innerHTML = '';
    comments.forEach((comment) => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment-item';
      commentElement.innerHTML = `
          <div class="comment-content">
            <div class="comment-title">
              <a href="../post/post.html?postId=${comment.post.id}">${comment.content}</a>
            </div>
            <div class="comment-meta">
              게시글: ${comment.postTitle}
            </div>
          </div>
          <div class="comment-actions">
            <button class="action-btn edit-btn" data-id="${comment.id}" data-post-id="${comment.postId}">수정</button>
            <button class="action-btn delete-btn" data-id="${comment.id}">삭제</button>
          </div>
        `;
      commentElement.addEventListener('click', (event) => {
        if (
          event.target.closest('.comment-actions') ||
          event.target.tagName.toLowerCase() === 'a'
        ) {
          return;
        }
        window.location.href = `../post/post.html?postId=${comment.post.id}`;
      });
      commentsListElement.appendChild(commentElement);
    });

    // 댓글 수정 버튼 이벤트 등록 (모달 열기)
    const editButtons = commentsListElement.querySelectorAll('.edit-btn');
    editButtons.forEach((button) => {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        const commentId = this.getAttribute('data-id');
        const comment = allMyComments.find((c) => c.id == commentId);
        if (comment) {
          document.getElementById('commentContent').value = comment.content;
          document.getElementById('commentEditForm').dataset.commentId =
            commentId;
          openModal('commentEditModal');
        }
      });
    });

    // 댓글 삭제 버튼 이벤트 등록
    const deleteButtons = commentsListElement.querySelectorAll('.delete-btn');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        const commentId = this.getAttribute('data-id');
        if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
          deleteComment(commentId);
        }
      });
    });
  }
}

/* ================================
   페이지네이션 렌더링
================================ */
function renderPagination(elementId, totalPages, currentPage, onPageChange) {
  const paginationElement = document.getElementById(elementId);
  paginationElement.innerHTML = '';
  if (totalPages <= 1) return;
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'page-btn';
    prevButton.textContent = '이전';
    prevButton.addEventListener('click', () => onPageChange(currentPage - 1));
    paginationElement.appendChild(prevButton);
  }
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => onPageChange(i));
    paginationElement.appendChild(pageButton);
  }
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.className = 'page-btn';
    nextButton.textContent = '다음';
    nextButton.addEventListener('click', () => onPageChange(currentPage + 1));
    paginationElement.appendChild(nextButton);
  }
}

/* ================================
   게시글/댓글 없을 시 처리
================================ */
function showEmptyPosts() {
  document.getElementById('myPostsList').innerHTML = '';
  document.getElementById('emptyPostsMessage').style.display = 'block';
  document.getElementById('postsPagenation').innerHTML = '';
}

function showEmptyComments() {
  const commentsListElement = document.getElementById('myCommentsList');
  const emptyMessage = document.getElementById('emptyCommentsMessage');
  if (commentsListElement) commentsListElement.innerHTML = '';
  if (emptyMessage) {
    emptyMessage.style.display = 'block';
    emptyMessage.innerHTML = '작성한 댓글이 없습니다.';
  }
  const paginationElement = document.getElementById('commentsPagenation');
  if (paginationElement) paginationElement.innerHTML = '';
}

/* ================================
   댓글 삭제 처리
================================ */
function deleteComment(commentId) {
  api
    .deleteComment(commentId)
    .then(() => {
      alert('댓글이 삭제되었습니다.');
      loadMyComments();
    })
    .catch((error) => {
      console.error('댓글 삭제에 실패했습니다:', error);
      alert('댓글 삭제에 실패했습니다.');
    });
}

/* ================================
   게시글 삭제 처리
================================ */
function deletePost(postId) {
  api
    .deletePost(postId)
    .then(() => {
      alert('게시글이 삭제되었습니다.');
      loadMyPosts();
    })
    .catch((error) => {
      console.error('게시글 삭제에 실패했습니다:', error);
      alert('게시글 삭제에 실패했습니다.');
    });
}

/* ================================
   프로필 이미지 업데이트 처리
================================ */
function saveProfileImage() {
  const fileInput = document.getElementById('profileImageUpload');
  const file = fileInput.files[0];
  if (!file) {
    alert('업데이트할 프로필 이미지를 선택해주세요.');
    return;
  }
  if (!file.type.match('image.*')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('이미지 크기는 5MB 이하여야 합니다.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  api
    .updateProfile(formData)
    .then((response) => {
      return api.getProfile();
    })
    .then((user) => {
      document.getElementById('profileImage').src = user.file;
      updateAuthDisplay();
      alert('프로필 이미지가 변경되었습니다.');
    })
    .catch((error) => {
      console.error('프로필 이미지 업데이트 실패:', error);
      alert('프로필 이미지 업데이트에 실패했습니다.');
    });
}

/* ================================
   닉네임 수정 처리
================================ */
function showNicknameEdit() {
  const currentNickname =
    document.getElementById('currentNickname').textContent;
  document.getElementById('newNickname').value = currentNickname;
  document.getElementById('nicknameDisplay').style.display = 'none';
  document.getElementById('nicknameEdit').style.display = 'block';
}

function hideNicknameEdit() {
  document.getElementById('nicknameDisplay').style.display = 'flex';
  document.getElementById('nicknameEdit').style.display = 'none';
}

function saveNickname() {
  const newNickname = document.getElementById('newNickname').value.trim();
  if (!newNickname) {
    alert('닉네임을 입력해주세요.');
    return;
  }
  const updateData = { nickName: newNickname };

  api
    .updateProfile(updateData)
    .then((response) => {
      return api.getProfile();
    })
    .then((user) => {
      document.getElementById('currentNickname').textContent = user.nickName;
      updateAuthDisplay();
      hideNicknameEdit();
      alert('닉네임이 변경되었습니다.');
    })
    .catch((error) => {
      console.error('닉네임 업데이트 실패:', error);
      alert('닉네임 업데이트에 실패했습니다.');
    });
}

/* ================================
   활동 통계 업데이트
================================ */
function updateStats() {
  const postsCount = allMyPosts.length;
  const commentsCount = allMyComments.length;
  const statsItems = document.querySelectorAll(
    '.stats-placeholder .stats-item .stats-value',
  );
  if (statsItems.length >= 2) {
    statsItems[0].textContent = postsCount;
    statsItems[1].textContent = commentsCount;
  }
}

/* ================================
   모달 열기/닫기 함수
================================ */
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}
/* ================================
   게임 전적 로드 및 표시
================================ */
async function loadGameStats() {
  try {
    // 전체 전적 로드
    const overallStats = await api.getUserRecordByUserId();
    console.log(`MYPAGE.JS : ${overallStats[0]}`);

    renderOverallStats(overallStats.data);

    // 직업별 전적 로드
    const jobStats = await api.getUserRecordByJob();
    renderJobDetails(jobStats.data);
  } catch (error) {
    console.error('게임 전적을 가져오는데 실패했습니다:', error);
  }
}

function renderOverallStats(stats) {
  if (!stats) return;

  document.getElementById('totalGames').textContent = stats.totalGames;
  document.getElementById('wins').textContent = stats.wins;
  document.getElementById('losses').textContent = stats.losses;
  document.getElementById('winRate').textContent = `${stats.winRate}%`;
}

function renderJobDetails(jobStats) {
  if (!jobStats) return;

  const jobStatsDetails = document.getElementById('jobStatsDetails');
  jobStatsDetails.innerHTML = '';

  // 직업별 아이콘 매핑
  const jobIcons = {
    mafia: '🔪',
    police: '🚔',
    doctor: '💉',
    citizen: '👨‍👩‍👧‍👦',
  };

  // 직업별 한글 이름 매핑
  const jobNames = {
    mafia: '마피아',
    police: '경찰',
    doctor: '의사',
    citizen: '시민',
  };

  // 각 직업별 상세 카드 생성
  for (const [job, data] of Object.entries(jobStats)) {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-detail-card';

    // 승률에 따른 바 너비 계산
    const winRateWidth = data.winRate || 0;

    jobCard.innerHTML = `
      <div class="job-detail-header">
        <span class="job-icon">${jobIcons[job] || '🎮'}</span>
        <span class="job-detail-title">${jobNames[job] || job}</span>
      </div>
      <div class="job-detail-stats">
        <div class="job-detail-item">
          <div class="job-detail-label">총 게임</div>
          <div class="job-detail-value">${data.totalGames}</div>
        </div>
        <div class="job-detail-item">
          <div class="job-detail-label">승률</div>
          <div class="job-detail-value">${data.winRate}%</div>
        </div>
        <div class="job-detail-item">
          <div class="job-detail-label">승리</div>
          <div class="job-detail-value win">${data.wins}</div>
        </div>
        <div class="job-detail-item">
          <div class="job-detail-label">패배</div>
          <div class="job-detail-value loss">${data.losses}</div>
        </div>
      </div>
      <div class="winrate-bar-container">
        <div class="winrate-bar" style="width: ${winRateWidth}%"></div>
      </div>
    `;

    jobStatsDetails.appendChild(jobCard);
  }
}
