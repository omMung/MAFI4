document.addEventListener('DOMContentLoaded', () => {
  const writeForm = document.getElementById('writeForm');

  writeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const fileInput = document.getElementById('file'); // 파일 입력 필드가 있다면
    const file = fileInput ? fileInput.files[0] : null;
    console.log(title, content);
    // 만약 파일이 있다면 FormData를 사용, 없으면 일반 객체로 전달
    let postData;
    if (file) {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('file', file);
    } else {
      postData = { title, content };
    }

    try {
      const response = await api.createPost(postData);
      console.log('Post created:', response);
      alert('글이 성공적으로 작성되었습니다.');
      window.location.href = '/board/board.html';
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  });
});
