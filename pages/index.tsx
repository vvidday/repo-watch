import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useReducer, useState } from 'react'
import Events from '../components/Events'
import { supabase } from '../utils/supabaseClient'
import { EventInfo, Filter, FilterAct, FilterAction, FilterType, RealtimeEventPayload, RepoMap } from '../utils/types'
import { ParsedUrlQuery } from 'querystring'
import Navbar from '../components/Navbar'
import FilterReducer from '../utils/FilterReducer'
import FilterComp from '../components/Filter'
import { retrieveFilterFromStorage } from '../utils/localStorage'
import Repositories from '../components/Repositories'
import { HeartFillIcon } from '@primer/octicons-react'

type Props = {
  eventsList: EventInfo[]
  //eventsByRepo: EventsByRepo
  repoMap: RepoMap
}

type Repo = {
  id: number
  name: string
}

type EventsByRepo = {
  [id: number]: EventInfo[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const repoMap: RepoMap = {}
  let events: EventInfo[] = []
  //const eventsByRepo: EventsByRepo = {}

  const { data, error } = await supabase.from<Repo>('active_repos_view').select()
  if (data === null) return { props: { eventsList: events, repoMap } }

  // Build map
  for (const row of data) {
    repoMap[row.id.toString()] = row.name
  }

  // Get latest 300 events
  const response = await supabase
    .from<EventInfo>('event')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (response.error != null) {
    return { props: { eventsList: events, repoMap } }
  }

  // // Fetch event data
  // const promises: Promise<EventInfo[] | null>[] = []
  // for (const repo of data) {
  //   promises.push(getLatestEvents(repo.id))
  // }

  // // Build event lists
  // const eventData = await Promise.all(promises)
  // for (const arr of eventData) {
  //   if (arr !== null) {
  //     events = [...events, ...arr]
  //     const repo_id = arr[0].repo_id
  //     eventsByRepo[repo_id] = arr
  //   }
  // }
  // const x = new Date(events[0].created_at)
  // // Sort eventsList by date
  // events.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
  return { props: { eventsList: response.data, repoMap } }
}

const getLatestEvents = async (repo_id: number): Promise<EventInfo[] | null> => {
  const { data, error } = await supabase.from<EventInfo>('event').select('*').eq('repo_id', repo_id).limit(30)
  if (error !== null) {
    console.log(error)
    return null
  }
  if (data === null) return null
  return data
}

const Home: NextPage<Props> = ({ eventsList, repoMap }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // subscribe to inserts in event table
  const [events, setEvents] = useState<EventInfo[]>([...eventsList])
  //const [eventsRepo, setEventsRepo] = useState<EventsByRepo>(eventsByRepo)
  const [filter, changeFilter] = useReducer(FilterReducer, {
    exclude_name: new Set<string>(),
    include_only_name: new Set<string>(),
    exclude_event_type: new Set<string>(),
    exclude_repo: new Set<string>(),
  })
  const [page, setPage] = useState(0)
  // Use in repo page
  const [currentRepoId, setCurrentRepoId] = useState(events[0].repo_id.toString())

  useEffect(() => {
    subscribeToEvents()
    // Retrieve from local storage & set filter
    changeFilter({
      type: FilterType.SET,
      action: FilterAct.ADD,
      payload: [],
      filter: retrieveFilterFromStorage(),
    })
    return () => {
      supabase.removeAllSubscriptions()
    }
  }, [])

  const subscribeToEvents = () => {
    const channel = supabase
      .from('event')
      .on('INSERT', (payload) => {
        console.log('changed received', payload)
        setEvents((events) => [{ ...payload.new, new: true }, ...events])
      })
      //.channel('public:event')
      // .on('postgres_changes', { event: '*', schema: '*' }, (payload: any) => {
      //   //.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event' }, (payload: RealtimeEventPayload) => {
      //   console.log('change received', payload)
      //   // Update events
      //   setEvents((events) => [payload.new, ...events])
      // })
      .subscribe()
  }

  const getRepoNameFromId = (id: number) => {
    return repoMap[id]
  }

  let main: JSX.Element = <></>
  if (page === 0) {
    main = (
      <>
        {' '}
        <FilterComp filter={filter} changeFilter={changeFilter} repoMap={repoMap} />
        <Events events={events} getRepoNameFromId={getRepoNameFromId} filter={filter} setEvents={setEvents} />
      </>
    )
  } else if (page === 1) {
    main = (
      <Repositories
        repoMap={repoMap}
        events={events}
        setEvents={setEvents}
        currentRepoId={currentRepoId}
        setCurrentRepoId={setCurrentRepoId}
      />
    )
  }

  return (
    <div className="bg-white dark:bg-black dark:text-white">
      <Head>
        <title>Repo Watch</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Navbar page={page} setPage={setPage} />
      <main className="pt-20">{main}</main>
      <footer>
        <p className="text-center">
          Made with <HeartFillIcon fill="red" /> by{' '}
          <a className="hover:text-green-600" href="https://github.com/vvidday" target="_blank" rel="noreferrer">
            vvidday
          </a>
        </p>
      </footer>
    </div>
  )
}

export default Home
