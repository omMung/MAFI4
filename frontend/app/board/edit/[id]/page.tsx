import { api } from "@/lib/api"
import type { Post } from "@/lib/interfaces"
import PostForm from "@/components/board/post-form"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const postId = Number.parseInt(params.id)
  const post: Post = await api.getPost(postId)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#1a2e4a]">글 수정</h1>
      <PostForm initialData={post} />
    </div>
  )
}

