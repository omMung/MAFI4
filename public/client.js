// client.js

// '/game' 네임스페이스에 연결합니다.
const socket = io('http://localhost:3000/game');

socket.on('connect', () => {
  console.log('Connected!');
  // 'ROOM:NIGHT_RESULT' 이벤트를 전송합니다.
  socket.emit('ROOM:NIGHT_RESULT', { message: '테스트 메시지' });
});

socket.on('ROOM:NIGHT_RESULT', (data) => {
  console.log('Received:', data);
});
