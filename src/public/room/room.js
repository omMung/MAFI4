// room.js

// CONFIG 변수는 config.js에서 정의했다고 가정합니다.
console.log('CONFIG:', CONFIG);

function getRoomIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('roomId');
}

var roomId = getRoomIdFromUrl();
document.getElementById('roomTitle').textContent = '채팅룸 (룸 ' + roomId + ')';

var isVotingPhase = false;
var currentUserId;
var sender = { id: Number, role: String, isAlive: Boolean };
var socket; // 소켓 변수
var roomInfo;
var selectedTargetId = null;
var mafiaBtn = document.getElementById('mafiaActionBtn');
var policeBtn = document.getElementById('policeActionBtn');
var doctorBtn = document.getElementById('doctorActionBtn');

function updatePhaseTimer(phase, remainingTime) {
  const phaseTimerElement = document.getElementById('phaseTimer');
  if (!phaseTimerElement) {
    console.error('❌ phaseTimer 요소를 찾을 수 없음!');
    return;
  }
  phaseTimerElement.textContent = `(${phase}) ⏳ ${remainingTime}초`;
  phaseTimerElement.style.display = 'inline';
}

window.onload = function () {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
    window.location.href = `${CONFIG.API_BASE_URL}/index.html`;
    return;
  }
  currentUserId = userId;

  socket = io(`${CONFIG.GAME_BASE_URL}/room`, {
    auth: { roomId: roomId, userId: currentUserId },
  });

  sender.role = 'player';
  sender.isAlive = true;

  document.getElementById('mainContainer').style.display = 'flex';
  document.getElementById('firstVoteContainer').style.display = 'block';

  socket.emit('joinRoom', { roomId: roomId, userId: currentUserId });
  socket.emit('requestRoomInfo', { roomId: roomId });

  socket.once('ROOM:JOINED', function (data) {
    roomInfo = data;
    console.log('ROOM:JOINED 수신:', roomInfo);
    updateOccupantList(roomInfo);
  });

  socket.on('ROOM:UPDATED', function (data) {
    roomInfo = data;
    console.log('ROOM:UPDATED 수신:', roomInfo);
    updateOccupantList(roomInfo);
  });

  socket.on('message', function (data) {
    appendChatMessage('[' + data.sender + '] ' + data.message);
  });

  socket.on('CHAT:DEAD', function (data) {
    appendChatMessage('[' + data.sender + '] ' + data.message, 'CHAT:DEAD');
  });

  socket.on('CHAT:MAFIA', function (data) {
    appendChatMessage('[' + data.sender + '] ' + data.message, 'CHAT:MAFIA');
  });

  socket.on('updateTimer', (data) => {
    console.log('⏳ 타이머 업데이트:', data);
    updatePhaseTimer(data.phase, data.timerTime);
  });

  socket.on('voteSuccess', function (data) {
    appendChatMessage('[' + data.voterId + '] ' + data.message, 'voteSucess');
    socket.off('voteSuccess');
  });

  socket.on('system_message', function (data) {
    appendChatMessage(`[공지] ${data.message}`, 'system_message');
  });

  socket.on('VOTE:SURVIVAL', function (data) {
    console.log('VOTE:SURVIVAL 이벤트 수신:', data);
    var winnerBtn = document.querySelector(
      `.occupant-btn[data-userid="${data.winnerId}"]`,
    );
    if (winnerBtn) {
      winnerBtn.classList.add('blink');
    }
    document.getElementById('firstVoteContainer').style.display = 'none';
    document.getElementById('secondVoteContainer').style.display = 'block';
  });

  document.getElementById('sendBtn').addEventListener('click', sendChatMessage);

  socket.on('YOUR_ROLE', function (data) {
    sender = data.sender;
    appendChatMessage(data.message, true);
    updateMyRole(sender.role);
  });

  function updateMyRole(role) {
    var myOccupantDiv = document.getElementById('myOccupantDiv');
    myOccupantDiv.innerHTML = '';
    var myBtn = document.createElement('button');
    myBtn.className = 'btn btn-secondary occupant-btn';
    myBtn.textContent = `👤 나 (사용자 ${currentUserId}) - [${role}]`;
    myBtn.disabled = true;
    myOccupantDiv.appendChild(myBtn);
  }

  socket.on('error', function (data) {
    if (data.message === '방 최대 인원에 도달했습니다.') {
      alert('방 최대 인원에 도달했습니다. 로비로 이동합니다.');
      window.location.href = `${CONFIG.API_BASE_URL}/game.html`;
    } else {
      alert('게임 에러: ' + data.message);
    }
  });

  // 기타 소켓 이벤트 및 밤, 투표 관련 로직...
  // (생략: 기존 로직 그대로 포함)

  attachRoleActionHandlers();
};

function attachRoleActionHandlers() {
  document
    .getElementById('mafiaActionBtn')
    .addEventListener('click', handleMafiaAction);
  document
    .getElementById('policeActionBtn')
    .addEventListener('click', handlePoliceAction);
  document
    .getElementById('doctorActionBtn')
    .addEventListener('click', handleDoctorAction);
}

function handleMafiaAction() {
  if (!selectedTargetId) {
    alert('대상을 선택하세요.');
    return;
  }
  socket.off('ACTION:MAFIA_TARGET');
  socket.emit(
    'ACTION:MAFIA_TARGET',
    { roomId, userId: currentUserId, targetUserId: Number(selectedTargetId) },
    function (response) {
      if (response && response.success) {
        appendChatMessage('[마피아] 능력 사용 완료!', true);
        hideRoleActionContainer();
        clearSelection();
        checkNightActionsCompleted();
      } else {
        alert(response?.message || '능력 사용 실패');
      }
    },
  );
  var mafiaBtn = document.getElementById('mafiaActionBtn');
  mafiaBtn.disabled = true;
  mafiaBtn.classList.add('disabled-btn');
}

function handlePoliceAction() {
  if (!selectedTargetId) {
    alert('대상을 선택하세요.');
    return;
  }
  socket.off('ACTION:POLICE_TARGET');
  socket.emit(
    'ACTION:POLICE_TARGET',
    { roomId, userId: currentUserId, targetUserId: Number(selectedTargetId) },
    function (response) {
      if (response && response.success) {
        appendChatMessage('[경찰] 능력 사용 완료!', true);
        hideRoleActionContainer();
        clearSelection();
        checkNightActionsCompleted();
      } else {
        alert(response?.message || '능력 사용 실패');
      }
    },
  );
  var policeBtn = document.getElementById('policeActionBtn');
  policeBtn.disabled = true;
  policeBtn.classList.add('disabled-btn');
}

function handleDoctorAction() {
  if (!selectedTargetId) {
    alert('대상을 선택하세요.');
    return;
  }
  socket.off('ACTION:DOCTOR_TARGET');
  socket.emit(
    'ACTION:DOCTOR_TARGET',
    { roomId, userId: currentUserId, targetUserId: Number(selectedTargetId) },
    function (response) {
      if (response && response.success) {
        appendChatMessage('[의사] 능력 사용 완료!', true);
        hideRoleActionContainer();
        clearSelection();
        checkNightActionsCompleted();
      } else {
        alert(response?.message || '능력 사용 실패');
      }
    },
  );
  var doctorBtn = document.getElementById('doctorActionBtn');
  doctorBtn.disabled = true;
  doctorBtn.classList.add('disabled-btn');
}

function hideRoleActionContainer() {
  document.getElementById('roleActionContainer').style.display = 'none';
}

function checkNightActionsCompleted() {
  console.log('checkNightActionsCompleted');
  socket.off('CHECK:NIGHT_ACTIONS');
  socket.emit('CHECK:NIGHT_ACTIONS', { roomId: roomId }, function (response) {
    console.log('CHECK:NIGHT_ACTIONS 응답:', response);
    if (response.allActionsCompleted) {
      console.log('🔥 모든 밤 액션 완료됨. `PROCESS:NIGHT_RESULT` 요청!');
      socket.emit('PROCESS:NIGHT_RESULT', { roomId: roomId });
    }
  });
}

function appendChatMessage(message, isRole) {
  var chatMessagesDiv = document.getElementById('chatMessages');
  var messageElement = document.createElement('div');
  if (isRole === 'system_message') {
    messageElement.classList.add('role-message');
  } else if (isRole === 'CHAT:DEAD') {
    messageElement.classList.add('red-message');
  } else if (isRole === 'CHAT:MAFIA') {
    messageElement.classList.add('purple-message');
  }
  messageElement.textContent = message;
  chatMessagesDiv.appendChild(messageElement);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function sendChatMessage() {
  var messageInputElem = document.getElementById('messageInput');
  var message = messageInputElem ? messageInputElem.value : '';
  if (message.trim() === '') return;
  if (!sender.isAlive) {
    console.log('죽은경우');
    socket.emit('chatDead', {
      roomId,
      userId: currentUserId,
      message: message,
    });
    if (messageInputElem) messageInputElem.value = '';
  } else if (sender.role === 'mafia') {
    console.log('마살');
    socket.emit('chatMafia', {
      roomId,
      userId: currentUserId,
      message: message,
    });
    if (messageInputElem) messageInputElem.value = '';
  } else if (
    sender.role === 'citizen' ||
    sender.role === 'doctor' ||
    sender.role === 'police'
  ) {
    console.log('시민 채팅');
    socket.emit('chatCitizen', {
      roomId,
      userId: currentUserId,
      message: message,
    });
    if (messageInputElem) messageInputElem.value = '';
  } else {
    console.log('일반채팅');
    socket.emit('chatMessage', {
      roomId,
      userId: currentUserId,
      message: message,
    });
    if (messageInputElem) messageInputElem.value = '';
  }
}

function updateOccupantList(roomData) {
  console.log('접속 인원 업데이트:', roomData);
  var occupantListDiv = document.getElementById('occupantList');
  var myOccupantDiv = document.getElementById('myOccupantDiv');
  occupantListDiv.innerHTML = '';
  myOccupantDiv.innerHTML = '';
  var players = [];
  try {
    players =
      typeof roomData.players === 'string'
        ? JSON.parse(roomData.players)
        : roomData.players;
  } catch (error) {
    players = [];
  }
  var otherPlayers = [];
  var currentPlayer = null;
  players.forEach(function (player) {
    if (player.id === currentUserId) {
      currentPlayer = player;
    } else {
      otherPlayers.push(player);
    }
  });
  otherPlayers.forEach(function (player) {
    var btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary occupant-btn';
    btn.textContent = '사용자 ' + player.id;
    btn.dataset.userid = player.id;
    btn.addEventListener('click', function () {
      document
        .querySelectorAll('.occupant-btn:not([disabled])')
        .forEach(function (b) {
          b.classList.remove('selected');
        });
      btn.classList.add('selected');
      selectedTargetId = Number(btn.dataset.userid);
      console.log('선택된 대상:', selectedTargetId);
    });
    occupantListDiv.appendChild(btn);
  });
  if (currentPlayer) {
    var myBtn = document.createElement('button');
    myBtn.className = 'btn btn-secondary occupant-btn';
    var roleText = currentPlayer.role ? ` - [${currentPlayer.role}]` : '';
    myBtn.textContent = `👤 나 (사용자 ${currentUserId})${roleText}`;
    myBtn.disabled = true;
    myOccupantDiv.appendChild(myBtn);
  }
}

function clearSelection() {
  var allBtns = document.querySelectorAll('.occupant-btn');
  allBtns.forEach(function (b) {
    b.classList.remove('selected');
  });
  selectedTargetId = null;
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
  });
  document
    .querySelector(`.tab-button[data-tab="${tabName}"]`)
    .classList.add('active');
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

async function fetchUserPosts(page) {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');
  console.log(userId);
  try {
    const response = await api.admin.getUserPosts(userId);
    const postsData = response.posts;
    const pageSize = 10;
    const totalPosts = postsData.length;
    const totalPages = Math.ceil(totalPosts / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const postsForPage = postsData.slice(startIndex, endIndex);
    renderUserPosts(postsForPage, totalPages, page);
  } catch (error) {
    console.error('게시글을 가져오는데 실패했습니다:', error);
    showEmptyPosts();
  }
}

function renderUserPosts(posts, totalPages, currentPage) {
  const postsListElement = document.getElementById('userPostsList');
  const emptyMessage = document.getElementById('emptyPostsMessage');
  if (emptyMessage) emptyMessage.style.display = 'none';
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
  postsListElement.querySelectorAll('.content-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', updateDeleteButtonState);
  });
  postsListElement
    .querySelectorAll('.content-action-button.view')
    .forEach((button) => {
      button.addEventListener('click', function () {
        const postId = this.getAttribute('data-id');
        window.open(`../post/post.html?postId=${postId}`, '_blank');
      });
    });
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
  createPagination('postsPagenation', totalPages, currentPage, fetchUserPosts);
}

async function fetchUserComments(page) {
  const userId = document
    .getElementById('userInfoSection')
    .getAttribute('data-user-id');
  try {
    const response = await api.admin.getUserComments(userId);
    console.log(response);
    const commentsData = response.comments;
    const pageSize = 10;
    const totalComments = commentsData.length;
    const totalPages = Math.ceil(totalComments / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const commentsForPage = commentsData.slice(startIndex, endIndex);
    renderUserComments(commentsForPage, totalPages, page);
  } catch (error) {
    console.error('댓글을 가져오는데 실패했습니다:', error);
    showEmptyComments();
  }
}

function renderUserComments(comments, totalPages, currentPage) {
  const commentsListElement = document.getElementById('userCommentsList');
  const emptyMessage = document.getElementById('emptyCommentsMessage');
  if (emptyMessage) emptyMessage.style.display = 'none';
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
  commentsListElement
    .querySelectorAll('.content-checkbox')
    .forEach((checkbox) => {
      checkbox.addEventListener('change', updateDeleteButtonState);
    });
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
  createPagination(
    'commentsPagenation',
    totalPages,
    currentPage,
    fetchUserComments,
  );
}

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

function deletePost(postId) {
  api
    .deletePost(postId)
    .then((response) => {
      alert('게시글이 삭제되었습니다.');
      fetchUserPosts(1);
      addAdminLog('삭제', `게시글 ID: ${postId}를 삭제했습니다.`);
      api.admin
        .addAdminLog('삭제', `게시글 ID: ${postId}를 삭제했습니다.`)
        .catch((e) => console.error('관리자 로그 기록 실패:', e));
    })
    .catch((error) => {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    });
}

function deleteComment(commentId) {
  api
    .deleteComment(commentId)
    .then((response) => {
      alert('댓글이 삭제되었습니다.');
      fetchUserComments(1);
      addAdminLog('삭제', `댓글 ID: ${commentId}를 삭제했습니다.`);
      api.admin
        .addAdminLog('삭제', `댓글 ID: ${commentId}를 삭제했습니다.`)
        .catch((e) => console.error('관리자 로그 기록 실패:', e));
    })
    .catch((error) => {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    });
}

function showEmptyPosts() {
  document.getElementById('userPostsList').innerHTML = '';
  document.getElementById('emptyPostsMessage').style.display = 'block';
  document.getElementById('postsPagenation').innerHTML = '';
  document.getElementById('deleteSelectedPostsBtn').disabled = true;
}

function showEmptyComments() {
  document.getElementById('userCommentsList').innerHTML = '';
  document.getElementById('emptyCommentsMessage').style.display = 'block';
  document.getElementById('commentsPagenation').innerHTML = '';
  document.getElementById('deleteSelectedCommentsBtn').disabled = true;
}

function createPagination(elementId, totalPages, currentPage, callback) {
  const paginationElement = document.getElementById(elementId);
  paginationElement.innerHTML = '';
  if (totalPages <= 1) return;
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'page-button';
    prevButton.textContent = '이전';
    prevButton.addEventListener('click', () => callback(currentPage - 1));
    paginationElement.appendChild(prevButton);
  }
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `page-button ${i === currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => callback(i));
    paginationElement.appendChild(pageButton);
  }
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.className = 'page-button';
    nextButton.textContent = '다음';
    nextButton.addEventListener('click', () => callback(currentPage + 1));
    paginationElement.appendChild(nextButton);
  }
}

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
  const logEntries = logContainer.querySelectorAll('.log-entry');
  if (logEntries.length > 50) {
    logContainer.removeChild(logEntries[logEntries.length - 1]);
  }
}
