import Image from 'next/image'
import { FC, ReactNode } from 'react'
import { getIconFromType, getSummaryFromEvent } from '../utils/helpers'
import { EventInfo } from '../utils/types'

const Event: FC<{
  ev: EventInfo
}> = ({ ev }) => {
  const icon = getIconFromType(ev.type, ev.action ?? '')
  const summary = getSummaryFromEvent(ev)

  return (
    <div>
      <div>
        {icon}
        {summary}
      </div>
    </div>
  )
}

export default Event
