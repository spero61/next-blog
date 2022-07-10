import { db, auth } from '../lib/firebaseConfig';
import { useDocument } from 'react-firebase-hooks/firestore';
import { increment, writeBatch, doc, getFirestore } from "firebase/firestore";


// Allows user to star or like a post
export default function StarCounter({ postRef }) {
  // Listen to star document for currently logged in user
  const starRef = doc(getFirestore(), postRef.path, 'stars', auth.currentUser.uid);
  const [starDoc] = useDocument(starRef);

  // Create a user-to-post relationship
  const addStar = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { starCount: increment(1) });
    batch.set(starRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeStar = async () => {
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { starCount: increment(-1) });
    batch.delete(starRef);

    await batch.commit();
  };

  return starDoc?.exists() ? (
    <button className="text-sm text-slate-600 bg-stone-100 mr-3 rounded-lg px-2" onClick={removeStar}>🌠 Unstar</button>
  ) : (
    <button className="text-sm text-slate-600 bg-orange-100 mr-3 rounded-lg px-2" onClick={addStar}>✨ Add Star</button>
  );
}