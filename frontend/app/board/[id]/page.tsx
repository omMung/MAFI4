import { api } from "@/lib/api"
import type { Post, Comment } from "@/lib/interfaces"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CommentSection from "@/components/board/comment-section"

export default async function PostPage({ params }: { params: { id: string } }) {
  const postId = Number.parseInt(params.id)
  const post: Post = await api.getPost(postId)
  const comments: Comment[] = await api.getComments(postId)

  return (
    <div className="container mx-auto p-4">
      <Link href="/board">
        <Button className="mb-4 bg-[#1a2e4a] hover:bg-[#152238] text-white">목록으로</Button>
      </Link>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-[#1a2e4a]">{post.title}</h1>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>작성자: {post.author}</span>
          <span>작성일: {new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <div className="prose max-w-none">{post.content}</div>
      </div>
      <div className="flex justify-end space-x-2 mb-6">
        <Link href={`/board/edit/${post.id}`}>
          <Button variant="outline">수정</Button>
        </Link>
        <Button variant="destructive">삭제</Button>
      </div>
      <CommentSection postId={postId} initialComments={comments} />
    </div>
  )
}

