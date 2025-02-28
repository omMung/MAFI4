"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { Post } from "@/lib/interfaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface PostFormProps {
  initialData?: Post
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialData) {
        await api.updatePost(initialData.id, { title, content })
      } else {
        await api.createPost({ title, content, author: "Current User" }) // 실제 구현 시 로그인된 사용자 정보 사용
      }
      router.push("/board")
    } catch (error) {
      console.error("Error submitting post:", error)
      alert("글 저장 중 오류가 발생했습니다.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          내용
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="mt-1"
          rows={10}
        />
      </div>
      <Button type="submit" className="bg-[#1a2e4a] hover:bg-[#152238] text-white">
        {initialData ? "수정하기" : "작성하기"}
      </Button>
    </form>
  )
}

