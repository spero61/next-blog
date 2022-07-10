import Link from 'next/link';
import Image from 'next/image';
import notFoundImg from '../public/romson-preechawit-Vy2cHqm0mCs-unsplash.jpg'

export default function Custom404Page() {
    return (
        <main className="flex flex-col items-center mt-5 max-w-xs mx-auto md:max-w-2xl">
            
            <h1 className="text-slate-600 text-lg font-bold md:text-3xl my-4">Page Not Found!</h1>
            
            <div className="hover:cursor-pointer hover:opacity-75">
              <Link href="/">
                <Image src={notFoundImg} width={400} height={300} alt="page not found photo"></Image>
              </Link>
            </div>

            <Link href="/">
              <button className="text-sm text-stone-100 bg-rose-400 rounded-full px-4 py-1.5 my-4 md:text-base hover:bg-rose-500">Back to Home</button>
            </Link>
        </main>
    )
}