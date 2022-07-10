import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { auth } from '../lib/firebaseConfig';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const notify = () => toast.success('Here is your toast.');

export default function Home() {

  return (
    <div className={styles.container}>
      {/* <Link
        prefetch={true}
        href={{
          pathname: '/[username]',
          query: { username: 'spero61' },
        }}
      >
      </Link> */}
      <button className="text-slate-200 text-lg font-bold bg-pink-600 rounded-full px-3 py-2" onClick={notify}>Make me a toast</button>
      <Loader isLoading={true} ></Loader>
    </div>
  );
}
