import Image from 'next/image'
import { FC, ReactNode } from 'react'
import { EventInfo } from '../utils/types'

const Event: FC<{
  ev: EventInfo
}> = ({ ev }) => {
  return (
    <div>
      <div>
        <Image src={`https://avatars.githubusercontent.com/u/${ev.actor_id}`} width="100px" height="100px" />
        {ev.type}
        {ev.actor_username}
        {ev.summary}
        {ev.created_at}
        <a href={ev.url ?? ''}>Github link</a>
      </div>
    </div>
  )
}

export default Event
