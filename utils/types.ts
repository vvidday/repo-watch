import { Endpoints } from '@octokit/types'
import { components } from '@octokit/openapi-types'

export type Event = Endpoints['GET /repos/{owner}/{repo}/events']['response']['data'][0]

// https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types

export type CommitCommentEventPayload = {
  action: string
  comment: components['schemas']['commit-comment']
}

export type CreateEventPayload = {
  ref: components['schemas']['git-ref']
  ref_type: string
  master_branch: string
  description: string
}

export type DeleteEventPayload = {
  ref: components['schemas']['git-ref']
  ref_type: string
}

export type IssueCommentEventPayload = {
  action: string
  changes?: object
  issue: components['schemas']['issue']
  comment: components['schemas']['issue-comment']
}

export type IssuesEventPayload = {
  action: string
  issue: components['schemas']['issue']
  changes?: object
  label?: components['schemas']['label']
}

export type PullRequestEventPayload = {
  action: string
  number: number
  changes?: object
  pull_request: components['schemas']['pull-request']
}

export type PullRequestReviewEventPayload = {
  action: string
  pull_request: components['schemas']['pull-request']
  review: components['schemas']['pull-request-review']
}

export type PullRequestReviewCommentEventPayload = {
  action: string
  changes?: object
  pull_request: components['schemas']['pull-request']
  comment: components['schemas']['pull-request-review-comment']
}

export type PullRequestReviewThreadEventPayload = {
  action: string
  pull_request: components['schemas']['pull-request']
  thread: components['schemas']['thread']
}

export type PushEventPayload = {
  push_id: number
  size: number
  distinct_size: number
  ref: components['schemas']['git-ref']
  head: string
  before: string
  commits: components['schemas']['commit'][]
}
