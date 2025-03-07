document.addEventListener('DOMContentLoaded', async () => {
  checkTokenExpiration();
  await loadRooms();
});

function checkTokenExpiration() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'index.html';
    return;
  }
}

async function loadRooms() {
  try {
    const data = await api.rooms.getRooms(); // api.js에 정의된 getRooms 사용
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
        }
      }
    } else {
      console.error('방 목록을 가져오는 중 오류 발생:', error);
    }
  }
}

function updateRoomList(rooms) {
  const roomList = document.getElementById('roomList');
  roomList.innerHTML = '';
  rooms.forEach((room) => {
    const roomElement = document.createElement('div');
    roomElement.className = 'room-item';
    roomElement.innerHTML = `
        <span>${room.roomName}</span>
        <div class="room-info">${room.status} | 인원 ${room.playerCount}/8</div>
        <button onclick="joinRoom(${room.roomId})">입장</button>
      `;
    roomList.appendChild(roomElement);
  });
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
    const data = await api.rooms.searchRooms(query);
    updateRoomList(data.rooms);
  } catch (error) {
    console.error('방 검색 오류:', error);
  }
}

async function joinRoom(roomId) {
  try {
    const data = await api.rooms.getRoom(roomId);
    localStorage.setItem('userId', data.userId);
    window.location.href = `/room/room.html?roomId=${roomId}`;
  } catch (error) {
    alert(error.message);
    console.error('방 입장 오류:', error);
  }
}

function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = `${CONFIG.API_BASE_URL}/index.html`;
}

function openModal() {
  document.getElementById('roomModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('roomModal').style.display = 'none';
}

document.getElementById('isPrivate').addEventListener('change', function () {
  document.getElementById('roomPassword').disabled = !this.checked;
});

async function createRoom() {
  const token = localStorage.getItem('accessToken');
  const roomName = document.getElementById('roomName').value.trim();
  const mode = document.getElementById('roomMode').value;
  const locked = document.getElementById('isPrivate').checked;
  const password = locked
    ? document.getElementById('roomPassword').value.trim()
    : null;

  if (!roomName) {
    alert('방 이름을 입력해주세요.');
    return;
  }

  try {
    const data = await api.rooms.createRoom({
      roomName,
      mode,
      locked,
      password,
    });
    alert(`'${roomName}' 방이 생성되었습니다.`);
    closeModal();
    // 생성된 방으로 자동 입장
    joinRoom(data.roomId);
  } catch (error) {
    alert(error.message);
    console.error('방 생성 오류:', error);
  }
}
