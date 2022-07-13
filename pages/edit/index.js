import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { db, auth } from '../../lib/firebaseConfig';
import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc,
} from 'firebase/firestore';
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
  const ref = collection( getFirestore(), 'users', auth.currentUser.uid, 'posts'
  );
  const postQuery = query(ref, orderBy('createdAt'));

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
  const [content, setContent] = useState('');

  // make url address safe to search by replacing space with dash
  const slug = encodeURI(kebabCase(title));

  // title length validation
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: true, // default to true, later making as a checkbox
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success('Post created!');

    // reroute to the index page
    router.push(`/`);
  };

  return (
    <section className="w-full mt-4 mx-auto rounded-lg text-slate-700 bg-cyan-100 shadow p-5 text-gray-800 max-w-xs md:max-w-lg">
      <form onSubmit={createPost}>
        <div className="flex flex-row justify-center items-center">
          <p>
            <strong className="text-slate-700 text-sm mr-2">Title:</strong>
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type title here..."
            className="bg-gray-50 p-1 pl-2 rounded-md text-sm px-16 focus:outline-none focus:ring-2 focus:ring-violet-300"
            autoComplete="false"
            autoFocus
          />
        </div>
        <p className="text-center">
          <strong className="text-slate-500 text-xs mx-2">
            title should be in English alphabets for now
          </strong>
        </p>
        {/* for debugging title*/}
        {/* <p className="text-center mt-1">
          <strong className="text-slate-700 text-xs mx-2">{
            slug}
          </strong>
        </p> */}
        <div className="flex flex-col justify-center items-center mt-0">
          <textarea
            id="content"
            name="content"
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="h-64 p-2.5 mt-6 w-full text-sm text-slate-700 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 md:h-96"
            placeholder="Your message...(UTF-8)"
          ></textarea>
          {/* <fieldset className="flex align-middle mt-1">
            <input className="checkbox mr-1" name="published" type="checkbox" />
            <label className="text-slate-700 text-xs">Published</label>
          </fieldset> */}
        </div>
        <div className="flex justify-center mt-2 md:mt-3">
          <button
            type="submit"
            disabled={!isValid}
            className="bg-cyan-500 text-stone-50 px-3 py-1.5 rounded-full hover:bg-cyan-700 hover:cursor-pointer"
          >
            Create New Post
          </button>
        </div>
      </form>
    </section>
  );
}
