document.addEventListener('DOMContentLoaded', async () => {
  const postContent = document.getElementById('postContent');
  const commentList = document.getElementById('commentList');
  const commentForm = document.getElementById('commentForm');
  // URL 쿼리스트링에서 postId 추출
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('postId');

  if (!postId) {
    alert('게시글 ID가 제공되지 않았습니다.');
    return;
  }

  async function loadPost() {
    try {
      const response = await api.getPost(postId);
      console.log('상세 게시글:', response);
      const post = response.data.post; // 응답에서 게시글 정보 추출

      // user 관계를 통해 닉네임을 가져옴 (post.user.nickName)
      const author =
        post.user && post.user.nickName ? post.user.nickName : '익명';
      const createdAt = post.createdAt
        ? new Date(post.createdAt).toLocaleString()
        : '';

      postContent.innerHTML = `
        <h1>${post.title}</h1>
        <div class="post-meta">
          <span>작성자: ${author}</span>
          <span>작성일: ${createdAt}</span>
        </div>
        <div class="post-content">${post.content}</div>
      `;
    } catch (error) {
      console.error('Failed to load post:', error);
      postContent.innerHTML = '<p>글을 불러오는데 실패했습니다.</p>';
    }
  }

  async function loadComments() {
    try {
      const response = await api.getComments(postId);
      // API 응답이 { data: [ ... ] } 형태이므로, 댓글 배열을 추출
      const commentsArray = response.data;

      commentList.innerHTML = commentsArray
        .map(
          (comment) => `
            <div class="comment">
                <div class="comment-meta">
                    <span>${comment.nickName}</span>
                    <span>${new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
          `,
        )
        .join('');
    } catch (error) {
      console.error('Failed to load comments:', error);
      commentList.innerHTML = '<p>댓글을 불러오는데 실패했습니다.</p>';
    }
  }

  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('commentContent').value;

    try {
      await api.createComment({ postId, content });
      document.getElementById('commentContent').value = '';
      await loadComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  });

  await loadPost();
  await loadComments();
});
