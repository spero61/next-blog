import Link from 'next/link';
import Image from 'next/image';
import blogLogo from '../public/blog-logo.svg';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebaseConfig';
import { signOut } from 'firebase/auth';

// FAQ: https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
  };

  return (
    <nav className="bg-white border-gray-200 px-3 py-3 md:px-4 py-3 sticky">
      <div className="flex flex-wrap justify-between items-center">
        <span className="hover:cursor-pointer">
          <Link href="/">
            <a>
              <Image src={blogLogo} width={126} height={36} alt="Blog Logo" />
            </a>
          </Link>
        </span>

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
              <button className="text-stone-100 bg-orange-500 hover:bg-orange-700 rounded-full font-medium text-xs px-2 py-2.5 py-2 mx-1 md:text-base md:px-5 md:py-2.5 md:mx-3">
                Write Posts
              </button>
            </Link>
            <span className="hover:cursor-pointer">
              <Link href={`/${username}`}>
                <a>
                  <img src={user?.photoURL || '/default_avatar.png'} className="rounded-full" width="45px" height="45px" alt="User's Google Profile Picture" />
                  {/* I used img tag instead, not sure if there is another domain other than lh3.googleusercontent.com */}
                  {/* at least I added that domain in next.config.js file so commented out Image tag also works at the moment */}
                  {/* <Image src={user?.photoURL || '/default_avatar.png'} width={45} height={45} alt="User Profile Photo"/> */}
                </a>
              </Link>
            </span>
          </div>
        )}

        {/* the user is "not signed-in" || "does not have username" yet */}
        {!username && (
          <Link href="/enter">
            <button
              type="button"
              className="text-stone-100 bg-orange-500 hover:bg-orange-800 rounded-full font-medium text-xs px-2 py-2.5 py-2 mx-1 md:text-base md:px-7 md:py-2.5 md:mx-3"
            >
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
