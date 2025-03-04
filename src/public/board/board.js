document.addEventListener('DOMContentLoaded', () => {
  const createPostBtn = document.getElementById('createPostBtn');
  const postsTableBody = document.querySelector('#postsTable tbody');

  createPostBtn.addEventListener('click', () => {
    window.location.href = '/createPost/createPost.html';
  });

  async function loadPosts() {
    try {
      const response = await api.getPosts();
      console.log('게시글 응답 전체:', response);

      let postsArray = [];

      // 응답 구조가 { message, data: { posts } } 형태인 경우
      if (response.data && Array.isArray(response.data.posts)) {
        postsArray = response.data.posts;
      } else {
        throw new Error('게시글 목록을 찾을 수 없습니다.');
      }

      postsTableBody.innerHTML = ''; // 기존 내용 초기화

      postsArray.forEach((post) => {
        const row = document.createElement('tr');

        // 각 행을 클릭하면 상세 페이지로 이동하도록 이벤트 등록
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
          // URL에 쿼리 파라미터 형태로 postId 전달
          window.location.href = `/post/post.html?postId=${post.id}`;
        });

        const titleCell = document.createElement('td');
        titleCell.textContent = post.title;
        row.appendChild(titleCell);

        const authorCell = document.createElement('td');
        // post.user가 없으면 "익명" 처리
        authorCell.textContent =
          post.user && post.user.nickName ? post.user.nickName : '익명';
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
