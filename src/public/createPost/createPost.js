document.addEventListener('DOMContentLoaded', () => {
  const writeForm = document.getElementById('writeForm');

  writeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
      const response = await api.createPost({ title, content });
      console.log('Post created:', response);
      alert('글이 성공적으로 작성되었습니다.');
      window.location.href = '/board/board.html';
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  });
});
