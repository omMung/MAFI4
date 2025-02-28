import PostForm from "@/components/board/post-form"

export default function CreatePostPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#1a2e4a]">새 글 작성</h1>
      <PostForm />
    </div>
  )
}

