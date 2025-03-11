document.addEventListener('DOMContentLoaded', async () => {
  checkTokenExpiration();
  await loadRooms();

  // 비밀방 체크박스 이벤트 리스너
  document.getElementById('isPrivate').addEventListener('change', function () {
    const passwordGroup = document.getElementById('passwordGroup');
    const passwordInput = document.getElementById('roomPassword');

    if (this.checked) {
      passwordGroup.style.display = 'block';
      passwordInput.disabled = false;
      passwordInput.focus();
    } else {
      passwordGroup.style.display = 'none';
      passwordInput.disabled = true;
      passwordInput.value = '';
    }
  });
});

function checkTokenExpiration() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login/login.html';
    return;
  }
}

async function loadRooms() {
  try {
    // 로딩 상태 표시
    const roomList = document.getElementById('roomList');
    roomList.innerHTML =
      '<div class="loading-message">방 목록을 불러오는 중...</div>';

    const data = await api.rooms.getRooms();
    updateRoomList(data.rooms);
  } catch (error) {
    if (error.message.includes('401')) {
      console.log('🔄 방 목록 조회 중 액세스 토큰 만료됨. 리프레시 시도');
      const newToken = await refreshAccessToken();
      if (newToken) {
        try {
          const data = await api.rooms.getRooms();
          updateRoomList(data.rooms);
        } catch (error2) {
          console.error('토큰 갱신 후에도 방 목록 조회 실패:', error2);
          showErrorMessage('방 목록을 불러오는데 실패했습니다.');
        }
      }
    } else {
      console.error('방 목록을 가져오는 중 오류 발생:', error);
      showErrorMessage('방 목록을 불러오는데 실패했습니다.');
    }
  }
}

function updateRoomList(rooms) {
  const roomList = document.getElementById('roomList');

  if (!rooms || rooms.length === 0) {
    roomList.innerHTML =
      '<div class="empty-message">현재 생성된 방이 없습니다. 새로운 방을 만들어보세요!</div>';
    return;
  }

  roomList.innerHTML = '';

  rooms.forEach((room) => {
    const statusClass = room.status === '대기중' ? 'waiting' : 'playing';

    const roomElement = document.createElement('div');
    roomElement.className = 'room-item';
    roomElement.innerHTML = `
      <div class="room-name">${room.roomName}${room.locked ? ' 🔒' : ''}</div>
      <div class="room-status ${statusClass}">${room.status}</div>
      <div class="room-players">${room.playerCount}/${room.mode === '6인용 모드' ? '6' : '8'}</div>
      <button class="join-button" onclick="joinRoom(${room.roomId})">입장</button>
    `;
    roomList.appendChild(roomElement);
  });
}

function showErrorMessage(message) {
  const roomList = document.getElementById('roomList');
  roomList.innerHTML = `<div class="error-message">${message}</div>`;
}

async function refreshAccessToken() {
  try {
    const data = await api.refreshToken();
    if (!data.accessToken) {
      throw new Error('새로운 액세스 토큰을 받지 못했습니다.');
    }
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error('❌ 리프레시 토큰 만료:', error);
    if (confirm('세션이 만료되었습니다. 다시 로그인하시겠습니까?')) {
      logout();
    }
  }
}

async function searchRooms() {
  const query = document.getElementById('searchRoom').value.trim();
  if (query === '') {
    await loadRooms(); // 검색어가 없으면 전체 방 목록 다시 가져오기
    return;
  }

  try {
    // 로딩 상태 표시
    const roomList = document.getElementById('roomList');
    roomList.innerHTML = '<div class="loading-message">검색 중...</div>';

    const data = await api.rooms.searchRooms(query);

    if (!data.rooms || data.rooms.length === 0) {
      roomList.innerHTML =
        '<div class="empty-message">검색 결과가 없습니다.</div>';
      return;
    }

    updateRoomList(data.rooms);
  } catch (error) {
    console.error('방 검색 오류:', error);
    showErrorMessage('방 검색 중 오류가 발생했습니다.');
  }
}

async function joinRoom(roomId) {
  try {
    const data = await api.rooms.getRoom(roomId);
    localStorage.setItem('userId', data.userId);
    window.location.href = `/room/room.html?roomId=${roomId}`;
  } catch (error) {
    if (error.message.includes('비밀번호')) {
      const password = prompt('비밀번호를 입력하세요:');
      if (password) {
        try {
          const data = await api.rooms.joinPrivateRoom(roomId, password);
          localStorage.setItem('userId', data.userId);
          window.location.href = `/room/room.html?roomId=${roomId}`;
        } catch (pwError) {
          alert(pwError.message);
        }
      }
    } else {
      alert(error.message);
      console.error('방 입장 오류:', error);
    }
  }
}

function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = 'index.html';
}

function openModal() {
  // 모달 초기화
  document.getElementById('roomName').value = '';
  document.getElementById('roomMode').value = '6인용 모드';
  document.getElementById('isPrivate').checked = false;
  document.getElementById('roomPassword').value = '';
  document.getElementById('roomPassword').disabled = true;
  document.getElementById('passwordGroup').style.display = 'none';

  // 모달 표시
  document.getElementById('roomModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('roomModal').style.display = 'none';
}

async function createRoom() {
  const roomName = document.getElementById('roomName').value.trim();
  const mode = document.getElementById('roomMode').value;
  const locked = document.getElementById('isPrivate').checked;
  const password = locked
    ? document.getElementById('roomPassword').value.trim()
    : null;

  if (!roomName) {
    alert('방 이름을 입력해주세요.');
    document.getElementById('roomName').focus();
    return;
  }

  if (locked && !password) {
    alert('비밀방으로 설정하려면 비밀번호를 입력해주세요.');
    document.getElementById('roomPassword').focus();
    return;
  }

  try {
    const data = await api.rooms.createRoom({
      roomName,
      mode,
      locked,
      password,
    });

    closeModal();
    // 생성된 방으로 자동 입장
    joinRoom(data.roomId);
  } catch (error) {
    alert(error.message || '방 생성 중 오류가 발생했습니다.');
    console.error('방 생성 오류:', error);
  }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// 모달 외부 클릭 시 닫기
document
  .getElementById('roomModal')
  .addEventListener('click', function (event) {
    if (event.target === this) {
      closeModal();
    }
  });
