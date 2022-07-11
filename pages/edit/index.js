import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { db, auth } from '../../lib/firebaseConfig';
import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc } from 'firebase/firestore';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

export default function EditPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
  );
}

// display posts owned by currently signed-in
function PostList() {
  const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')
  const postQuery = query(ref, orderBy('createdAt'))
  
  // https://github.com/CSFrequency/react-firebase-hooks/blob/master/firestore/README.md#usecollection
  const [querySnapshot] = useCollection(postQuery);
  const posts = querySnapshot?.docs.map((doc) => doc.data());

  // alternatively useCollectiionData as in pages/[username]/[slug].js

  return (
    <>
      <PostFeed posts={posts} edit={true} />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // make url address safe to search by replacing space with dash
  const slug = encodeURI(kebabCase(title));

  // title length validation
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: `# no title
      ### Please enter the content!`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success('Post created!');

    // after the doc is saved, route to slug to finish post content
    router.push(`/edit/${slug}`);
  };

  return (
    <div className="w-full mt-6 mx-auto rounded-lg text-slate-700 bg-cyan-100 shadow p-3 text-gray-800 max-w-xs md:max-w-lg">
      <form onSubmit={createPost}>
        <div className="flex flex-row justify-center items-center">
          <p>
            <strong className="text-slate-700 text-sm mr-2">Title:</strong>
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type title here..."
            className="bg-stone-100 p-1 pl-2 rounded-md text-sm px-16"
            autoComplete="false"
            autoFocus
          />
          {/* for debugging */}
          {/* <p>
            <strong className="text-slate-700 text-xs mx-2">{slug}</strong>
          </p> */}
        </div>
        <div className="flex justify-center mt-3 md:mt-4">
          <button type="submit" disabled={!isValid} className="bg-cyan-500 text-stone-50 px-3 py-1.5 rounded-full hover:bg-cyan-700 hover:cursor-pointer">
            Create New Post
          </button>
        </div>
      </form>
    </div>
  );
}