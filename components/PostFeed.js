import Link from 'next/link';

function PostItem({ post, edit = false }) {
    
    // https://www.mediacollege.com/internet/javascript/text/count-words.html
    function countWords(str){
        str = str.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
        str = str.replace(/[ ]{2,}/gi," ");//2 or more space to 1
        str = str.replace(/\n /,"\n"); // exclude newline with a start spacing
        return str.split(' ').filter(str => str!="").length;
        // return s.split(' ').filter(String).length; - this can also be used
    }
    const words = countWords(post?.content);
    // const words = post?.content.trim().split(/\s+/g).length;

  const minutesToRead = (words / 100 + 1).toFixed(0);

  let timestampFormatted = '12/31 12:34:56'; // initialize the value for debugging
  if (post?.createdAt) {
    const timestamp = new Date(post?.createdAt);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    timestampFormatted = timestamp.toLocaleDateString('ja-JP').slice(5); // to get rid of year
  }

  const postContentPreview = post?.content.slice(0, 100) + "...";

  return (
    
    <section className="w-full mt-6 mx-auto rounded-lg text-slate-700 bg-slate-50 shadow p-4 text-gray-800 max-w-xs md:max-w-lg">
      <Link href={`/${post?.username}`}>
        <a className="hover:opacity-75">
          <p className="mb-1 text-slate-500 text-xs">posted by <strong className="text-slate-700 text-xs hover:text-cyan-700">@{post.username}</strong></p>
        </a>
      </Link>

      <Link href={`/${post?.username}/${post?.slug}`}>
        <a className="hover:opacity-75">
          <h2 className="mb-1 text-base text-slate-900 font-bold md:text-lg md:my-2">
            {post.title}
          </h2>
          <p className="text-gray-500 text-xs font-light mb-3 md:text-sm">
            {postContentPreview}
          </p>
        </a>
      </Link>


      <footer className="flex justify-between">
        <span className="text-xs text-slate-600">
          {timestampFormatted} · <strong className="text-slate-500">{minutesToRead} min read</strong>
        </span>
        <span className="text-xs text-slate-400">⭐ {post?.starCount || 0}</span>
      </footer>

      {/* display extra control components to manage post for the current user */}
      {edit && (
        <>
          <div className="flex justify-between items-center mt-3">
          <Link href={`/edit/${post?.slug}`}>
            <h3>
              <button className="text-xs text-stone-100 bg-cyan-500 rounded-full px-5 py-1 md:text-sm hover:bg-cyan-600">Edit</button>
            </h3>
          </Link>

          {post?.published ? (
            <p className="text-xs font-medium text-emerald-500">Published</p>
          ) : (
            <p className="text-xs font-medium text-neutral-400">Unpublished</p>
          )}
          </div>
        </>
      )}
    </section>
  );
}

export default function PostFeed({ posts, edit }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} edit={edit} />
      ))
    : null;
}
