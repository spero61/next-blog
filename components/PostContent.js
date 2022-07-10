import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div>
      <h1 className="text-lg text-slate-700 font-bold mt-3 mb-1 md:text-2xl">{post?.title}</h1>
      <p className="text-xs">
        posted by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
      </p>
      <div className="my-4">
        {/* need to styling later */}
        <ReactMarkdown>{post?.content}</ReactMarkdown>
      </div>
      <p className="text-gray-400 text-xs flex justify-end mt-3">
        {createdAt.toLocaleDateString('ja-JP')}
        {' '}
        {createdAt.toLocaleTimeString('ja-JP').slice(0,-3)}
      </p>
    </div>
  );
}