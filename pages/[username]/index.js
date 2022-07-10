import { getUserWithUsername, postToJSON, db } from '../../lib/firebaseConfig';
import { query, collection, where, getDocs, limit, orderBy, getFirestore } from 'firebase/firestore';
import PostFeed from '../../components/PostFeed';
import UserProfile from '../../components/UserProfile';

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery;

  // fetch userDoc based on the username
  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON data, to be converted into string later
  // to do that, converts firestore's timestamp to string or number using postToJSON()
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}