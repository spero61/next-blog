// import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebaseConfig';
import Loader from '../components/Loader';

export default function Home() {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <div className={styles.container}>
      {/* <Link
        prefetch={true}
        href={{
          pathname: '/[username]',
          query: { username: 'spero61' },
        }}
      >
        <Image
          width="191px"
          height="46px"
          // https://developers.google.com/identity/branding-guidelines
          src="/btn_google_signin_light_normal_web@2x.png"
          alt="Sign in with Google"
          // onClick={() => signInWithGoogle('', { prompt: 'select_account' })}
        />
      </Link> */}
      <h1 className="text-2xl font-bold underline">
      Hello world!
    </h1>
      <Loader isLoading={true} ></Loader>
    </div>
  );
}
