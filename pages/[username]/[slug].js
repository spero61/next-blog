import PostContent from '../../components/PostContent';
import StarCounter from '../../components/StarCounter';
import AuthCheck from '../../components/AuthCheck';
import { UserContext } from '../../lib/context';
import { useRouter } from 'next/router';
import { db, getUserWithUsername, postToJSON } from '../../lib/firebaseConfig';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';
import toast from 'react-hot-toast';

// fetch date from the server at build time
// pre-render the page in advance
// getStaticProps Docs: https://nextjs.org/docs/basic-features/data-fetching/get-static-props
export async function getStaticProps({ params }) {
  // slug is a field inside of each post collection
  const { username, slug } = params;

  // fetch userDoc based on the username
  const userDoc = await getUserWithUsername(username);

  let post = undefined;
  let path = undefined;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);

    // post = postToJSON(await postRef.get());
    post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: { post, path },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in At most once every 100 seconds
    revalidate: 100, // In seconds: https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
  };
}

// getStaticPaths Docs: https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
// getStaticPaths API: https://nextjs.org/docs/api-reference/data-fetching/get-static-paths
export async function getStaticPaths() {
  // query all posts in the firestore
  // performance can be improved if using Admin SDK: https://firebase.google.com/docs/reference/admin
  const q = query(
    collectionGroup(getFirestore(), 'posts'),
    limit(20)
  );
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    // If fallback is 'blocking', new paths not returned by getStaticPaths will wait
    // for the HTML to be generated, identical to SSR (hence why blocking),
    // and then be cached for future requests so it only happens once per path.
    fallback: 'blocking', // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
  };
}

export default function PostPage(props) {
  const postRef = doc(getFirestore(), props.path);

  // https://github.com/CSFrequency/react-firebase-hooks/blob/master/firestore/README.md#usedocumentdata
  const [realtimePost] = useDocumentData(postRef);

  // if the realtime data has not been uploaded yet,
  // fallback to the pre-rendered data on the server from the props.post
  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  async function deletePost() {
    await deleteDoc(doc(db, ``))
  }

  return (
    <main className="flex flex-wrap justify-between items-center">
      <section className="w-full mt-6 mx-auto rounded-lg text-slate-700 bg-slate-50 shadow p-5 text-gray-800 max-w-xs md:max-w-xl">
        <div className="flex justify-end">
          <AuthCheck
            fallback={
              <Link href="/enter">
                <button className="text-xs mx-auto text-stone-100 bg-rose-400 rounded-full px-4 py-2 mb-5 md:text-base hover:bg-pink-500">Sign Up!</button>
              </Link>
            }
          >
            <StarCounter postRef={postRef} />
          </AuthCheck>
          <p className="text-slate-700">
            {post.starCount || 0} ⭐
          </p>
        </div>
        <PostContent post={post} />
        <div className="flex justify-center mt-3">
          {/* implement later: when the user owns the post display Edit feature */}
          {/* {currentUser?.uid === post.uid && (
            <Link href={`/edit/${post.slug}`}>
              <button className="text-xs text-stone-100 bg-rose-400 rounded-full px-4 py-1.5 my-1 md:text-sm md:my-2">
                Edit Post
              </button>
            </Link>
          )} */}

          {/* when the user owns the post display Delete feature */}
          {currentUser?.uid === post.uid && (
            <DeletePostButton postRef={postRef} />
          )}
        </div>
      </section>   
    </main>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = window.confirm('Delete this post?');
    if (doIt) {
      await deleteDoc(postRef);
      router.push('/edit');
      toast.success('Post Deleted!');
    }
  };

  return (
    <button className="text-xs text-stone-100 bg-pink-600 rounded-full px-4 py-1.5 my-1 md:text-sm md:my-2 hover:bg-pink-900" onClick={deletePost}>
      Delete Post
    </button>
  );
}