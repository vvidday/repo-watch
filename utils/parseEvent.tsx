import {
  CreateEventPayload,
  DeleteEventPayload,
  Event,
  IssueCommentEventPayload,
  IssuesEventPayload,
  PullRequestEventPayload,
  PullRequestReviewCommentEventPayload,
  PullRequestReviewEventPayload,
  PullRequestReviewThreadEventPayload,
  PushEventPayload,
} from './types'
import { CommitCommentEventPayload } from './types'
import EventComp from '../components/Event'

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

export const parseEvent = (event: Event) => {
  if (event.type === null || !eventTypes.has(event.type)) {
    return
  }
  let summary: string = ''
  let element: JSX.Element = <></>
  switch (event.type) {
    case 'CommitCommentEvent':
      ;[summary, element] = parseCommitCommentEvent(event)
      break
    case 'CreateEvent':
      ;[summary, element] = parseCreateEvent(event)
      break
    case 'DeleteEvent':
      ;[summary, element] = parseDeleteEvent(event)
      break
    case 'IssueCommentEvent':
      ;[summary, element] = parseIssueCommentEvent(event)
      break
    case 'IssuesEvent':
      ;[summary, element] = parseIssuesEvent(event)
      break
    case 'PullRequestEvent':
      ;[summary, element] = parsePullRequestEvent(event)
      break
    case 'PullRequestReviewEvent':
      ;[summary, element] = parsePullRequestReviewEvent(event)
      break
    case 'PullRequestReviewCommentEvent':
      ;[summary, element] = parsePullRequestReviewCommentEvent(event)
      break
    case 'PullRequestReviewThreadEvent':
      ;[summary, element] = parsePullRequestReviewThreadEvent(event)
      break
    case 'PushEvent':
      ;[summary, element] = parsePushEvent(event)
      break
  }
  return <EventComp id={event.actor.id} username={event.actor.login} summary={summary} ChildComp={element} />
}

const parseCommitCommentEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as CommitCommentEventPayload
  return ['Created Comment', <></>]
}

const parseCreateEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as CreateEventPayload
  return ['Branch/Tag created', <></>]
}

const parseDeleteEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as DeleteEventPayload
  return ['Branch/Tag deleted', <></>]
}

const parseIssueCommentEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as IssueCommentEventPayload
  return ['Comment on issue/pr', <></>]
}

const parseIssuesEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as IssuesEventPayload
  return ['action on issue/pr', <></>]
}

const parsePullRequestEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as PullRequestEventPayload
  return ['action on pr', <></>]
}

const parsePullRequestReviewEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as PullRequestReviewEventPayload
  return ['action on pr', <></>]
}

const parsePullRequestReviewCommentEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as PullRequestReviewCommentEventPayload
  return ['review comment on pr', <></>]
}

const parsePullRequestReviewThreadEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as PullRequestReviewThreadEventPayload
  return ['review thread on pr', <></>]
}

const parsePushEvent = (event: Event): [summary: string, element: JSX.Element] => {
  const payload = event.payload as unknown as PushEventPayload
  return ['push event', <></>]
}
