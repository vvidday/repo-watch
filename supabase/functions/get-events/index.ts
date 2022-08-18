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
  action: string | null
  number: number | null
  title: string | null
  body: string | null
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
    const row: Event = {
      id: event.id,
      created_at: event.created_at,
      repo_id: event.repo.id,
      actor_id: event.actor.id,
      actor_username: event.actor.login,
      type: event.type,
      url: '',
      action: null,
      number: null,
      title: null,
      body: null,
    }
    switch (event.type) {
      case 'CommitCommentEvent':
        parseCommitCommentEvent(event, row)
        break
      case 'CreateEvent':
        parseCreateEvent(event, row)
        break
      case 'DeleteEvent':
        parseDeleteEvent(event, row)
        break
      case 'IssueCommentEvent':
        parseIssueCommentEvent(event, row)
        break
      case 'IssuesEvent':
        parseIssuesEvent(event, row)
        break
      case 'PullRequestEvent':
        parsePullRequestEvent(event, row)
        break
      case 'PullRequestReviewEvent':
        parsePullRequestReviewEvent(event, row)
        break
      case 'PullRequestReviewCommentEvent':
        parsePullRequestReviewCommentEvent(event, row)
        break
      case 'PullRequestReviewThreadEvent':
        parsePullRequestReviewThreadEvent(event, row)
        break
      case 'PushEvent':
        parsePushEvent(event, row)
        break
    }
    rows.push(row)
  }
  const { data, error } = await supabaseClient.from('event').upsert(rows)
  if (error != null) {
    return new Response(JSON.stringify(error), { headers: { 'Content-Type': 'application/json' } })
  }
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } })
})

const parseCommitCommentEvent = (event: any, row: Event): Event => {
  row.url = event.payload.comment.html_url
  row.body = event.payload.comment.body
  return row
}

// Action = branch | tag
const parseCreateEvent = (event: any, row: Event): Event => {
  row.url = `https://github.com/${event.repo.name}/tree/${event.payload.ref}`
  row.action = event.payload.ref_type
  row.title = event.payload.ref
  return row
}

const parseDeleteEvent = (event: any, row: Event): Event => {
  row.url = `https://github.com/${event.repo.name}`
  row.action = event.payload.ref_type
  return row
}

const parseIssueCommentEvent = (event: any, row: Event): Event => {
  row.type = event.payload.issue.pull_request === undefined ? 'IssueCommentEvent' : 'PullRequestCommentEvent'
  row.url = event.payload.comment.html_url
  row.action = event.payload.action
  row.number = event.payload.issue.number
  row.title = event.payload.issue.title
  row.body = event.payload.comment.body
  return row
}

const parseIssuesEvent = (event: any, row: Event): Event => {
  row.url = event.payload.issue.html_url
  row.action = event.payload.action
  row.number = event.payload.issue.number
  row.title = event.payload.issue.title
  row.body = event.payload.issue.body
  return row
}

const parsePullRequestEvent = (event: any, row: Event): Event => {
  let action: string = event.payload.action
  if (action === 'closed' && event.payload.pull_request.merged === true) {
    action = 'merged'
  }
  row.url = event.payload.pull_request.html_url
  row.action = action
  row.number = event.payload.pull_request.number
  row.title = event.payload.pull_request.title
  row.body = event.payload.pull_request.body
  return row
}

const parsePullRequestReviewEvent = (event: any, row: Event): Event => {
  row.url = event.payload.review.html_url
  row.action = event.payload.action
  row.number = event.payload.pull_request.number
  row.title = event.payload.pull_request.title
  row.body = event.payload.review.body
  return row
}

const parsePullRequestReviewCommentEvent = (event: any, row: Event): Event => {
  row.url = event.payload.comment.html_url
  row.action = event.payload.action
  row.number = event.payload.pull_request.number
  row.title = event.payload.pull_request.title
  row.body = event.payload.comment.body
  return row
}

const parsePullRequestReviewThreadEvent = (event: any, row: Event): Event => {
  row.url = event.payload.thread.url
  row.action = event.payload.action
  row.number = event.payload.pull_request.number
  row.title = event.payload.pull_request.title
  return row
}

// Action = distinct size
const parsePushEvent = (event: any, row: Event): Event => {
  row.url = `https://github.com/${event.repo.name}/commit/${event.payload.head}`
  row.action = event.payload.distinct_size
  row.title = event.payload.ref
  return row
}
