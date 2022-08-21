import { FC, Dispatch, useMemo, SetStateAction, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { EventInfo } from '../utils/types'
import Event from './Event'
import Loading from './Loading'

const Repository: FC<{
  repo_id: string
  events: EventInfo[]
  setEvents: Dispatch<SetStateAction<EventInfo[]>>
  getRepoNameFromId: (id: number) => string
}> = ({ repo_id, events, setEvents, getRepoNameFromId }) => {
  // const currentEvents = useMemo(() => {
  //   const result: EventInfo[] = []
  //   for (const event of events) {
  //     if (event.repo_id.toString() === repo_id) result.push(event)
  //   }
  //   return result
  // }, [events])

  const setEventAsOld = (event_id: number) => {
    setEvents((events) => {
      const newEvents = [...events]
      for (const event of newEvents) {
        if (event.id === event_id) {
          event.new = false
        }
      }
      return newEvents
    })
  }

  const [eventData, setEventData] = useState<EventInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from<EventInfo>('event')
        .select('*')
        .eq('repo_id', parseInt(repo_id))
        .order('created_at', { ascending: false })
        .limit(50)
      if (error !== null) throw error
      setEventData(data)
    }
    fetch()
    setLoading(false)
  }, [repo_id])

  useEffect(() => {
    // Update on new events (realtime)
    if (eventData.length === 0) return
    for (const event of events) {
      if (event.repo_id.toString() !== repo_id) continue
      if (event.id === eventData[0].id) break
      setEventData((eventData) => [event, ...eventData])
    }
  }, [events])

  // const info = useQuery(
  //   ['repoEvents'],
  //   async () => {
  //     const { data, error } = await supabase
  //       .from<EventInfo>('event')
  //       .select('*')
  //       .eq('repo_id', parseInt(repo_id))
  //       .order('created_at', { ascending: false })
  //       .limit(50)
  //     if (error !== null) throw error
  //     return data
  //   },
  //   {
  //     placeholderData: currentEvents,
  //   }
  // )

  return (
    <div>
      <div className="flex justify-center text-2xl">
        <a
          href={`https://github.com/${getRepoNameFromId(parseInt(repo_id))}`}
          target="_blank"
          rel="noreferrer"
          className=" hover:text-green-700"
        >
          {getRepoNameFromId(parseInt(repo_id))}
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {' '}
          {eventData.map((event, i) => {
            return (
              <div key={i}>
                <Event ev={event} setEventAsOld={setEventAsOld} getRepoNameFromId={getRepoNameFromId} />
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default Repository
