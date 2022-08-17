import { FC } from 'react'
import { EventInfo } from '../utils/types'
import Event from './Event'

const Events: FC<{ events: EventInfo[] }> = ({ events }) => {
  return (
    <div>
      {events.map((ev, i) => {
        return (
          <div key={i}>
            <Event ev={ev} />
          </div>
        )
      })}
    </div>
  )
}

export default Events
