import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { db, postToJSON, getIt } from '../lib/firebaseConfig';
import { Timestamp, query, where, orderBy, limit, collectionGroup, getDocs, startAfter, getFirestore } from 'firebase/firestore';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useState } from 'react';
import PostFeed from '../components/PostFeed';

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT), // max post limit per page
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
 
  return {
    props: { posts },
  };
}

const notify = () => toast.success('Here is your toast.');

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [isLoding, setIsLoding] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setIsLoding(true);
    const last = posts[posts.length - 1];

    // cursor to the last post
    // last post's timestamp should be firestore timestamp object, if not convert it
    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    const ref = collectionGroup(getFirestore(), 'posts');

    const postsQuery = query(
      ref,
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT),
    )

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setIsLoding(false);

    // check if the post reaches the end of the page
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    // <div className={styles.container}>
    //   {/* <Link
    //     prefetch={true}
    //     href={{
    //       pathname: '/[username]',
    //       query: { username: 'spero61' },
    //     }}
    //   >
    //   </Link> */}
    //   <button className="text-slate-200 text-lg font-bold bg-pink-600 rounded-full px-3 py-2" onClick={notify}>Make me a toast</button>
    //   <Loader isisLoding={true} ></Loader>
    // </div>
    <main>

    {/* post preview as a card */}
    <PostFeed posts={posts} />

    {/* loading more posts */}
    <div className="flex justify-center my-4">
      {!isLoding && !postsEnd && <button className="text-stone-100 bg-rose-400 hover:bg-rose-500 rounded-full font-bold text-xs px-2 py-2.5 py-2 mx-1 md:text-sm md:px-5 md:py-2.5 md:mx-3" onClick={getMorePosts} type="button">Load more</button>}
      <Loader isLoading={isLoding} />  
      <p className="text-slate-600 font-bold text-xs md:text-sm">{postsEnd && 'There is no more post!'}</p>
    </div>

  </main>
  );
}
