"use client"

import type React from "react"

import { useState } from "react"
import { api } from "@/lib/api"
import type { Comment } from "@/lib/interfaces"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CommentSectionProps {
  postId: number
  initialComments: Comment[]
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const createdComment = await api.createComment({
        postId,
        content: newComment,
        author: "Current User", // 실제 구현 시 로그인된 사용자 정보 사용
      })
      setComments([...comments, createdComment])
      setNewComment("")
    } catch (error) {
      console.error("Error submitting comment:", error)
      alert("댓글 작성 중 오류가 발생했습니다.")
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      await api.deleteComment(commentId)
      setComments(comments.filter((comment) => comment.id !== commentId))
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("댓글 삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#1a2e4a]">댓글</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          required
          className="mb-2"
        />
        <Button type="submit" className="bg-[#1a2e4a] hover:bg-[#152238] text-white">
          댓글 작성
        </Button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{comment.author}</p>
                <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                삭제
              </Button>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

