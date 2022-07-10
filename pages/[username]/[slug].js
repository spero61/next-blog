import PostContent from '../../components/PostContent';
import StarCounter from '../../components/StarCounter';
import AuthCheck from '../../components/AuthCheck';
import { UserContext } from '../../lib/context';
import { db, getUserWithUsername, postToJSON } from '../../lib/firebaseConfig';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';
import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';

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

  return (
    <main className="flex flex-col items-center">
      <section>
        <p className="text-slate-700 mt-2">
          {post.starCount || 0} ⭐
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button className="text-xs text-stone-100 bg-rose-400 rounded-full px-4 py-1.5 my-2 md:text-sm">Sign Up</button>
            </Link>
          }
        >
          <StarCounter postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </section>
      <section>
        <PostContent post={post} />
      </section>   
    </main>
  );
}