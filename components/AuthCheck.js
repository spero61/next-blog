import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// children of this AuthCheck component are displayed only to signed-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);
  
  return username ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>;
}