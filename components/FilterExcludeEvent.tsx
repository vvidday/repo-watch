import { XCircleFillIcon } from '@primer/octicons-react'
import { Dispatch, FC, FormEvent, useState } from 'react'
import { Filter, FilterAct, FilterAction, FilterType } from '../utils/types'

const FilterExcludeEvent: FC<{ filter: Filter; changeFilter: Dispatch<FilterAction> }> = ({ filter, changeFilter }) => {
  const eventMap: { [key: string]: { id: string; about: string } } = {
    'Commit comment': {
      id: 'CommitCommentEvent',
      about: 'A commit comment is created',
    },
    CreateEvent: {
      id: 'CreateEvent',
      about: 'A branch/tag is created',
    },
    DeleteEvent: { id: 'DeleteEvent', about: 'A branch/tag is deleted' },
    'Issue comment': { id: 'IssueCommentEvent', about: 'An issue comment is created/edited/deleted' },
    'PR comment': { id: 'PullRequestCommentEvent', about: 'A PR comment is created/edited/deleted' },
    'Issue event': { id: 'IssuesEvent', about: 'An issue is changed' },
    'PR event': { id: 'PullRequestEvent', about: 'A PR is changed' },
    'PR review event': { id: 'PullRequestReviewEvent', about: 'A PR review is changed' },
    'PR review comment': { id: 'PullRequestReviewCommentEvent', about: 'A comment on a PR review thread is changed' },
    'PR review therad': { id: 'PullRequestReviewThreadEvent', about: 'A PR review thread is marked resolved/unsolved' },
    Push: { id: 'PushEvent', about: 'A push event is made' },
  }

  function onChange(event: FormEvent<HTMLInputElement>, id: string) {
    changeFilter({
      type: FilterType.EXCLUDE_EVENT_TYPES,
      action: event.currentTarget.checked ? FilterAct.ADD : FilterAct.REMOVE,
      payload: [id],
    })
  }

  return (
    <div className="flex flex-col items-center md:block my-5">
      <p className="text-lg mb-2">Excluded Events</p>
      <ul>
        {Object.keys(eventMap).map((key, i) => {
          return (
            <li key={i}>
              <input
                className="mr-2 cursor-pointer"
                type="checkbox"
                checked={filter.exclude_event_type.has(eventMap[key]['id'])}
                onChange={(e) => onChange(e, eventMap[key]['id'])}
              />
              {key}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FilterExcludeEvent
