// api.js 파일에서 api 객체를 import 합니다. 가정입니다. 실제 파일명과 import 방식은 프로젝트 구조에 따라 다릅니다.
import * as api from "./api.js"

document.addEventListener("DOMContentLoaded", () => {
  const createPostBtn = document.getElementById("createPostBtn")
  const postsTableBody = document.querySelector("#postsTable tbody")

  createPostBtn.addEventListener("click", () => {
    // 새 글 작성 페이지로 이동 (아직 구현되지 않음)
    alert("새 글 작성 기능은 아직 구현되지 않았습니다.")
  })

  async function loadPosts() {
    try {
      const posts = await api.getPosts()
      postsTableBody.innerHTML = ""
      posts.forEach((post) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                    <td>${post.title}</td>
                    <td>${post.author}</td>
                    <td>${new Date(post.createdAt).toLocaleDateString()}</td>
                `
        row.addEventListener("click", () => {
          // 게시글 상세 페이지로 이동 (아직 구현되지 않음)
          alert(`게시글 ID ${post.id}의 상세 페이지로 이동합니다.`)
        })
        postsTableBody.appendChild(row)
      })
    } catch (error) {
      console.error("Failed to load posts:", error)
      alert("게시글을 불러오는데 실패했습니다.")
    }
  }

  loadPosts()
})

