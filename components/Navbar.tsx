import Image from 'next/image'
import { FC } from 'react'

const Navbar: FC = () => {
  return (
    <nav className="bg-zinc-900 flex justify-center mb-10">
      <div className="w-full 2xl:w-5/6 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="logo" width="50px" height="50px" />
          <p className="hidden md:block ml-2 pt-1 text-2xl font-bold">Repo Watch</p>
        </div>

        <div>
          <button className="mr-5 hover:text-green-600">Home</button>
          <button className="mr-5 hover:text-green-600">Repositories</button>
        </div>
        <div></div>
      </div>
    </nav>
  )
}

export default Navbar
