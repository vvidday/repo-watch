import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Events from '../components/Events'
import { supabase } from '../utils/supabaseClient'
import { EventInfo, RealtimeEventPayload } from '../utils/types'
import { ParsedUrlQuery } from 'querystring'
import Navbar from '../components/Navbar'

type Props = {
  eventsList: EventInfo[]
  //eventsByRepo: EventsByRepo
  repoMap: RepoMap
}

type Repo = {
  id: number
  name: string
}

type RepoMap = {
  [id: number]: string
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
    repoMap[row.id] = row.name
  }

  // Get latest 300 events
  const response = await supabase.from<EventInfo>('event').select('*').order('created_at', { ascending: false }).limit(200)
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

  useEffect(() => {
    subscribeToEvents()
    return () => {
      supabase.removeAllSubscriptions()
    }
  }, [])

  const subscribeToEvents = () => {
    const channel = supabase
      .from('event')
      .on('INSERT', (payload) => {
        console.log('changed received', payload)
        setEvents((events) => [payload.new, ...events])
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

  return (
    <div>
      <Head>
        <title>Repo Watch</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Navbar />
      <main>
        <Events events={events} getRepoNameFromId={getRepoNameFromId} />
      </main>
    </div>
  )
}

export default Home
