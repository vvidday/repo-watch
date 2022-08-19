import { octokit } from './clients.ts'

export interface Event {
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

// Called for updates (real-time) - gets 0-30 latest events
// Will likely return empty for stale repos, since latest 30 events will probably be watch/forks
export const getData = async (owner: string, repo: string, ignore_old: boolean = false): Promise<Event[]> => {
  const res = await octokit.request('GET /repos/{owner}/{repo}/events', {
    owner: owner,
    repo: repo,
  })

  let rows: Event[] = []

  for (let i = res.data.length - 1; i >= 0; i--) {
    const event = res.data[i]
    if (event.type === null || !eventTypes.has(event.type)) {
      continue
    }
    rows.push(processDataEntry(event))
  }
  return rows
}

// Called once / once in a while to populate database - gets 30 whitelisted events (non-watch/fork). Needed for stale repos
export const getDataStale = async (owner: string, repo: string): Promise<Event[]> => {
  let rows: Event[] = []
  let page = 1
  while (rows.length < 30) {
    const res = await octokit.request('GET /repos/{owner}/{repo}/events', {
      owner: owner,
      repo: repo,
      per_page: 100,
      page: page,
    })
    if (res.data.length === 0) break
    for (let i = res.data.length - 1; i >= 0; i--) {
      const event = res.data[i]
      if (event.type === null || !eventTypes.has(event.type)) {
        continue
      }
      rows.push(processDataEntry(event))
      if (rows.length === 30) break
    }
    page++
  }
  return rows
}

const processDataEntry = (event: any): Event => {
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
  return row
}

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
  row.title = event.payload.ref
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
