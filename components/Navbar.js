import Link from 'next/link';
import Image from 'next/image';
import blogLogo from '../public/blog-logo.svg';
import { useRouter } from 'next/router';
// import { useContext } from 'react';
// import { UserContext } from '@lib/context';
// import { auth } from '@lib/firebase';
import { signOut } from 'firebase/auth';

// Top navbar
export default function Navbar() {
  //   const { user, username } = useContext(UserContext);

  const username = null;
  const user = null;

  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
  };

  return (
    <nav className="bg-white border-gray-200 px-3 py-3 md:px-4 py-3 sticky">
      <div className="flex flex-wrap justify-between items-center">
          <Link href="/">
            <Image id="blog-logo" src={blogLogo} width={126} height={36} alt="Blog Logo" />
          </Link>
        {/* <a href="https://flowbite.com/" className="flex items-center">
      <img src="/docs/images/logo.svg" className="mr-3 h-6 md:h-9" alt="Flowbite Logo" />
      <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
      </a> */}
        {/* <li>
          <Link href="/">
            <Image src={blogLogo} alt="Blog Logo"></Image>
          </Link>
        </li> */}

        {/* the user is successfully "signed-in" and has "username" */}
        {username && (
          <div className="flex items-center">
            <button
              className="text-stone-800 hover:text-stone-100 bg-slate-200 hover:bg-slate-400 rounded-full font-medium text-xs px-2 py-2.5 py-2 mx-1 md:text-base md:px-5 md:py-2.5 md:mx-3"
              onClick={signOutNow}
            >
              Sign Out
            </button>

            <Link href="/admin">
              <button className="text-stone-100 bg-fuchsia-500 hover:bg-fuchsia-800 rounded-full font-medium text-xs px-2 py-2.5 py-2 mx-1 md:text-base md:px-5 md:py-2.5 md:mx-3">
                Write Posts
              </button>
            </Link>
            <Link href={`/${username}`}>
              <Image
                src={user?.photoURL || '/default_avatar.png'}
                width={45}
                height={45}
                alt="User Profile Photo"
              />
            </Link>
          </div>
        )}

        {/* the user is "not signed-in" || "does not have username" yet */}
        {!username && (
              <Link href="/enter">
                <button type="button" className="text-stone-100 bg-fuchsia-500 hover:bg-fuchsia-800 rounded-full font-medium text-xs px-2 py-2.5 py-2 mx-1 md:text-base md:px-7 md:py-2.5 md:mx-3">Login</button>
              </Link>
          )}
      </div>
    </nav>
  );
}
