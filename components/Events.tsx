import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { EventInfo, Filter } from '../utils/types'
import Event from './Event'

const filterEvent = (event: EventInfo, filter: Filter): boolean => {
  if (filter.include_only_name.size > 0 && !filter.include_only_name.has(event.actor_username)) {
    return false
  }
  const excludedUsername = filter.exclude_name.has(event.actor_username)
  const excludedEventType = filter.exclude_event_type.has(event.type)
  const excludedRepo = filter.exclude_repo.has(event.repo_id.toString())
  return !excludedUsername && !excludedEventType && !excludedRepo
}

const getFilteredEvents = (events: EventInfo[], filter: Filter, limit: number) => {
  const result: EventInfo[] = []
  for (const event of events) {
    if (filterEvent(event, filter)) {
      result.push(event)
      if (result.length >= limit) break
    }
  }
  return result
}

const Events: FC<{
  events: EventInfo[]
  getRepoNameFromId: (id: number) => string
  filter: Filter
  setEvents: Dispatch<SetStateAction<EventInfo[]>>
}> = ({ events, getRepoNameFromId, filter, setEvents }) => {
  const latestEvents = useMemo(() => getFilteredEvents(events, filter, 100), [events, filter])
  const setEventAsOld = (pos: number) => {
    setEvents((events) => {
      const newEvents = [...events]
      newEvents[pos].new = false
      return newEvents
      // const eventToChange = events[pos]
      // eventToChange.new = false
      // return [...events.splice(0, pos), eventToChange, ...events.splice(pos + 1)]
    })
  }
  return (
    <div>
      {latestEvents.map((ev, i) => {
        return (
          <div key={i}>
            <Event ev={ev} getRepoNameFromId={getRepoNameFromId} pos={i} setEventAsOld={setEventAsOld} />
          </div>
        )
      })}
    </div>
  )
}

export default Events
