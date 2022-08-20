import { FC } from 'react'
import { EventInfo } from '../utils/types'
import Event from './Event'

const Events: FC<{ events: EventInfo[]; getRepoNameFromId: (id: number) => string }> = ({ events, getRepoNameFromId }) => {
  const latestEvents = events.slice(0, 50)
  return (
    <div>
      {latestEvents.map((ev, i) => {
        return (
          <div key={i}>
            <Event ev={ev} getRepoNameFromId={getRepoNameFromId} />
          </div>
        )
      })}
    </div>
  )
}

export default Events
