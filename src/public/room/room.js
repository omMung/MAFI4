// 방 ID 추출 (예: http://localhost:3000/room/1)
function getRoomIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('roomId'); // 'roomId' 파라미터 값 가져오기
}

var roomId = getRoomIdFromUrl(); // roomId 추출
// if (!roomId) {
//   alert('올바른 방 ID가 없습니다.');
//   window.location.href = `${CONFIG.API_BASE_URL}/game.html`; //  방 ID 없으면 로비로 이동
// }

document.getElementById('roomTitle').textContent = '채팅룸 (룸 ' + roomId + ')';

var isVotingPhase = false;
var currentUserId;
var sender = { id: Number, role: String, isAlive: Boolean }; // 발신자 정보
var socket; // 단일 소켓
var roomInfo; // 최신 방 정보
var selectedTargetId = null; // 1차 투표 시 선택된 대상의 ID
var mafiaBtn = document.getElementById('mafiaActionBtn');
var policeBtn = document.getElementById('policeActionBtn');
var doctorBtn = document.getElementById('doctorActionBtn');

//타이머 관련 로직
// UI 업데이트 함수
function updatePhaseTimer(phase, remainingTime) {
  const phaseTimerElement = document.getElementById('phaseTimer');

  if (!phaseTimerElement) {
    console.error('❌ phaseTimer 요소를 찾을 수 없음!');
    return;
  }

  // 타이머 표시 업데이트
  phaseTimerElement.textContent = `(${phase}) ⏳ ${remainingTime}초`;
  phaseTimerElement.style.display = 'inline'; // 혹시 숨겨져 있을 경우 보이도록 설정
}

// 로그인 및 룸 입장

window.onload = function () {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
    window.location.href = `${CONFIG.API_BASE_URL}/index.html`;
    return; //
  }

  currentUserId = userId;

  socket = io(`${CONFIG.GAME_BASE_URL}/room`, {
    auth: { roomId: roomId, userId: currentUserId },
  });

  sender.role = 'player';
  sender.isAlive = true;

  // UI 표시
  document.getElementById('mainContainer').style.display = 'flex';
  //document.getElementById('gameSection').style.display = 'block';
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
  // VOTE:SURVIVAL 이벤트 수신 시 2차 투표 버튼 표시 및 대상 버튼 blink 적용
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
    //currentUserRole = data.role;
    sender = data.sender;
    appendChatMessage(data.message, true);
    updateMyRole(sender.role);
  });

  function updateMyRole(role) {
    var myOccupantDiv = document.getElementById('myOccupantDiv');
    myOccupantDiv.innerHTML = ''; // 기존 내용 초기화

    var myBtn = document.createElement('button');
    myBtn.className = 'btn btn-secondary occupant-btn';
    myBtn.textContent = `👤 나 (사용자 ${currentUserId}) - [${role}]`;
    myBtn.disabled = true;

    // 인라인 스타일을 추가해 hover 및 글자색 변경 방지
    myBtn.style.backgroundColor = 'var(--bg-color-light)';
    myBtn.style.color = 'inherit';
    myBtn.style.cursor = 'default';
    myBtn.style.pointerEvents = 'none';

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

  // 서버로부터 1차 투표 버튼 보이라는 이벤트 수신 시 처리
  socket.on('VOTE:FIRST:ENABLE', function (data) {
    isVotingPhase = true;
    document.getElementById('firstVoteContainer').style.display = 'block';
    voteBtn.disabled = false;
    executeBtn.disabled = false;
    survivalBtn.disabled = false;
    voteBtn.classList.remove('disabled=btn');
    survivalBtn.classList.remove('disabled-btn');
    executeBtn.classList.remove('disabled-btn');
    mafiaBtn.disabled = false;
    policeBtn.disabled = false;
    doctorBtn.disabled = false;
    mafiaBtn.classList.remove('disabled-btn');
    policeBtn.classList.remove('disabled-btn');
    doctorBtn.classList.remove('disabled-btn');
    console.log(mafiaBtn, policeBtn, doctorBtn);
    socket.emit('UPDATE:MY_INFO', {
      roomId: roomId,
      userId: currentUserId,
    });
    socket.on('myInfo', function (data) {
      sender = data.sender;
      console.log(sender);
    });
  });

  socket.on('NOT:CHAT', function () {
    alert('밤에는 마피아만 대화할 수 있습니다.');
    return;
  });

  socket.on('POLICE:RESULT', function (data) {
    console.log('결과 수신 완료');
    appendChatMessage('[경찰 조사 결과] 대상의 역할: ' + data.role, true);
  });

  // 추가된 부분: gameEnd 이벤트 핸들러 등록
  socket.on('gameEnd', function (data) {
    // 게임 종료 이벤트 수신 시, 게임 상태 영역에 결과 메시지 표시
    appendChatMessage('게임 종료: ' + data.message);
    document.getElementById('gameStatus').textContent = data.message;
    console.log('게임 종료 데이터:', data);
  });

  socket.on('NIGHT:BACKGROUND', function (data) {
    console.log('NIGHT:BACKGROUND 이벤트 수신:', data);
    //동점시 넘어올 때 투표버튼 지우기
    document.getElementById('firstVoteContainer').style.display = 'none';
    // 전체 배경은 검정색으로
    document.body.style.backgroundColor = 'black';
    // div 배경은 순수 흰색 대신 연한 회색으로 변경
    var chatContainer = document.querySelector('.chat-container');
    var occupantContainer = document.querySelector('.occupant-container');
    if (chatContainer) chatContainer.style.backgroundColor = '#e0e0e0';
    if (occupantContainer) occupantContainer.style.backgroundColor = '#e0e0e0';
    //sender.isAlive 지정 필요
    socket.emit('UPDATE:MY_INFO', {
      roomId: roomId,
      userId: currentUserId,
    });
    socket.on('myInfo', function (data) {
      sender = data.sender;
      console.log(sender);
    });
  });

  // VOTE:FIRST:TARGET:EFFECT 이벤트 수신 시 2차 투표 버튼 표시 및 대상 버튼 blink 적용
  socket.on('VOTE:FIRST:TARGET:EFFECT', function (data) {
    console.log('VOTE:FIRST:TARGET:EFFECT 이벤트 수신:', data);
    var winnerBtn = document.querySelector(
      `.occupant-btn[data-userid="${data.winnerId}"]`,
    );
    if (winnerBtn) {
      winnerBtn.classList.add('blink');
    }
    document.getElementById('firstVoteContainer').style.display = 'none';
    document.getElementById('secondVoteContainer').style.display = 'block';
  });

  // VOTE:SECOND:DEAD 이벤트 수신 시, 대상 버튼의 blink 효과 제거 및 비활성화
  socket.on('VOTE:SECOND:DEAD', function (data) {
    console.log('VOTE:SECOND:DEAD 이벤트 수신:', data);
    var targetId = data.targetId;
    var targetBtn = document.querySelector(
      `.occupant-btn[data-userid="${targetId}"]`,
    );
    if (targetBtn) {
      targetBtn.classList.remove('blink'); // 깜빡임 제거
      targetBtn.classList.remove('btn-outline-primary');
      targetBtn.classList.add('btn-secondary');
      targetBtn.classList.add('dead'); // dead 클래스 추가
      targetBtn.textContent += '💀';
      targetBtn.disabled = true;
    }
    document.getElementById('secondVoteContainer').style.display = 'none';
  });

  // VOTE:SECOND:TIE 이벤트 수신 시, 대상 버튼의 blink 효과 제거
  socket.on('VOTE:SECOND:TIE', function (data) {
    console.log('VOTE:SECOND:TIE 이벤트 수신:', data);
    var targetId = data.targetId;
    var targetBtn = document.querySelector(
      `.occupant-btn[data-userid="${targetId}"]`,
    );
    if (targetBtn) {
      targetBtn.classList.remove('blink'); // 깜빡임 제거
      targetBtn.classList.remove('btn-outline-primary');
    }
    document.getElementById('secondVoteContainer').style.display = 'none';
  });

  // 밤 시작 신호 수신 시 역할 버튼 표시
  socket.on('NIGHT:START:SIGNAL', function (data) {
    console.log('🌙 NIGHT:START:SIGNAL 이벤트 수신:', data);
    appendChatMessage('[SYSTEM] 밤 단계로 전환됩니다...', true);
    document.body.style.backgroundColor = 'black';
    var chatContainer = document.querySelector('.chat-container');
    var occupantContainer = document.querySelector('.occupant-container');
    if (chatContainer) chatContainer.style.backgroundColor = '#2c3e50';
    if (occupantContainer) occupantContainer.style.backgroundColor = '#2c3e50';
    document.getElementById('firstVoteContainer').style.display = 'none';
    document.getElementById('secondVoteContainer').style.display = 'none';
    showRoleActionContainer();
  });

  socket.on('ROOM:NIGHT_START', function (data) {
    console.log('🌌 ROOM:NIGHT_START 이벤트 수신:', data);
    appendChatMessage('[SYSTEM] ' + data.message, true);
    document.body.style.backgroundColor = 'black';
    // 단순 안내 메시지, 역할 버튼은 NIGHT:START:SIGNAL에서 처리
  });

  // 밤 결과를 받는 함수.
  socket.off('ROOM:NIGHT_RESULT');
  socket.on('ROOM:NIGHT_RESULT', function (data) {
    console.log('🌙 ROOM:NIGHT_RESULT 이벤트 수신:', data);

    // ✅ 밤 결과 메시지를 채팅창에 추가
    appendChatMessage(`[SYSTEM] ${data.message}`, true);

    // ✅ 사망한 플레이어 강조 표시
    if (data.result && data.result.killedUserId) {
      var killedUserId = data.result.killedUserId;
      var killedUserBtn = document.querySelector(
        `.occupant-btn[data-userid="${killedUserId}"]`,
      );
      if (killedUserBtn) {
        killedUserBtn.style.backgroundColor = '#e74c3c';
        killedUserBtn.style.color = 'white';
        killedUserBtn.classList.add('btn-secondary');
        killedUserBtn.textContent += '💀';
        killedUserBtn.style.opacity = '0.5'; // opacity 0.5 설정
        killedUserBtn.disabled = true;
      }
      appendChatMessage(
        `[SYSTEM] 플레이어 ${killedUserId}가 밤에 사망했습니다.`,
        true,
      );
    }

    // ✅ 경찰 조사 결과 표시
    if (data.result && data.result.policeResult) {
      if (sender.role === 'police') {
        appendChatMessage(
          `[경찰 조사 결과] 플레이어 ${data.result.policeResult.targetUserId}의 역할: ${data.result.policeResult.role}`,
          true,
        );
      }
    }

    // ✅ 배경 색상 원래대로 변경 (밤 종료)
    document.body.style.backgroundColor = '#f0f4f8';
    var chatContainer = document.querySelector('.chat-container');
    var occupantContainer = document.querySelector('.occupant-container');
    if (chatContainer) chatContainer.style.backgroundColor = '#ffffff';
    if (occupantContainer) occupantContainer.style.backgroundColor = '#ffffff';

    // ✅ 역할 버튼 숨기기
    hideRoleActionContainer();
  });

  // 밤 결과를 테스트
  socket.on('GAME:RESULT_TEST', function (data) {
    console.log('🌙 GAME:RESULT_TEST 이벤트 수신:', data);
    appendChatMessage('[SYSTEM] 밤 테스트 결과 수신 되었습니다....', true);
  });

  // 1차 투표 확정 버튼 클릭 이벤트
  document.getElementById('voteBtn').addEventListener('click', function () {
    console.log(`1차${sender}`);
    if (!sender.isAlive) {
      alert('죽은 사람은 투표를 할 수 없습니다.');
      return;
    }

    if (!isVotingPhase) {
      alert('현재 투표가 진행되지 않는 시기입니다.');
      return;
    }

    if (!selectedTargetId) {
      alert('투표할 대상을 선택하세요.');
      return;
    }
    var voteBtn = document.getElementById('voteBtn');
    voteBtn.disabled = true;
    voteBtn.classList.add('disabled-btn');
    socket.off('VOTE:FIRST');
    socket.emit(
      'VOTE:FIRST',
      {
        roomId: roomId,
        voterId: currentUserId,
        targetId: Number(selectedTargetId),
      },
      function (response) {
        console.log('서버 응답 수신:', response);
        if (!response || !response.success) {
          alert(response?.message || '서버 응답이 올바르지 않습니다.');
          return;
        }

        console.log('1차 투표 완료:', {
          voterId: currentUserId,
          targetId: selectedTargetId,
        });
        clearSelection();
      },
    );
  });
  // 2차 투표: 사살 버튼 클릭 이벤트
  document.getElementById('executeBtn').addEventListener('click', function () {
    console.log(`2차${sender}`);
    if (!sender.isAlive) {
      alert('죽은 사람은 투표를 할 수 없습니다.');
      return;
    }

    if (!isVotingPhase) {
      alert('현재 투표가 진행되지 않는 시기입니다.');
      return;
    }

    var executeBtn = document.getElementById('executeBtn');
    var survivalBtn = document.getElementById('survivalBtn');
    executeBtn.disabled = true;
    survivalBtn.disabled = true;
    executeBtn.classList.add('disabled-btn');
    survivalBtn.classList.add('disabled-btn');

    // 기존 리스너 제거

    socket.off('VOTE:SECOND');
    socket.emit(
      'VOTE:SECOND',
      {
        roomId: roomId,
        voterId: currentUserId,
        execute: true,
      },
      function (response) {
        console.log('2차 투표 (사살) 응답:', response);
        document.getElementById('secondVoteContainer').style.display = 'none';
      },
    );
  });

  // 2차 투표: 생존 버튼 클릭 이벤트
  document.getElementById('survivalBtn').addEventListener('click', function () {
    if (!sender.isAlive) {
      alert('죽은 사람은 투표를 할 수 없습니다.');
      return;
    }

    if (!isVotingPhase) {
      alert('현재 투표가 진행되지 않는 시기입니다.');
      return;
    }

    if (!selectedTargetId) {
      alert('투표할 대상을 선택하세요.');
      return;
    }
    var executeBtn = document.getElementById('executeBtn');
    var survivalBtn = document.getElementById('survivalBtn');
    executeBtn.disabled = true;
    survivalBtn.disabled = true;
    executeBtn.classList.add('disabled-btn');
    survivalBtn.classList.add('disabled-btn');

    socket.off('VOTE:SECOND');
    socket.emit(
      'VOTE:SECOND',
      {
        roomId: roomId,
        voterId: currentUserId,
        execute: false,
      },
      function (response) {
        console.log('2차 투표 (생존) 응답:', response);
        document.getElementById('secondVoteContainer').style.display = 'none';
      },
    );
  });

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

    // 스크롤 위치 업데이트
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  }

  // 채팅 메시지 전송 함수
  function sendChatMessage() {
    var messageInputElem = document.getElementById('messageInput');
    var message = messageInputElem ? messageInputElem.value : '';
    //var sender =
    if (message.trim() === '') return;
    if (sender.isAlive === false) {
      // 죽은 사람은 무조건 'chatDead'
      console.log('죽은경우');
      socket.emit('chatDead', {
        roomId: roomId,
        userId: currentUserId,
        message: message,
      });
      if (messageInputElem) {
        messageInputElem.value = '';
      }
    } else if (sender.role === 'mafia') {
      // 마피아이면서 살아있는 경우
      console.log('마살');
      socket.emit('chatMafia', {
        roomId: roomId,
        userId: currentUserId,
        message: message,
      });
      if (messageInputElem) {
        messageInputElem.value = '';
      }
    } else if (
      sender.role === 'citizen' ||
      sender.role === 'doctor' ||
      sender.role === 'police'
    ) {
      console.log('시민 채팅');
      socket.emit('chatCitizen', {
        roomId: roomId,
        userId: currentUserId,
        message: message,
      });
      if (messageInputElem) {
        messageInputElem.value = '';
      }
    } else {
      console.log('일반채팅');
      socket.emit('chatMessage', {
        roomId: roomId,
        userId: currentUserId,
        message: message,
      });
      if (messageInputElem) {
        messageInputElem.value = '';
      }
    }
  }

  // 접속 인원 업데이트 함수
  function updateOccupantList(roomData) {
    console.log('접속 인원 업데이트:', roomData);

    var occupantListDiv = document.getElementById('occupantList');
    var myOccupantDiv = document.getElementById('myOccupantDiv');

    occupantListDiv.innerHTML = ''; // 일반 유저 리스트 초기화
    myOccupantDiv.innerHTML = ''; // 본인 표시 영역 초기화

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

    // 본인과 다른 플레이어를 분리
    players.forEach(function (player) {
      if (player.id === currentUserId) {
        currentPlayer = player;
      } else {
        otherPlayers.push(player);
      }
    });

    // 다른 플레이어 먼저 추가 (접속 순서 유지)
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

    // 본인 버튼을 새로운 div에 추가 (하단 고정)
    if (currentPlayer) {
      var myBtn = document.createElement('button');
      myBtn.className = 'btn btn-secondary occupant-btn';
      var roleText = currentPlayer.role ? ` - [${currentPlayer.role}]` : ''; // 역할이 있으면 추가
      myBtn.textContent = `👤 나 (사용자 ${currentUserId})${roleText}`;
      myBtn.disabled = true;
      myOccupantDiv.appendChild(myBtn);

      // 인라인 스타일을 추가해 hover 및 글자색 변경 방지
      myBtn.style.backgroundColor = 'var(--bg-color-light)';
      myBtn.style.color = 'inherit';
      myBtn.style.cursor = 'default';
      myBtn.style.pointerEvents = 'none';
    }
  }

  // 선택 해제 함수
  function clearSelection() {
    var allBtns = document.querySelectorAll('.occupant-btn');
    allBtns.forEach(function (b) {
      b.classList.remove('selected');
    });
    selectedTargetId = null;
  }

  // 밤 로직 처리 함수 마피아
  function handleMafiaAction() {
    if (!selectedTargetId) {
      alert('대상을 선택하세요.');
      return;
    }
    socket.off('ACTION:MAFIA_TARGET');
    socket.emit(
      'ACTION:MAFIA_TARGET',
      {
        roomId,
        userId: currentUserId,
        targetUserId: Number(selectedTargetId),
      },
      function (response) {
        if (response && response.success) {
          appendChatMessage('[마피아] 능력 사용 완료!', true);
          hideRoleActionContainer();
          clearSelection();
          checkNightActionsCompleted(); // 🔥 추가됨
        } else {
          alert(response?.message || '능력 사용 실패');
        }
      },
    );
    var mafiaBtn = document.getElementById('mafiaActionBtn');
    mafiaBtn.disabled = true;
    mafiaBtn.classList.add('disabled-btn');
  }

  // 경찰 함수
  function handlePoliceAction() {
    if (!selectedTargetId) {
      alert('대상을 선택하세요.');
      return;
    }
    socket.off('ACTION:POLICE_TARGET');
    socket.emit(
      'ACTION:POLICE_TARGET',
      {
        roomId,
        userId: currentUserId,
        targetUserId: Number(selectedTargetId),
      },
      function (response) {
        if (response && response.success) {
          appendChatMessage('[경찰] 능력 사용 완료!', true);
          hideRoleActionContainer();
          clearSelection();
          checkNightActionsCompleted(); // 🔥 추가됨
        } else {
          alert(response?.message || '능력 사용 실패');
        }
      },
    );
    var policeBtn = document.getElementById('policeActionBtn');
    policeBtn.disabled = true;
    policeBtn.classList.add('disabled-btn');
  }

  // 의사 함수
  function handleDoctorAction() {
    if (!selectedTargetId) {
      alert('대상을 선택하세요.');
      return;
    }
    socket.off('ACTION:DOCTOR_TARGET');
    socket.emit(
      'ACTION:DOCTOR_TARGET',
      {
        roomId,
        userId: currentUserId,
        targetUserId: Number(selectedTargetId),
      },
      function (response) {
        if (response && response.success) {
          appendChatMessage('[의사] 능력 사용 완료!', true);
          hideRoleActionContainer();
          clearSelection();
          checkNightActionsCompleted(); // 🔥 추가됨
        } else {
          alert(response?.message || '능력 사용 실패');
        }
      },
    );
    var doctorBtn = document.getElementById('doctorActionBtn');
    doctorBtn.disabled = true;
    doctorBtn.classList.add('disabled-btn');
  }

  // 밤 로직 역할별 버튼 핸들러 부착 (한 번만)
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
  attachRoleActionHandlers();

  // 밤 로직 역할 버튼 컨테이너 관련 함수
  function showRoleActionContainer() {
    var container = document.getElementById('roleActionContainer');
    container.style.display = 'block';
    document.getElementById('mafiaActionBtn').style.display = 'none';
    document.getElementById('policeActionBtn').style.display = 'none';
    document.getElementById('doctorActionBtn').style.display = 'none';
    console.log('showRoleActionContainer, currentUserRole:', sender.role);
    if (sender.role === 'mafia') {
      document.getElementById('mafiaActionBtn').style.display = 'block';
      appendChatMessage(
        '[마피아] 밤이 되었습니다. 제거할 대상을 선택하세요.',
        true,
      );
    } else if (sender.role === 'police') {
      document.getElementById('policeActionBtn').style.display = 'block';
      appendChatMessage(
        '[경찰] 밤이 되었습니다. 조사할 대상을 선택하세요.',
        true,
      );
    } else if (sender.role === 'doctor') {
      document.getElementById('doctorActionBtn').style.display = 'block';
      appendChatMessage(
        '[의사] 밤이 되었습니다. 보호할 대상을 선택하세요.',
        true,
      );
    } else {
      appendChatMessage(
        '[SYSTEM] 밤이 되었습니다. 결과를 기다려 주세요.',
        true,
      );
    }
  }
  //밤 로직 관련 함수
  function hideRoleActionContainer() {
    document.getElementById('roleActionContainer').style.display = 'none';
  }
  // 밤 액션 체크 함수 -> 실행이 안됨.
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
};
