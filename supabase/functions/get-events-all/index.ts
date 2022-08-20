// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { octokit, supabaseClient } from '../_shared/clients.ts'
import { getData, Event, getDataStale } from '../_shared/event-utils.ts'

serve(async (req) => {
  const { ignore_old }: { ignore_old: boolean } = await req.json()
  // Fetch repo names from supabase
  const resp = await supabaseClient.from('repo').select('name')
  const respData = resp.data
  if (respData === null) {
    return new Response('Supabase returned empty')
  }

  const promises: Promise<Event[]>[] = []

  for (const repo of resp.data) {
    const [owner, repo_name] = repo.name.split('/')
    if (ignore_old === true) {
      promises.push(getData(owner, repo_name, true))
    } else {
      promises.push(getData(owner, repo_name))
    }
  }

  const eventData = await Promise.all(promises)
  let events: Event[] = []
  for (const arr of eventData) {
    events = [...events, ...arr]
  }
  const { data, error } = await supabaseClient.from('event').upsert(events)

  // const { data, error } = await supabaseClient.from('event').upsert(rows)
  if (error != null) {
    return new Response(JSON.stringify(error), { headers: { 'Content-Type': 'application/json' } })
  }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})
