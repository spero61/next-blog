import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// children of this AuthCheck component are displayed only to signed-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  // if the current user has username (this also means the user is alearly signed-in)
  // render props.children
  // else
  // render fallback component or Link back to the sign-in page(default)
  return username ? 
            props.children : 
            props.fallback || <Link href="/enter">You must be signed-in!</Link>;
}