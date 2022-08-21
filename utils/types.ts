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

export type EventInfo = {
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

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      event: {
        Row: {
          id: number
          created_at: string | null
          repo_id: number | null
          actor_id: number | null
          actor_username: string | null
          type: string | null
          url: string | null
          summary: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          repo_id?: number | null
          actor_id?: number | null
          actor_username?: string | null
          type?: string | null
          url?: string | null
          summary?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          repo_id?: number | null
          actor_id?: number | null
          actor_username?: string | null
          type?: string | null
          url?: string | null
          summary?: string | null
        }
      }
      repo: {
        Row: {
          id: number
          url: string | null
          name: string | null
        }
        Insert: {
          id?: number
          url?: string | null
          name?: string | null
        }
        Update: {
          id?: number
          url?: string | null
          name?: string | null
        }
      }
    }
    Functions: {}
  }
}

export type RealtimeEventPayload = {
  // the change timestamp. eg: "2020-10-13T10:09:22Z".
  commit_timestamp: string

  // any change errors.
  errors: null | string[]

  // the event type.
  eventType: string

  // event schema
  new: EventInfo

  // the previous values. eg: { "id": "9", "age": "11" }. Only works if the table has `REPLICATION FULL`.
  old: object

  // the database schema. eg: "public".
  schema: string

  // the database table. eg: "users".
  table: string
}

export type Filter = {
  exclude_name: Set<string>
  include_only_name: Set<string>
  exclude_event_type: Set<string>
  exclude_repo: Set<string>
}

export type FilterAction = {
  type: FilterType
  action: FilterAct
  payload: string[] | number[]
  filter?: Filter
}

export enum FilterAct {
  ADD,
  REMOVE,
}

export enum FilterType {
  EXCLUDE_NAMES = 'EXCLUDE_NAMES',
  INCLUDE_ONLY_NAMES = 'INCLUDE_ONLY_NAMES',
  EXCLUDE_EVENT_TYPES = 'EXCLUDE_EVENT_TYPES',
  EXCLUDE_REPOS = 'EXCLUDE_REPOS',
  SET = 'SET',
}

export type RepoMap = {
  [id: string]: string
}

export type FilterObj = {
  exclude_name: string[]
  include_only_name: string[]
  exclude_event_type: string[]
  exclude_repo: string[]
}
