import Moralis from 'moralis';
import { useRouter } from 'next/router';
import React, {useEffect, useState} from 'react'
import { useMoralis } from 'react-moralis'
import Web3 from 'web3';
import { contractABI, contractAddress } from '../../contract';
const web3=new Web3(Web3.givenProvider);

const Dashboard = () => {
    const {isAuthenticated, logout, user} =useMoralis();
    const router=useRouter();
    const [name, setName]=useState("");
    const [description, setDescription]=useState("");
    const [file, setFile]=useState(null);

    useEffect(() => {
      if(!isAuthenticated) router.push('/');
    }, [isAuthenticated])

    const onSubmit=async (e)=>{
        e.preventDefault();
        try {
            // Save image to IPFS
            const file1=new Moralis.File(file.name, file)
            await file1.saveIPFS()
            const file1url=file1.ipfs();

            // generate metadata and save to IPFS
            const metadata={
                name, description, image: file1url,
            };
            const file2=new Moralis.File(`${name}metadata.json`, {
                base64: Buffer.from(JSON.stringify(metadata)).toString('base64')
            });
            await file2.saveIPFS();
            const metadataurl=file2.ipfs();
            // interact with smart contract
            const contract=new web3.eth.Contract(contractABI, contractAddress);
            const response=await contract.methods.mint(metadataurl).send({from: user.get("ethAddress")});
            const tokenId=response.events.Transfer.returnValues.tokenId;

            alert(`NFT successfully minted. Contract Address - ${contractAddress} and Token ID - ${tokenId}`);

        } catch (error) {
            console.error(error)
            alert("Something went wrong!")
        }
    }
    
  return (
    <div className='flex w-screen h-screen items-center justify-center'>
        <form onSubmit={onSubmit}>
            <div>
                <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder='Name' className='border-[1px] p-2 text-lg border-black w-full' />
            </div>
            <div className='mt-3'>
                <input value={description} onChange={e=>setDescription(e.target.value)} type="text" placeholder='Description' className='border-[1px] p-2 text-lg border-black w-full' />
            </div>
            <div className='mt-3'>
                <input onChange={e=>setFile(e.target.files[0])} type="file" className='border-[1px] p-2 text-lg border-black w-full' />
            </div>
            <button type="submit" className='mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-xl animate-pulse'>Mint Now!</button>
            <button onClick={logout} className="mt-5 w-full p-5 bg-red-700 text-white text-lg rounded-xl">Logout</button>
        </form>
    </div>
  )
}

export default Dashboard