// custom react hooks
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// to read auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // when user is null, (=user is signed-out)
    // turn off the realtime data fatching from the firestore
    let unsubscribe;

    if (user) {
      // const ref = db.collection('users').doc(user.uid);
      const ref = doc(getFirestore(), 'users', user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}