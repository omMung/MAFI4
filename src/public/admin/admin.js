document.addEventListener('DOMContentLoaded', () => {
  // 관리자 권한 확인
  checkAdminPermission();

  // 이벤트 리스너 등록
  document
    .getElementById('searchUserBtn')
    .addEventListener('click', searchUser);
  document
    .getElementById('banGameBtn')
    .addEventListener('click', () => applyBanStatus('game'));
  document
    .getElementById('banCommunityBtn')
    .addEventListener('click', () => applyBanStatus('community'));
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
  // API 호출: 관리자 권한 확인
  api.admin
    .checkPermission()
    .then((response) => {
      if (!response.isAdmin) {
        // 관리자가 아닌 경우 메인 페이지로 리디렉션
        window.location.href = '/home/home.html';
      }
    })
    .catch((error) => {
      console.error('관리자 권한 확인 실패:', error);
      window.location.href = '/home/home.html';

      // 실패 로그 추가
      addAdminLog('오류', '관리자 권한 확인에 실패했습니다.');
    });
}

// 사용자 검색
function searchUser() {
  const nickName = document.getElementById('userNickNameSearch').value.trim();
  console.log(`searchUser:${nickName}`);
  if (!nickName) {
    alert('이메일을 입력해주세요.');
    return;
  }

  // API 호출: 이메일로 사용자 검색
  api.admin
    .searchUser(nickName)
    .then((user) => {
      if (user) {
        displayUserInfo(user);
        fetchUserPosts(1);
        fetchUserComments(1);

        // 사용자 정보 및 콘텐츠 섹션 표시
        document.getElementById('userInfoSection').style.display = 'block';
        document.getElementById('userContentSection').style.display = 'block';

        addAdminLog(
          '검색',
          `사용자 "${user.data.nickName}" 정보를 조회했습니다.`,
        );
      } else {
        alert('해당 이메일의 사용자를 찾을 수 없습니다.');
      }
    })
    .catch((error) => {
      console.error('사용자 검색 실패:', error);
      alert('사용자 검색에 실패했습니다.');
    });
}

// 사용자 정보 표시
function displayUserInfo(user) {
  console.log(user);
  document.getElementById('userName').textContent =
    user.data.nickName || '이름 없음';
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userJoinDate').textContent = new Date(
    user.data.createdAt || '알 수 없음',
  ).toLocaleDateString();

  if (user.data.file) {
    document.getElementById('userProfileImage').src = user.data.file;
  }

  // 사용자 상태 배지 업데이트
  updateUserStatusBadge(user);

  // 기존 기능 제한 상태 업데이트 코드가 있다면 제거하고, getUserBanStatus API 호출
  const userId = user.data.id;
  api.admin
    .getUserBanStatus(userId)
    .then((response) => {
      // response.data가 { gameBan: Date | null, communityBan: Date | null } 형태라고 가정
      updateBanStatus('game', response.data.gameBan);
      updateBanStatus('community', response.data.communityBan);
    })
    .catch((error) => {
      console.error('사용자 제재 상태 조회 실패:', error);
    });

  // 현재 사용자 ID를 데이터 속성에 저장
  document
    .getElementById('userInfoSection')
    .setAttribute('data-user-id', user.data.id);
}

// 사용자 상태 배지 업데이트
function updateUserStatusBadge(user) {
  const statusBadge = document.getElementById('userStatusBadge');
  let badgeHTML = '';

  const gameBanned = user.gameBanned || user.banStatus?.game;
  const communityBanned = user.communityBanned || user.banStatus?.community;

  if (gameBanned && communityBanned) {
    badgeHTML = '<span class="status-badge banned">제한됨</span>';
  } else if (gameBanned) {
    badgeHTML = '<span class="status-badge partial">부분 제한</span>';
  } else if (communityBanned) {
    badgeHTML = '<span class="status-badge partial">부분 제한</span>';
  } else {
    badgeHTML = '<span class="status-badge active">활성</span>';
  }

  statusBadge.innerHTML = badgeHTML;
}

// 기능 제한 상태 업데이트
function updateBanStatus(type, banDate) {
  const statusElement = document.getElementById(`${type}BanStatus`);
  if (!statusElement) return; // 해당 요소가 없으면 종료
  const statusValue = statusElement.querySelector('.status-value');

  if (banDate) {
    // banDate가 존재하면 제재 상태임
    statusValue.textContent = '제한됨';
    statusValue.className = 'status-value banned';
    document.getElementById(
      `ban${type.charAt(0).toUpperCase() + type.slice(1)}Btn`,
    ).textContent = `${type === 'game' ? '게임' : '커뮤니티'} 기능 제한 해제`;
  } else {
    // banDate가 null이면 활성 상태임
    statusValue.textContent = '활성';
    statusValue.className = 'status-value active';
    document.getElementById(
      `ban${type.charAt(0).toUpperCase() + type.slice(1)}Btn`,
    ).textContent = `${type === 'game' ? '게임' : '커뮤니티'} 기능 정지`;
  }
}

// 기능 제한 토글
function applyBanStatus(type) {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');
  const banBtn = document.getElementById(
    `ban${type.charAt(0).toUpperCase() + type.slice(1)}Btn`,
  );
  const currentBtnText = banBtn.textContent.trim();

  // 버튼 텍스트가 "기능 제한 해제"이면, 해제 동작 실행
  if (currentBtnText.includes('해제')) {
    // 해제 API 호출: type에 따라 해당 제한만 해제
    api.admin
      .unbanAllFeatures(userId, type)
      .then((response) => {
        // UI 업데이트: 해당 기능의 제재 상태를 활성으로 표시
        updateBanStatus(type, null);
        // 업데이트 후 추가 UI 갱신(예: 사용자 상태 배지)
        const user = { id: userId, gameBanned: false, communityBanned: false };
        updateUserStatusBadge(user);
        addAdminLog(
          '제한 관리',
          `사용자 "${document.getElementById('userEmail').textContent}"의 ${type === 'game' ? '게임' : '커뮤니티'} 제한이 해제되었습니다.`,
        );
      })
      .catch((error) => {
        console.error('사용자 기능 제한 해제 실패:', error);
        alert('사용자 기능 제한 해제에 실패했습니다.');
      });
  } else {
    // 그렇지 않으면 제재 적용: 제재 기간을 입력받음
    const durationInput = prompt(
      `"${type === 'game' ? '게임' : '커뮤니티'}" 제재 기간(일)을 입력하세요 (1, 3, 7, 30 중 하나):`,
    );
    const duration = parseInt(durationInput, 10);
    const allowedDurations = [1, 3, 7, 30];
    if (!duration || !allowedDurations.includes(duration)) {
      alert('제재 기간은 1, 3, 7, 30일 중 하나여야 합니다.');
      return;
    }

    // API 호출: 사용자 기능 제한 적용 (제재 기간 전달)
    api.admin
      .updateUserBanStatus(userId, { type: type, duration: duration })
      .then((response) => {
        // UI 업데이트: 해당 기능의 제재 상태를 '제한됨'으로 표시
        updateBanStatus(type, true); // 여기서 true 대신 banDate가 존재하는 것으로 간주
        const user = {
          id: userId,
          gameBanned: type === 'game',
          communityBanned: type === 'community',
        };
        updateUserStatusBadge(user);

        addAdminLog(
          '제재 적용',
          `사용자 "${document.getElementById('userEmail').textContent}"의 ${type === 'game' ? '게임' : '커뮤니티'} 제한이 ${duration}일 적용되었습니다.`,
        );
        api.admin
          .addAdminLog(
            '제재 적용',
            `사용자 "${document.getElementById('userEmail').textContent}"의 ${type === 'game' ? '게임' : '커뮤니티'} 제한이 ${duration}일 적용되었습니다.`,
          )
          .catch((e) => console.error('관리자 로그 기록 실패:', e));
      })
      .catch((error) => {
        console.error('사용자 제재 상태 변경 실패:', error);
        alert('사용자 제재 상태 변경에 실패했습니다.');
      });
  }
}

// 모든 제한 해제
function unbanAll() {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');

  // API 호출: 사용자의 모든 제한 해제
  api.admin
    .unbanAllFeatures(userId)
    .then((response) => {
      // 업데이트된 제재 상태를 null로 전달하여 활성 상태를 표시
      updateBanStatus('game', null);
      updateBanStatus('community', null);

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

      // 관리자 로그 API 호출
      api.admin
        .addAdminLog(
          '제한 관리',
          `사용자 "${document.getElementById('userEmail').textContent}"의 모든 기능 제한을 해제했습니다.`,
        )
        .catch((e) => console.error('관리자 로그 기록 실패:', e));
    })
    .catch((error) => {
      console.error('사용자 기능 제한 해제 실패:', error);
      alert('사용자 기능 제한 해제에 실패했습니다.');
    });
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
  console.log(userId);

  // API 호출: 사용자 게시글 목록 가져오기
  api.admin
    .getUserPosts(userId)
    .then((response) => {
      // response.posts 배열 추출
      const postsData = response.posts; // 또는 response.data.posts 등 실제 응답 구조에 맞게
      const pageSize = 10;
      const totalPosts = postsData.length;
      const totalPages = Math.ceil(totalPosts / pageSize);

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const postsForPage = postsData.slice(startIndex, endIndex);

      renderUserPosts(postsForPage, totalPages, page);
    })
    .catch((error) => {
      console.error('게시글을 가져오는데 실패했습니다:', error);
      showEmptyPosts();
    });
}

// 사용자 게시글 렌더링
function renderUserPosts(posts, totalPages, currentPage) {
  const postsListElement = document.getElementById('userPostsList');
  const emptyMessage = document.getElementById('emptyPostsMessage');
  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }
  const deleteButton = document.getElementById('deleteSelectedPostsBtn');

  if (!posts || posts.length === 0) {
    showEmptyPosts();
    return;
  }
  postsListElement.innerHTML = '';
  deleteButton.disabled = true;

  posts.forEach((post) => {
    const postElement = document.createElement('div');
    postElement.className = 'content-item';
    postElement.innerHTML = `
        <input type="checkbox" class="content-checkbox" data-id="${post.id}">
        <div class="content-details">
          <div class="content-title"><a href="../post/post.html?postId=${post.id}" target="_blank">${post.title}</a></div>
          <div class="content-meta">작성일: ${new Date(post.createdAt).toLocaleDateString()} · 조회수: ${post.viewCount || 0}</div>
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
        window.open(`../post/post.html?postId=${postId}`, '_blank');
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

  // API 호출: 사용자 댓글 목록 가져오기
  api.admin
    .getUserComments(userId)
    .then((response) => {
      console.log(response);
      // response.comments 배열 추출
      const commentsData = response.comments;
      const pageSize = 10;
      const totalComments = commentsData.length;
      const totalPages = Math.ceil(totalComments / pageSize);

      // 현재 페이지에 해당하는 댓글만 필터링
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const commentsForPage = commentsData.slice(startIndex, endIndex);

      renderUserComments(commentsForPage, totalPages, page);
    })
    .catch((error) => {
      console.error('댓글을 가져오는데 실패했습니다:', error);
      showEmptyComments();
    });
}

// 사용자 댓글 렌더링
function renderUserComments(comments, totalPages, currentPage) {
  const commentsListElement = document.getElementById('userCommentsList');
  const emptyMessage = document.getElementById('emptyCommentsMessage');
  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }
  const deleteButton = document.getElementById('deleteSelectedCommentsBtn');

  if (!comments || comments.length === 0) {
    showEmptyComments();
    return;
  }

  commentsListElement.innerHTML = '';
  deleteButton.disabled = true;

  comments.forEach((comment) => {
    const commentElement = document.createElement('div');
    commentElement.className = 'content-item';
    commentElement.innerHTML = `
        <input type="checkbox" class="content-checkbox" data-id="${comment.id}">
        <div class="content-details">
          <div class="content-title"><a href="../post/post.html?postId=${comment.post.id}" target="_blank">${comment.content}</a></div>
          <div class="content-meta">게시글: ${comment.postTitle || '알 수 없음'} · 작성일: ${new Date(comment.createdAt).toLocaleDateString()}</div>
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
          `../post/post.html?postId=${postId}&commentId=${commentId}`,
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
    // API 호출: 선택한 게시글 삭제
    api.admin
      .deleteMultiplePosts(selectedPosts)
      .then((response) => {
        alert('선택한 게시글이 삭제되었습니다.');
        fetchUserPosts(1);

        addAdminLog(
          '삭제',
          `${selectedPosts.length}개의 게시글을 삭제했습니다.`,
        );

        // 관리자 로그 API 호출
        api.admin
          .addAdminLog(
            '삭제',
            `${selectedPosts.length}개의 게시글을 삭제했습니다.`,
          )
          .catch((e) => console.error('관리자 로그 기록 실패:', e));
      })
      .catch((error) => {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      });
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
    // API 호출: 선택한 댓글 삭제
    api.admin
      .deleteMultipleComments(selectedComments)
      .then((response) => {
        alert('선택한 댓글이 삭제되었습니다.');
        fetchUserComments(1);

        addAdminLog(
          '삭제',
          `${selectedComments.length}개의 댓글을 삭제했습니다.`,
        );

        // 관리자 로그 API 호출
        api.admin
          .addAdminLog(
            '삭제',
            `${selectedComments.length}개의 댓글을 삭제했습니다.`,
          )
          .catch((e) => console.error('관리자 로그 기록 실패:', e));
      })
      .catch((error) => {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      });
  }
}

// 게시글 삭제
function deletePost(postId) {
  // API 호출: 게시글 삭제
  api
    .deletePost(postId)
    .then((response) => {
      alert('게시글이 삭제되었습니다.');
      fetchUserPosts(1);

      addAdminLog('삭제', `게시글 ID: ${postId}를 삭제했습니다.`);

      // 관리자 로그 API 호출
      api.admin
        .addAdminLog('삭제', `게시글 ID: ${postId}를 삭제했습니다.`)
        .catch((e) => console.error('관리자 로그 기록 실패:', e));
    })
    .catch((error) => {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    });
}

// 댓글 삭제
function deleteComment(commentId) {
  // API 호출: 댓글 삭제
  api
    .deleteComment(commentId)
    .then((response) => {
      alert('댓글이 삭제되었습니다.');
      fetchUserComments(1);

      addAdminLog('삭제', `댓글 ID: ${commentId}를 삭제했습니다.`);

      // 관리자 로그 API 호출
      api.admin
        .addAdminLog('삭제', `댓글 ID: ${commentId}를 삭제했습니다.`)
        .catch((e) => console.error('관리자 로그 기록 실패:', e));
    })
    .catch((error) => {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    });
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

// 관리자 로그 추가 (UI에만 표시)
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
