import Image from 'next/image';
import { auth, Debug, googleAuthProvider } from '../lib/firebaseConfig';
import { doc, writeBatch, getDoc, getFirestore, /* serverTimestamp */ } from 'firebase/firestore';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { UserContext } from '../lib/context';
import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import Metatags from '../components/Metatags';

export default function EnterPage(props) {
  const { user, username } = useContext(UserContext);

  // https://reactjs.org/docs/conditional-rendering.html#inline-if-else-with-conditional-operator
  // 1) user is signed-out => render <SignInButton />
  // 2-1) user is signed-in, does not set username yet => render <UsernameForm />
  // 2-2) user is signed-in, already has username => render <SignOutButton />

  return (
    <main>
      <Metatags title="enter page" description="handling user sign-in and setting username" />
      {!user ?
        <SignInButton /> : !username ?
          <UsernameForm /> : <GoToIndexPage />
      }
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <>
      <section className="flex flex-col items-center mt-20 md:mt-48">
        <div className="w-80 hover:cursor-pointer">
          <Image
            width="382px"
            height="92px"
            // https://developers.google.com/identity/branding-guidelines
            src="/btn_google_signin_light_normal_web@2x.png"
            alt="Sign in with Google"
            onClick={signInWithGoogle}
          />
        </div>

        {/* Sign in Anonymously => firebase Sign-in providers => Anonymous: Enabled is required */}
        <div className="w-80 hover:cursor-pointer">
          <Image
            width="380px"
            height="90px"
            src="/sign-in-anonymously.png"
            alt="Sign in with Google"
            onClick={() => signInAnonymously(auth)}
          />
        </div>
      </section>
    </>
  );
}

// a component for naively redirect to the main page
// used onClick={router.push('/')} instead of onClick={() => router.push('/')}
// so that next router to redirect to the index page
// as soon as this button component is mounted(rendered) by react
// * can be improved, will try later on *
function GoToIndexPage() {
  const router = useRouter();

  return(
      <button type="hidden" onClick={router.push('/')}></button>
  )
}

// // Sign out button
// function SignOutButton() {
//   return (
//     <button
//       className="text-stone-800 hover:text-stone-100 bg-teal-400 hover:bg-teal-600 px-3 py-2 rounded-full"
//       onClick={() => signOut(auth)}
//     >
//       Sign Out
//     </button>
//   );
// }

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoding, setIsLoding] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // create refs for both documents
    const userDoc = doc(getFirestore(), 'users', user.uid);
    const usernameDoc = doc(getFirestore(), 'usernames', formValue);

    // commit both docs together as a batch write.
    const batch = writeBatch(getFirestore());
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
      // timestamp: serverTimestamp(),
    });
    batch.set(usernameDoc, {
      uid: user.uid,
      // timestamp: serverTimestamp(),
    });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const currentFormValue = e.target.value.toLowerCase();

    // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username

    // this regex means:
    // username is 3-12 characters long, no _ or . at the beginning as well as at the end
    // [a-zA-Z0-9._] are allowed characters
    // no __ or _. or ._ or .. inside, and
    const regex = /^(?=[a-zA-Z0-9._]{3,17}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (currentFormValue.length < 3) {
      setFormValue(currentFormValue);
      setIsLoding(false);
      setIsValid(false);
    }

    // regExp.prototype.test(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
    // if passes regex test
    if (regex.test(currentFormValue)) {
      setFormValue(currentFormValue);
      setIsLoding(true); // asynchronous checking for the username in the firestore
      setIsValid(false);
    }
  };

  // lodash.debounce(): https://lodash.com/docs#debounce
  // a debounced function that delays invoking func until after wait milliseconds have elapsed
  // since the last time the debounced function was invoked.

  // useCallback API: https://reactjs.org/docs/hooks-reference.html#usecallback
  // it returns a memoized callback.
  // wrapping this debounced function with useCallback is required
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), 'usernames', username);
        const snap = await getDoc(ref);
        console.log('Firestore read executed!', snap.exists());
        setIsValid(!snap.exists()); // if the username typed is exist, it is NOT valid
        setIsLoding(false);
      }
    }, 500),
    []
  );

  // check username when the formValue has changed
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  return (
    !username && (
      <section className="flex flex-col items-center mt-20 md:mt-48">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={onSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-lg font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight text-xl focus:outline-none focus:shadow-outline"
              name="username"
              type="text"
              placeholder="type here..."
              value={formValue}
              onChange={onChange}
              autoComplete="off"
              autoFocus
            />
          </div>

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            isLoding={isLoding}
          />

          <div className="flex items-center justify-center my-2">
            {/* this is a client side validation so malicious user might use username though it is not allowed */}
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline disabled:bg-slate-300"
              type="submit"
              disabled={!isValid}
            >
              Submit
            </button>
          </div>

          {/* for debugging */}
          {/* <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {isLoding.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div> */}

        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, isLoding }) {
  if (isLoding) {
    return <p className="text-lg text-gray-700 text-bold">Checking...</p>;
  } else if (isValid) {
    return <p className="text-lg text-green-600 text-bold">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-lg text-rose-600 text-bold">Choose another username!</p>;
  } else {
    return <p></p>;
  }
}
