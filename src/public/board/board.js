document.addEventListener('DOMContentLoaded', () => {
  const createPostBtn = document.getElementById('createPostBtn');
  const postsTableBody = document.querySelector('#postsTable tbody');

  createPostBtn.addEventListener('click', () => {
    // 새 글 작성 페이지로 이동 (아직 구현되지 않음)
    alert('새 글 작성 기능은 아직 구현되지 않았습니다.');
  });

  async function loadPosts() {
    try {
      const response = await api.getPosts();
      console.log('게시글 응답:', response);
      let postsArray = [];

      if (Array.isArray(response)) {
        postsArray = response;
      } else if (Array.isArray(response.posts)) {
        postsArray = response.posts;
      } else if (Array.isArray(response.data)) {
        postsArray = response.data;
      } else if (response.posts && typeof response.posts === 'object') {
        // response.posts가 객체 형태라면, Object.values()로 배열로 변환
        postsArray = Object.values(response.posts);
      } else {
        throw new Error('게시글 목록이 배열이 아닙니다.');
      }

      // 이제 postsArray가 배열이므로 테이블에 게시글을 렌더링
      const postsTableBody = document.querySelector('#postsTable tbody');
      postsTableBody.innerHTML = ''; // 기존 내용 초기화

      postsArray.forEach((post) => {
        const row = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = post.title;
        row.appendChild(titleCell);

        const authorCell = document.createElement('td');
        authorCell.textContent = post.author ? post.author : '익명';
        row.appendChild(authorCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = post.createdAt
          ? new Date(post.createdAt).toLocaleString()
          : '';
        row.appendChild(dateCell);

        postsTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }

  loadPosts();
});
