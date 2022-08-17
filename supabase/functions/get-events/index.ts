// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { Octokit } from 'https://cdn.skypack.dev/octokit?dts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@1.33.2'

interface Event {
  id: number
  created_at: string
  repo_id: number
  actor_id: number
  actor_username: string
  type: string
  url: string
  summary: string
}

const eventTypes = new Set<string>([
  'CommitCommentEvent',
  'CreateEvent',
  'DeleteEvent',
  //'ForkEvent',
  //'GollumEvent',
  'IssueCommentEvent',
  'IssuesEvent',
  //'MemberEvent',
  //'PublicEvent',
  'PullRequestEvent',
  'PullRequestReviewEvent',
  'PullRequestReviewCommentEvent',
  'PullRequestReviewThreadEvent',
  'PushEvent',
  //'ReleaseEvent',
  //'SponsorshipEvent',
  //'WatchEvent',
])

serve(async (req) => {
  const { name } = await req.json()
  const githubKey = Deno.env.get('GITHUB_KEY')
  const octokit = new Octokit({ auth: githubKey })
  const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SECRET_KEY') ?? '')

  const res = await octokit.request('GET /repos/{owner}/{repo}/events', {
    owner: 'supabase',
    repo: 'supabase',
  })

  let rows: Event[] = []

  for (const event of res.data) {
    if (event.type === null || !eventTypes.has(event.type)) {
      continue
    }
    let url: string = ''
    let summary: string = ''
    switch (event.type) {
      case 'CommitCommentEvent':
        ;[url, summary] = parseCommitCommentEvent(event)
        break
      case 'CreateEvent':
        ;[url, summary] = parseCreateEvent(event)
        break
      case 'DeleteEvent':
        ;[url, summary] = parseDeleteEvent(event)
        break
      case 'IssueCommentEvent':
        ;[url, summary] = parseIssueCommentEvent(event)
        break
      case 'IssuesEvent':
        ;[url, summary] = parseIssuesEvent(event)
        break
      case 'PullRequestEvent':
        ;[url, summary] = parsePullRequestEvent(event)
        break
      case 'PullRequestReviewEvent':
        ;[url, summary] = parsePullRequestReviewEvent(event)
        break
      case 'PullRequestReviewCommentEvent':
        ;[url, summary] = parsePullRequestReviewCommentEvent(event)
        break
      case 'PullRequestReviewThreadEvent':
        ;[url, summary] = parsePullRequestReviewThreadEvent(event)
        break
      case 'PushEvent':
        ;[url, summary] = parsePushEvent(event)
        break
    }
    const row: Event = {
      id: event.id,
      created_at: event.created_at,
      repo_id: event.repo.id,
      actor_id: event.actor.id,
      actor_username: event.actor.login,
      type: event.type,
      url: url,
      summary: summary,
    }
    rows.push(row)
  }
  const { data, error } = await supabaseClient.from('event').upsert(rows)
  if (error != null) {
    return new Response(JSON.stringify(error), { headers: { 'Content-Type': 'application/json' } })
  }
  return new Response('Success', { headers: { 'Content-Type': 'application/json' } })
})

const parseCommitCommentEvent = (event: any): [url: string, summary: string] => {
  return [event.payload.comment.html_url, event.payload.comment.body]
}

const parseCreateEvent = (event: any): [url: string, summary: string] => {
  return [`https://github.com/${event.repo.name}/tree/${event.payload.ref}`, event.payload.ref_type]
}

const parseDeleteEvent = (event: any): [url: string, summary: string] => {
  return [`https://github.com/${event.repo.name}`, event.payload.ref_type]
}

const parseIssueCommentEvent = (event: any): [url: string, summary: string] => {
  return [event.payload.comment.html_url, event.payload.action]
}

const parseIssuesEvent = (event: any): [url: string, summary: string] => {
  return [event.payload.issue.html_url, event.payload.action]
}

const parsePullRequestEvent = (event: any): [url: string, summary: string] => {
  return [event.payload.pull_request.html_url, event.payload.action]
}

const parsePullRequestReviewEvent = (event: any): [url: string, summary: string] => {
  return [event.payload.review.html_url, event.payload.action]
}

const parsePullRequestReviewCommentEvent = (event: any): [url: string, summary: string] => {
  return [event.payload.comment.html_url, event.payload.action]
}

const parsePullRequestReviewThreadEvent = (event: any): [url: string, summary: string] => {
  return [event.payload.thread.url, event.payload.action]
}

const parsePushEvent = (event: any): [url: string, summary: string] => {
  return [`https://github.com/${event.repo.name}/commit/${event.payload.head}`, event.payload.distinct_size]
}
