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

  if (postId) {
    // 좋아요 데이터 로드
    loadLikeData();

    // 좋아요 버튼 이벤트 리스너 등록
    document
      .getElementById('likeButton')
      .addEventListener('click', handleLikeClick);
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
        ${post.file ? `<div class="post-image"><img src="${post.file}" alt="게시글 이미지"></div>` : ''}
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

  // 좋아요 데이터 로드
  async function loadLikeData() {
    try {
      // 이미 JSON 데이터가 반환됨
      const likeData = await api.getLikeCount(postId);
      console.log(likeData);
      // 좋아요 상태 업데이트
      updateLikeStatus(likeData);
    } catch (error) {
      console.error('좋아요 데이터 로드 실패:', error);
      // 좋아요 데이터 로드 실패 시에도 페이지는 계속 표시
      document.getElementById('likeCount').textContent = '0';
    }
  }

  // 좋아요 상태 업데이트
  function updateLikeStatus(likeData) {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');
    const likeIcon = likeButton.querySelector('.like-icon');

    // 좋아요 개수 업데이트
    likeCount.textContent = likeData.data.count || 0;

    // 현재 사용자의 좋아요 상태 업데이트
    isLiked = likeData.data.isLiked || false;

    if (isLiked) {
      likeButton.classList.add('active');
      likeIcon.textContent = '♥'; // 채워진 하트
    } else {
      likeButton.classList.remove('active');
      likeIcon.textContent = '♡'; // 빈 하트
    }
  }

  // 좋아요 버튼 클릭 핸들러
  async function handleLikeClick() {
    const likeButton = document.getElementById('likeButton');

    try {
      // 버튼 비활성화 (중복 클릭 방지)
      likeButton.disabled = true;

      // 좋아요 토글 API 호출 (JSON 데이터가 반환됨)
      const response = await api.toggleLike(postId);
      // 더 이상 response.ok 체크하지 않음

      // 좋아요 상태 반전
      isLiked = !isLiked;

      // 애니메이션 효과 추가
      likeButton.classList.add('animate');

      // 좋아요 상태 업데이트
      const likeIcon = likeButton.querySelector('.like-icon');
      const likeCount = document.getElementById('likeCount');

      if (isLiked) {
        likeButton.classList.add('active');
        likeIcon.textContent = '♥'; // 채워진 하트
        likeCount.textContent = Number.parseInt(likeCount.textContent) + 1;
      } else {
        likeButton.classList.remove('active');
        likeIcon.textContent = '♡'; // 빈 하트
        likeCount.textContent = Math.max(
          0,
          Number.parseInt(likeCount.textContent) - 1,
        );
      }

      // 애니메이션 종료 후 클래스 제거 및 버튼 활성화
      setTimeout(() => {
        likeButton.classList.remove('animate');
        likeButton.disabled = false;
      }, 800);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
      likeButton.disabled = false;
    }
  }

  await loadPost();
  await loadComments();
});
