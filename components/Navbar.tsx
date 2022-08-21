import Image from 'next/image'
import { FC } from 'react'

const Navbar: FC = () => {
  return (
    <nav className="bg-black fixed top-0 w-full h-14 z-10 flex items-center justify-center">
      <div className="absolute left-0 2xl:left-[8.33333%] flex items-center">
        <Image src="/logo.png" alt="logo" width="50px" height="50px" />
        <p className="hidden md:block ml-2 pt-1 text-2xl font-bold">Repo Watch</p>
      </div>
      <div className="">
        <button className="mr-2 sm:mr-8 hover:text-green-600 text-xl">Home</button>
        <button className="ml-2 sm:ml-8 hover:text-green-600 text-xl">Repositories</button>
      </div>
    </nav>
  )
}

export default Navbar
