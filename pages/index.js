import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMoralis } from 'react-moralis'

const Home = () => {
  const {authenticate, isAuthenticated}=useMoralis();
  const router=useRouter();

  useEffect(() => {
    if(isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated])
  
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Head>
        <title>NFT Minter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={authenticate} className='bg-yellow-300 px-8 py-5 rounded-xl text-lg animate-pulse'>Login Using MetaMask</button>
    </div>
  )
}

export default Home
