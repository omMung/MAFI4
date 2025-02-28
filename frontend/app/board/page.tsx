import Link from 'next/link';
import { api } from '@/lib/api';
import type { Post } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';

export default async function BoardPage() {
  let posts: Post[] = [];
  let error = null;

  try {
    posts = await api.getPosts();
  } catch (e) {
    console.error('Failed to fetch posts:', e);
    error = 'Failed to load posts. Please try again later.';
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#1a2e4a]">게시판</h1>
      <Link href="/board/create">
        <Button className="mb-4 bg-[#1a2e4a] hover:bg-[#152238] text-white">
          새 글 작성
        </Button>
      </Link>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f5ecd7] text-[#1a2e4a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                작성일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/board/${post.id}`}
                      className="text-[#1a2e4a] hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.user?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  {error
                    ? '게시물을 불러올 수 없습니다.'
                    : '게시물이 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
