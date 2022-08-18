import {
  CodeReviewIcon,
  CommentDiscussionIcon,
  CommentIcon,
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  PlusCircleIcon,
  RepoPushIcon,
  ShieldCheckIcon,
  ShieldIcon,
  TrashIcon,
} from '@primer/octicons-react'
import Image from 'next/image'
import { EventInfo } from './types'

const SIZE = 16

const eventTypes = new Set<string>([
  'CommitCommentEvent',
  'CreateEvent',
  'DeleteEvent',
  'IssueCommentEvent',
  // Custom
  'PullRequestCommentEvent',
  'IssuesEvent',
  'PullRequestEvent',
  'PullRequestReviewEvent',
  'PullRequestReviewCommentEvent',
  'PullRequestReviewThreadEvent',
  'PushEvent',
])

export const getIconFromType = (type: string, action: string) => {
  if (!eventTypes.has(type)) return
  switch (type) {
    case 'CommitCommentEvent':
      return <CommentIcon size={SIZE} />
    case 'CreateEvent':
      return <PlusCircleIcon size={SIZE} />
    case 'DeleteEvent':
      return <TrashIcon size={SIZE} />
    case 'IssueCommentEvent':
      return <CommentDiscussionIcon size={SIZE} />
    case 'PullRequestCommentEvent':
      return <CommentDiscussionIcon size={SIZE} />
    case 'IssuesEvent':
      if (action === 'closed') return <IssueClosedIcon size={SIZE} />
      if (action === 'reopened') return <IssueReopenedIcon size={SIZE} />
      return <IssueOpenedIcon size={SIZE} />
    case 'PullRequestEvent':
      if (action === 'opened') return <GitPullRequestIcon size={SIZE} fill="green" />
      if (action === 'closed') return <GitPullRequestClosedIcon size={SIZE} fill="red" />
      if (action === 'merged') return <GitMergeIcon size={SIZE} fill="purple" />
      return <GitPullRequestIcon size={SIZE} />
    case 'PullRequestReviewEvent':
      return <CodeReviewIcon size={SIZE} />
    case 'PullRequestReviewCommentEvent':
      return <CommentDiscussionIcon size={SIZE} />
    case 'PullRequestReviewThreadEvent':
      if (action === 'resolved') return <ShieldCheckIcon size={SIZE} />
      return <ShieldIcon size={SIZE} />
    case 'PushEvent':
      return <RepoPushIcon size={SIZE} />
  }
}

export const getSummaryFromEvent = (event: EventInfo) => {
  if (!eventTypes.has(event.type)) return
  let summary: JSX.Element = <></>
  switch (event.type) {
    case 'CommitCommentEvent':
      summary = <div>created a commit event</div>
      break
    case 'CreateEvent':
      summary = (
        <div>
          created {event.action} <code>{event.title}</code>
        </div>
      )
      break
    case 'DeleteEvent':
      summary = (
        <div>
          deleted {event.action} <code>{event.title}</code>
        </div>
      )
      break
    case 'IssueCommentEvent':
      summary = (
        <div>
          commented on issue #{event.number} ({event.title})
        </div>
      )
      break
    case 'PullRequestCommentEvent':
      summary = (
        <div>
          commented on pull request #{event.number} ({event.title})
        </div>
      )
      break
    case 'IssuesEvent':
      summary = (
        <div>
          {event.action} issue #{event.number} ({event.title})
        </div>
      )
      break
    case 'PullRequestEvent':
      summary = (
        <div>
          {event.action} pull request #{event.number} ({event.title})
        </div>
      )
      break
    case 'PullRequestReviewEvent':
      summary = (
        <div>
          created a review in pull request #{event.number} ({event.title})
        </div>
      )
      break
    case 'PullRequestReviewCommentEvent':
      summary = (
        <div>
          commented in a review in pull request #{event.number} ({event.title})
        </div>
      )
      break
    case 'PullRequestReviewThreadEvent':
      summary = (
        <div>
          {event.action} a review thread in pull request #{event.number} ({event.title})
        </div>
      )
      break
    case 'PushEvent':
      summary = (
        <div>
          pushed to <code>{event.title}</code>
        </div>
      )
      break
  }
  return (
    <div>
      <a href={`https://github.com/${event.actor_username}`}>
        <Image src={`https://avatars.githubusercontent.com/u/${event.actor_id}`} width="50px" height="50px" />
        <strong>{event.actor_username}</strong>
      </a>
      {summary}
    </div>
  )
}