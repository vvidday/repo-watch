import Image from 'next/image'
import { FC, ReactNode } from 'react'

const Event: FC<{
  id: number
  username: string
  summary: string
  ChildComp: JSX.Element
}> = ({ id, username, summary, ChildComp }) => {
  return (
    <div>
      <div>
        <Image src={`https://avatars.githubusercontent.com/u/${id}`} width="100px" height="100px" />
        {username}
        {summary}
      </div>
      {ChildComp}
    </div>
  )
}

export default Event
