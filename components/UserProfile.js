import Metatags from '../components/Metatags';

export default function UserProfile({ user }) {
  return (
    <div className="flex flex-col flex-center items-center mt-4 md:mt-7">
      <Metatags title="User Profile Page" />
      <img src={user?.photoURL || '/default_avatar.png'} className="bg-slate-50 p-1 w-20 rounded-full" alt="User Google Profile Picture - Large"/>
      <h3 className="text-slate-800 text-md font-medium italic mt-2 md:text-lg md:mt-4">
        @{user?.username}
      </h3>
      <h2 className="text-gray-600 text-lg font-bold my-1 md:text-2xl md:my-2">
        {user?.displayName || '匿名さん'}
      </h2>
    </div>
  );
}
