// DOMContentLoaded 이벤트: 페이지가 모두 로드된 후 초기 작업 수행
document.addEventListener('DOMContentLoaded', () => {
  // 사용자 인증 상태 업데이트
  updateAuthDisplay();

  // 사용자 프로필 정보 로드 (토큰 확인 포함)
  loadUserProfile();

  // 내 게시글 로드 (최초 페이지: 1)
  loadMyPosts();

  // 내 댓글 로드 (첫 페이지 렌더링)
  loadMyComments();

  // 프로필 이미지 업로드 이벤트 리스너 등록 (파일 변경 시 saveProfileImage 호출)
  document
    .getElementById('profileImageUpload')
    .addEventListener('change', saveProfileImage);

  // 닉네임 수정 관련 이벤트 리스너 등록
  document
    .getElementById('editNicknameBtn')
    .addEventListener('click', showNicknameEdit);
  document
    .getElementById('saveNicknameBtn')
    .addEventListener('click', saveNickname);
  document
    .getElementById('cancelNicknameBtn')
    .addEventListener('click', hideNicknameEdit);
});

/* ================================
   사용자 프로필 정보 로드
   - 토큰 확인 후 getProfile API 호출하여 최신 사용자 정보 표시
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
      document.getElementById('currentNickname').textContent = user.nickName;
      document.getElementById('joinDate').textContent = new Date(
        user.createdAt,
      ).toLocaleDateString();
      document.getElementById('userEmail').textContent = user.email;
      if (user.file) {
        document.getElementById('profileImage').src = user.file;
      }
    })
    .catch((error) => {
      console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      window.location.href = '/login/login.html';
    });
}

/* ================================
   내 게시글 목록 로드 및 페이지네이션 처리
   - 모든 내 게시글을 불러와 전역 변수(allMyPosts)에 저장하고, 
     클라이언트에서 5개씩 잘라 페이지별로 렌더링
================================ */
let allMyPosts = [];

async function loadMyPosts() {
  try {
    const response = await api.getPostsByUser();
    // 응답 구조가 { message, data: { posts } } 형태라고 가정
    allMyPosts = response.data.posts;
    renderMyPosts(1); // 첫 페이지 렌더링
    updateStats(); // 통계 업데이트
  } catch (error) {
    console.error('게시글을 가져오는데 실패했습니다:', error);
    showEmptyPosts();
  }
}

/* renderMyPosts: 클라이언트 사이드 페이지네이션 처리 */
function renderMyPosts(currentPage) {
  const postsPerPage = 5;
  const totalPosts = allMyPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = allMyPosts.slice(startIndex, startIndex + postsPerPage);
  renderPostsList(currentPosts);
  renderPagination('postsPagenation', totalPages, currentPage, renderMyPosts);
}

/* renderPostsList: 게시글 목록을 화면에 출력하는 함수 */
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
            <a href="../post/post.html?id=${post.id}">${post.title}</a>
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
      // 전체 클릭 시, 버튼이나 링크가 아닌 경우 상세 페이지로 이동
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
  }
  // 수정 버튼 이벤트 등록
  const editButtons = postsListElement.querySelectorAll('.edit-btn');
  editButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      const postId = this.getAttribute('data-id');
      window.location.href = `../board/edit.html?id=${postId}`;
    });
  });
  // 삭제 버튼 이벤트 등록
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

/* renderPagination: 페이지네이션 버튼 렌더링 함수 */
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

/* showEmptyPosts: 게시글이 없을 경우 빈 메시지 표시 */
function showEmptyPosts() {
  document.getElementById('myPostsList').innerHTML = '';
  document.getElementById('emptyPostsMessage').style.display = 'block';
  document.getElementById('postsPagenation').innerHTML = '';
}

/* ================================
   전역 변수: 전체 내 댓글 저장
================================ */
let allMyComments = [];

/* ================================
   내 댓글 목록 로드 및 페이지네이션 처리
   - 모든 내 댓글을 불러와 전역 변수에 저장 후, 첫 페이지 렌더링 시작
================================ */
async function loadMyComments() {
  try {
    const response = await api.getCommentsByUser();
    allMyComments = response.data.comments;
    renderMyComments(1);
    updateStats();
  } catch (error) {
    console.error('댓글을 가져오는데 실패했습니다:', error);
    showEmptyComments();
  }
}

/* renderMyComments: 클라이언트 사이드 페이지네이션 처리 */
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

/* renderCommentsList: 댓글 목록을 화면에 출력하는 함수 */
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
              <a href="../post/post.html?postId=${comment.postId}">${comment.content}</a>
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
      // 댓글 항목 전체 클릭 시, 버튼이나 링크가 아닌 경우 해당 게시글 상세 페이지로 이동
      commentElement.addEventListener('click', (event) => {
        if (
          event.target.closest('.comment-actions') ||
          event.target.tagName.toLowerCase() === 'a'
        ) {
          return;
        }
        window.location.href = `../post/post.html?postId=${comment.postId}`;
      });
      commentsListElement.appendChild(commentElement);
    });
  }
  const editButtons = commentsListElement.querySelectorAll('.edit-btn');
  editButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      const commentId = this.getAttribute('data-id');
      const postId = this.getAttribute('data-post-id');
      window.location.href = `../board/post.html?id=${postId}&commentId=${commentId}`;
    });
  });
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

/* showEmptyComments: 댓글이 없을 경우 빈 메시지 표시 */
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

/* deleteComment: 댓글 삭제 처리 (API 호출) */
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

/* updateStats: 전체 게시글 및 댓글 수 업데이트 */
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
   프로필 이미지 업데이트 처리
   - 파일 선택 시 미리보기 및 updateProfile API 호출
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

  // FormData 생성 및 파일 추가

  const formData = new FormData();
  formData.append('file', file);

  // updateProfile API 호출 (FormData일 경우 Content-Type은 자동 처리)
  api
    .updateProfile(formData)
    .then((response) => {
      return api.getProfile();
    })
    .then((user) => {
      // 업데이트된 프로필 이미지로 UI 갱신
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
