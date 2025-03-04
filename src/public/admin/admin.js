document.addEventListener('DOMContentLoaded', () => {
  // 관리자 권한 확인
  checkAdminPermission();

  // 이벤트 리스너 등록
  document
    .getElementById('searchUserBtn')
    .addEventListener('click', searchUser);
  document
    .getElementById('banGameBtn')
    .addEventListener('click', () => toggleBanStatus('game'));
  document
    .getElementById('banCommunityBtn')
    .addEventListener('click', () => toggleBanStatus('community'));
  document.getElementById('unbanAllBtn').addEventListener('click', unbanAll);
  document
    .getElementById('refreshPostsBtn')
    .addEventListener('click', () => fetchUserPosts(1));
  document
    .getElementById('refreshCommentsBtn')
    .addEventListener('click', () => fetchUserComments(1));
  document
    .getElementById('deleteSelectedPostsBtn')
    .addEventListener('click', deleteSelectedPosts);
  document
    .getElementById('deleteSelectedCommentsBtn')
    .addEventListener('click', deleteSelectedComments);

  // 탭 전환 이벤트 리스너
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // 관리자 로그 추가
  addAdminLog('시스템', '관리자 페이지에 접속했습니다.');
});

// 관리자 권한 확인
function checkAdminPermission() {
  /* 
      // API 호출: 관리자 권한 확인
      api.checkAdminPermission()
        .then(response => {
          if (!response.isAdmin) {
            // 관리자가 아닌 경우 메인 페이지로 리디렉션
            window.location.href = '/index.html';
          }
        })
        .catch(error => {
          console.error('관리자 권한 확인 실패:', error);
          window.location.href = '/index.html';
        });
    */

  // 임시 처리 (API 연동 전)
  console.log('관리자 권한 확인 (임시)');
}

// 사용자 검색
function searchUser() {
  const email = document.getElementById('userEmailSearch').value.trim();

  if (!email) {
    alert('이메일을 입력해주세요.');
    return;
  }

  /* 
      // API 호출: 이메일로 사용자 검색
      api.searchUserByEmail(email)
        .then(user => {
          if (user) {
            displayUserInfo(user);
            fetchUserPosts(1);
            fetchUserComments(1);
            
            // 사용자 정보 및 콘텐츠 섹션 표시
            document.getElementById('userInfoSection').style.display = 'block';
            document.getElementById('userContentSection').style.display = 'block';
            
            addAdminLog('검색', `사용자 "${user.email}" 정보를 조회했습니다.`);
          } else {
            alert('해당 이메일의 사용자를 찾을 수 없습니다.');
          }
        })
        .catch(error => {
          console.error('사용자 검색 실패:', error);
          alert('사용자 검색에 실패했습니다.');
        });
    */

  // 임시 처리 (API 연동 전)
  setTimeout(() => {
    const dummyUser = {
      id: 123,
      name: '홍길동',
      email: email,
      joinDate: '2023-01-15',
      profileImage: null,
      gameBanned: false,
      communityBanned: false,
    };

    displayUserInfo(dummyUser);
    fetchUserPosts(1);
    fetchUserComments(1);

    // 사용자 정보 및 콘텐츠 섹션 표시
    document.getElementById('userInfoSection').style.display = 'block';
    document.getElementById('userContentSection').style.display = 'block';

    addAdminLog('검색', `사용자 "${email}" 정보를 조회했습니다.`);
  }, 500);
}

// 사용자 정보 표시
function displayUserInfo(user) {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userJoinDate').textContent = new Date(
    user.joinDate,
  ).toLocaleDateString();

  if (user.profileImage) {
    document.getElementById('userProfileImage').src = user.profileImage;
  }

  // 사용자 상태 배지 업데이트
  updateUserStatusBadge(user);

  // 기능 제한 상태 업데이트
  updateBanStatus('game', user.gameBanned);
  updateBanStatus('community', user.communityBanned);

  // 현재 사용자 ID를 데이터 속성에 저장
  document
    .getElementById('userInfoSection')
    .setAttribute('data-user-id', user.id);
}

// 사용자 상태 배지 업데이트
function updateUserStatusBadge(user) {
  const statusBadge = document.getElementById('userStatusBadge');
  let badgeHTML = '';

  if (user.gameBanned && user.communityBanned) {
    badgeHTML = '<span class="status-badge banned">제한됨</span>';
  } else if (user.gameBanned || user.communityBanned) {
    badgeHTML = '<span class="status-badge partial">부분 제한</span>';
  } else {
    badgeHTML = '<span class="status-badge active">활성</span>';
  }

  statusBadge.innerHTML = badgeHTML;
}

// 기능 제한 상태 업데이트
function updateBanStatus(type, isBanned) {
  const statusElement = document.getElementById(`${type}BanStatus`);
  const statusValue = statusElement.querySelector('.status-value');

  if (isBanned) {
    statusValue.textContent = '제한됨';
    statusValue.className = 'status-value banned';
    document.getElementById(
      `ban${type.charAt(0).toUpperCase() + type.slice(1)}Btn`,
    ).textContent = `${type === 'game' ? '게임' : '커뮤니티'} 기능 제한 해제`;
  } else {
    statusValue.textContent = '활성';
    statusValue.className = 'status-value active';
    document.getElementById(
      `ban${type.charAt(0).toUpperCase() + type.slice(1)}Btn`,
    ).textContent = `${type === 'game' ? '게임' : '커뮤니티'} 기능 정지`;
  }
}

// 기능 제한 토글
function toggleBanStatus(type) {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');
  const statusElement = document.getElementById(`${type}BanStatus`);
  const currentStatus =
    statusElement.querySelector('.status-value').textContent === '제한됨';
  const newStatus = !currentStatus;

  /* 
      // API 호출: 사용자 기능 제한 상태 변경
      api.updateUserBanStatus(userId, type, newStatus)
        .then(response => {
          updateBanStatus(type, newStatus);
          
          //  newStatus)
        .then(response => {
          updateBanStatus(type, newStatus);
          
          // 사용자 상태 배지 업데이트
          const user = {
            id: userId,
            gameBanned: type === 'game' ? newStatus : document.getElementById('gameBanStatus').querySelector('.status-value').textContent === '제한됨',
            communityBanned: type === 'community' ? newStatus : document.getElementById('communityBanStatus').querySelector('.status-value').textContent === '제한됨'
          };
          updateUserStatusBadge(user);
          
          addAdminLog('제한 관리', `사용자 "${document.getElementById('userEmail').textContent}"의 ${type === 'game' ? '게임' : '커뮤니티'} 기능을 ${newStatus ? '제한' : '해제'}했습니다.`);
        })
        .catch(error => {
          console.error('사용자 기능 제한 상태 변경 실패:', error);
          alert('사용자 기능 제한 상태 변경에 실패했습니다.');
        });
    */

  // 임시 처리 (API 연동 전)
  setTimeout(() => {
    updateBanStatus(type, newStatus);

    // 사용자 상태 배지 업데이트
    const user = {
      id: userId,
      gameBanned:
        type === 'game'
          ? newStatus
          : document
              .getElementById('gameBanStatus')
              .querySelector('.status-value').textContent === '제한됨',
      communityBanned:
        type === 'community'
          ? newStatus
          : document
              .getElementById('communityBanStatus')
              .querySelector('.status-value').textContent === '제한됨',
    };
    updateUserStatusBadge(user);

    addAdminLog(
      '제한 관리',
      `사용자 "${document.getElementById('userEmail').textContent}"의 ${type === 'game' ? '게임' : '커뮤니티'} 기능을 ${newStatus ? '제한' : '해제'}했습니다.`,
    );
  }, 500);
}

// 모든 제한 해제
function unbanAll() {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');

  /* 
      // API 호출: 사용자의 모든 제한 해제
      api.unbanAllFeatures(userId)
        .then(response => {
          updateBanStatus('game', false);
          updateBanStatus('community', false);
          
          // 사용자 상태 배지 업데이트
          const user = {
            id: userId,
            gameBanned: false,
            communityBanned: false
          };
          updateUserStatusBadge(user);
          
          addAdminLog('제한 관리', `사용자 "${document.getElementById('userEmail').textContent}"의 모든 기능 제한을 해제했습니다.`);
        })
        .catch(error => {
          console.error('사용자 기능 제한 해제 실패:', error);
          alert('사용자 기능 제한 해제에 실패했습니다.');
        });
    */

  // 임시 처리 (API 연동 전)
  setTimeout(() => {
    updateBanStatus('game', false);
    updateBanStatus('community', false);

    // 사용자 상태 배지 업데이트
    const user = {
      id: userId,
      gameBanned: false,
      communityBanned: false,
    };
    updateUserStatusBadge(user);

    addAdminLog(
      '제한 관리',
      `사용자 "${document.getElementById('userEmail').textContent}"의 모든 기능 제한을 해제했습니다.`,
    );
  }, 500);
}

// 탭 전환
function switchTab(tabName) {
  // 모든 탭 버튼 비활성화
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.classList.remove('active');
  });

  // 모든 탭 콘텐츠 숨기기
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
  });

  // 선택한 탭 버튼 활성화
  document
    .querySelector(`.tab-button[data-tab="${tabName}"]`)
    .classList.add('active');

  // 선택한 탭 콘텐츠 표시
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

// 사용자 게시글 가져오기
function fetchUserPosts(page) {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');

  /* 
      // API 호출: 사용자 게시글 목록 가져오기
      api.getUserPosts(userId, page)
        .then(response => {
          renderUserPosts(response.posts, response.totalPages, page);
        })
        .catch(error => {
          console.error('게시글을 가져오는데 실패했습니다:', error);
          showEmptyPosts();
        });
    */

  // 임시 데이터 (API 연동 전)
  setTimeout(() => {
    const dummyPosts = [
      {
        id: 1,
        title: '첫 번째 게시글입니다',
        createdAt: '2023-05-10',
        viewCount: 42,
      },
      {
        id: 2,
        title: '두 번째 게시글입니다',
        createdAt: '2023-05-15',
        viewCount: 28,
      },
      {
        id: 3,
        title: '세 번째 게시글입니다',
        createdAt: '2023-05-20',
        viewCount: 35,
      },
    ];

    renderUserPosts(dummyPosts, 3, page);
  }, 500);
}

// 사용자 게시글 렌더링
function renderUserPosts(posts, totalPages, currentPage) {
  const postsListElement = document.getElementById('userPostsList');
  const emptyMessage = document.getElementById('emptyPostsMessage');
  const deleteButton = document.getElementById('deleteSelectedPostsBtn');

  if (!posts || posts.length === 0) {
    showEmptyPosts();
    return;
  }

  emptyMessage.style.display = 'none';
  postsListElement.innerHTML = '';
  deleteButton.disabled = true;

  posts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.className = 'content-item';
    postElement.innerHTML = `
        <input type="checkbox" class="content-checkbox" data-id="${post.id}">
        <div class="content-details">
          <div class="content-title"><a href="../board/post.html?id=${post.id}" target="_blank">${post.title}</a></div>
          <div class="content-meta">작성일: ${new Date(post.createdAt).toLocaleDateString()} · 조회수: ${post.viewCount}</div>
        </div>
        <div class="content-actions">
          <button class="content-action-button view" data-id="${post.id}">보기</button>
          <button class="content-action-button delete" data-id="${post.id}">삭제</button>
        </div>
      `;
    postsListElement.appendChild(postElement);
  });

  // 체크박스 이벤트 리스너
  postsListElement.querySelectorAll('.content-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', updateDeleteButtonState);
  });

  // 게시글 보기 버튼 이벤트 리스너
  postsListElement
    .querySelectorAll('.content-action-button.view')
    .forEach((button) => {
      button.addEventListener('click', function () {
        const postId = this.getAttribute('data-id');
        window.open(`../board/post.html?id=${postId}`, '_blank');
      });
    });

  // 게시글 삭제 버튼 이벤트 리스너
  postsListElement
    .querySelectorAll('.content-action-button.delete')
    .forEach((button) => {
      button.addEventListener('click', function () {
        const postId = this.getAttribute('data-id');
        if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
          deletePost(postId);
        }
      });
    });

  // 페이지네이션 생성
  createPagination('postsPagenation', totalPages, currentPage, fetchUserPosts);
}

// 사용자 댓글 가져오기
function fetchUserComments(page) {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');

  /* 
      // API 호출: 사용자 댓글 목록 가져오기
      api.getUserComments(userId, page)
        .then(response => {
          renderUserComments(response.comments, response.totalPages, page);
        })
        .catch(error => {
          console.error('댓글을 가져오는데 실패했습니다:', error);
          showEmptyComments();
        });
    */

  // 임시 데이터 (API 연동 전)
  setTimeout(() => {
    const dummyComments = [
      {
        id: 1,
        content: '좋은 글이네요!',
        postId: 101,
        postTitle: '자바스크립트 기초',
        createdAt: '2023-06-05',
      },
      {
        id: 2,
        content: '저도 같은 생각입니다.',
        postId: 102,
        postTitle: 'CSS 레이아웃 팁',
        createdAt: '2023-06-10',
      },
      {
        id: 3,
        content: '감사합니다. 많은 도움이 되었어요.',
        postId: 103,
        postTitle: 'HTML 구조화',
        createdAt: '2023-06-15',
      },
    ];

    renderUserComments(dummyComments, 2, page);
  }, 500);
}

// 사용자 댓글 렌더링
function renderUserComments(comments, totalPages, currentPage) {
  const commentsListElement = document.getElementById('userCommentsList');
  const emptyMessage = document.getElementById('emptyCommentsMessage');
  const deleteButton = document.getElementById('deleteSelectedCommentsBtn');

  if (!comments || comments.length === 0) {
    showEmptyComments();
    return;
  }

  emptyMessage.style.display = 'none';
  commentsListElement.innerHTML = '';
  deleteButton.disabled = true;

  comments.forEach((comment) => {
    const commentElement = document.createElement('div');
    commentElement.className = 'content-item';
    commentElement.innerHTML = `
        <input type="checkbox" class="content-checkbox" data-id="${comment.id}">
        <div class="content-details">
          <div class="content-title"><a href="../board/post.html?id=${comment.postId}" target="_blank">${comment.content}</a></div>
          <div class="content-meta">게시글: ${comment.postTitle} · 작성일: ${new Date(comment.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="content-actions">
          <button class="content-action-button view" data-id="${comment.id}" data-post-id="${comment.postId}">보기</button>
          <button class="content-action-button delete" data-id="${comment.id}">삭제</button>
        </div>
      `;
    commentsListElement.appendChild(commentElement);
  });

  // 체크박스 이벤트 리스너
  commentsListElement
    .querySelectorAll('.content-checkbox')
    .forEach((checkbox) => {
      checkbox.addEventListener('change', updateDeleteButtonState);
    });

  // 댓글 보기 버튼 이벤트 리스너
  commentsListElement
    .querySelectorAll('.content-action-button.view')
    .forEach((button) => {
      button.addEventListener('click', function () {
        const postId = this.getAttribute('data-post-id');
        const commentId = this.getAttribute('data-id');
        window.open(
          `../board/post.html?id=${postId}&commentId=${commentId}`,
          '_blank',
        );
      });
    });

  // 댓글 삭제 버튼 이벤트 리스너
  commentsListElement
    .querySelectorAll('.content-action-button.delete')
    .forEach((button) => {
      button.addEventListener('click', function () {
        const commentId = this.getAttribute('data-id');
        if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
          deleteComment(commentId);
        }
      });
    });

  // 페이지네이션 생성
  createPagination(
    'commentsPagenation',
    totalPages,
    currentPage,
    fetchUserComments,
  );
}

// 삭제 버튼 상태 업데이트
function updateDeleteButtonState() {
  const activeTab = document.querySelector('.tab-content.active').id;
  const checkboxes = document.querySelectorAll(
    `#${activeTab} .content-checkbox:checked`,
  );
  const deleteButton = document.getElementById(
    `deleteSelected${activeTab === 'postsTab' ? 'Posts' : 'Comments'}Btn`,
  );

  deleteButton.disabled = checkboxes.length === 0;
}

// 선택한 게시글 삭제
function deleteSelectedPosts() {
  const selectedPosts = Array.from(
    document.querySelectorAll('#postsTab .content-checkbox:checked'),
  ).map((checkbox) => checkbox.getAttribute('data-id'));

  if (selectedPosts.length === 0) return;

  if (
    confirm(`선택한 ${selectedPosts.length}개의 게시글을 삭제하시겠습니까?`)
  ) {
    /* 
        // API 호출: 선택한 게시글 삭제
        api.deleteMultiplePosts(selectedPosts)
          .then(response => {
            alert('선택한 게시글이 삭제되었습니다.');
            fetchUserPosts(1);
            addAdminLog('삭제', `${selectedPosts.length}개의 게시글을 삭제했습니다.`);
          })
          .catch(error => {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
          });
      */

    // 임시 처리 (API 연동 전)
    setTimeout(() => {
      alert('선택한 게시글이 삭제되었습니다.');
      fetchUserPosts(1);
      addAdminLog('삭제', `${selectedPosts.length}개의 게시글을 삭제했습니다.`);
    }, 500);
  }
}

// 선택한 댓글 삭제
function deleteSelectedComments() {
  const selectedComments = Array.from(
    document.querySelectorAll('#commentsTab .content-checkbox:checked'),
  ).map((checkbox) => checkbox.getAttribute('data-id'));

  if (selectedComments.length === 0) return;

  if (
    confirm(`선택한 ${selectedComments.length}개의 댓글을 삭제하시겠습니까?`)
  ) {
    /* 
        // API 호출: 선택한 댓글 삭제
        api.deleteMultipleComments(selectedComments)
          .then(response => {
            alert('선택한 댓글이 삭제되었습니다.');
            fetchUserComments(1);
            addAdminLog('삭제', `${selectedComments.length}개의 댓글을 삭제했습니다.`);
          })
          .catch(error => {
            console.error('댓글 삭제 실패:', error);
            alert('댓글 삭제에 실패했습니다.');
          });
      */

    // 임시 처리 (API 연동 전)
    setTimeout(() => {
      alert('선택한 댓글이 삭제되었습니다.');
      fetchUserComments(1);
      addAdminLog(
        '삭제',
        `${selectedComments.length}개의 댓글을 삭제했습니다.`,
      );
    }, 500);
  }
}

// 게시글 삭제
function deletePost(postId) {
  /* 
      // API 호출: 게시글 삭제
      api.deletePost(postId)
        .then(response => {
          alert('게시글이 삭제되었습니다.');
          fetchUserPosts(1);
          addAdminLog('삭제', `게시글 ID: ${postId}를 삭제했습니다.`);
        })
        .catch(error => {
          console.error('게시글 삭제 실패:', error);
          alert('게시글 삭제에 실패했습니다.');
        });
    */

  // 임시 처리 (API 연동 전)
  setTimeout(() => {
    alert('게시글이 삭제되었습니다.');
    fetchUserPosts(1);
    addAdminLog('삭제', `게시글 ID: ${postId}를 삭제했습니다.`);
  }, 500);
}

// 댓글 삭제
function deleteComment(commentId) {
  /* 
      // API 호출: 댓글 삭제
      api.deleteComment(commentId)
        .then(response => {
          alert('댓글이 삭제되었습니다.');
          fetchUserComments(1);
          addAdminLog('삭제', `댓글 ID: ${commentId}를 삭제했습니다.`);
        })
        .catch(error => {
          console.error('댓글 삭제 실패:', error);
          alert('댓글 삭제에 실패했습니다.');
        });
    */

  // 임시 처리 (API 연동 전)
  setTimeout(() => {
    alert('댓글이 삭제되었습니다.');
    fetchUserComments(1);
    addAdminLog('삭제', `댓글 ID: ${commentId}를 삭제했습니다.`);
  }, 500);
}

// 빈 게시글 메시지 표시
function showEmptyPosts() {
  document.getElementById('userPostsList').innerHTML = '';
  document.getElementById('emptyPostsMessage').style.display = 'block';
  document.getElementById('postsPagenation').innerHTML = '';
  document.getElementById('deleteSelectedPostsBtn').disabled = true;
}

// 빈 댓글 메시지 표시
function showEmptyComments() {
  document.getElementById('userCommentsList').innerHTML = '';
  document.getElementById('emptyCommentsMessage').style.display = 'block';
  document.getElementById('commentsPagenation').innerHTML = '';
  document.getElementById('deleteSelectedCommentsBtn').disabled = true;
}

// 페이지네이션 생성
function createPagination(elementId, totalPages, currentPage, callback) {
  const paginationElement = document.getElementById(elementId);
  paginationElement.innerHTML = '';

  if (totalPages <= 1) return;

  // 이전 페이지 버튼
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'page-button';
    prevButton.textContent = '이전';
    prevButton.addEventListener('click', () => callback(currentPage - 1));
    paginationElement.appendChild(prevButton);
  }

  // 페이지 번호 버튼
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `page-button ${i === currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => callback(i));
    paginationElement.appendChild(pageButton);
  }

  // 다음 페이지 버튼
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.className = 'page-button';
    nextButton.textContent = '다음';
    nextButton.addEventListener('click', () => callback(currentPage + 1));
    paginationElement.appendChild(nextButton);
  }
}

// 관리자 로그 추가
function addAdminLog(action, message) {
  const logContainer = document.getElementById('adminLogContainer');
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';

  const now = new Date();
  const timeString = now.toISOString().replace('T', ' ').substring(0, 19);

  logEntry.innerHTML = `
      <span class="log-time">${timeString}</span>
      <span class="log-action">${action}</span>
      <span class="log-message">${message}</span>
    `;

  logContainer.insertBefore(logEntry, logContainer.firstChild);

  // 로그 항목 수 제한 (최대 50개)
  const logEntries = logContainer.querySelectorAll('.log-entry');
  if (logEntries.length > 50) {
    logContainer.removeChild(logEntries[logEntries.length - 1]);
  }
}
