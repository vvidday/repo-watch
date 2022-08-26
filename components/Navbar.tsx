import { MoonIcon, SunIcon } from '@primer/octicons-react'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

const Navbar: FC<{ page: number; setPage: Dispatch<SetStateAction<number>> }> = ({ page, setPage }) => {
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      toDarkMode()
    } else {
      toLightMode()
    }
  }, [])

  const toDarkMode = () => {
    document.documentElement.classList.add('dark')
    document.documentElement.style.backgroundColor = 'black'
    localStorage.theme = 'dark'
    setDarkMode(true)
  }

  const toLightMode = () => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.backgroundColor = 'white'
    localStorage.theme = 'light'
    setDarkMode(false)
  }

  return (
    <nav className="bg-white dark:bg-black fixed top-0 w-full h-14 z-10 flex items-center justify-center">
      <div className="absolute left-0 2xl:left-[8.33333%] flex items-center">
        <Image src="/logo.png" alt="logo" width="50px" height="50px" />
        <p className="hidden md:block ml-2 pt-1 text-2xl font-bold">Repo Watch</p>
      </div>
      <div className="">
        <button
          className="mr-2 sm:mr-8 hover:text-green-600 text-xl"
          onClick={() => {
            if (page !== 0) setPage(0)
          }}
        >
          Home
        </button>
        <button
          className="ml-2 sm:ml-8 hover:text-green-600 text-xl"
          onClick={() => {
            if (page !== 1) setPage(1)
          }}
        >
          Repositories
        </button>
      </div>
      <div className="absolute right-0 2xl:right-[8.33333%]">
        <button
          className="mr-5 2xl:mr-0 rounded-full p-1 hover:bg-neutral-200 dark:hover:bg-stone-800"
          onClick={() => {
            if (darkMode) toLightMode()
            else toDarkMode()
          }}
        >
          {darkMode ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
