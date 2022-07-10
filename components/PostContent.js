import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="w-full mt-6 mx-auto rounded-lg text-slate-700 bg-slate-50 shadow p-4 text-gray-800 max-w-xs md:max-w-lg">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        posted by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}