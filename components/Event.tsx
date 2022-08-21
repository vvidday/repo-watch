import { FC, Suspense, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getIconFromType, getSummaryHeaderFromType, getSummaryFromEvent, getExpandedInfoFromEvent } from '../utils/helpers'
import { EventInfo } from '../utils/types'
import remarkGfm from 'remark-gfm'
import { MarkGithubIcon } from '@primer/octicons-react'
import Moment from 'react-moment'
import 'moment-timezone'

const Event: FC<{
  ev: EventInfo
  getRepoNameFromId: (id: number) => string
}> = ({ ev, getRepoNameFromId }) => {
  const icon = getIconFromType(ev.type, ev.action ?? '')
  const summary = getSummaryFromEvent(ev)
  const summaryHeader = getSummaryHeaderFromType(ev.type)
  const expandedInfo = getExpandedInfoFromEvent(ev)
  const [eventTime, setEventTime] = useState('')

  // Workaround to only render time client side - avoid SSG hydration error
  useEffect(() => {
    setEventTime(() => ev.created_at)
  }, [ev.created_at])

  return (
    <details className="overflow-hidden 2xl:w-5/6 m-auto bg-zinc-800 rounded-lg my-2">
      <summary className="mx-5 py-3 cursor-pointer grid grid-cols-[10fr_1fr] lg:grid-cols-[1fr_2fr_1fr] xl:grid-cols-[1fr_3fr_1fr]">
        <a
          href={`https://github.com/${getRepoNameFromId(ev.repo_id)}`}
          target="_blank"
          rel="noreferrer"
          className="hidden lg:flex justify-end items-center mr-3 hover:text-green-600"
        >
          <code>{getRepoNameFromId(ev.repo_id)}</code>
        </a>
        <div className="flex items-center">
          {icon}
          {summary}
        </div>
        <div className="flex justify-end items-center">
          <div className="hidden lg:block cursor-text ml-2 xl:ml-5">
            {eventTime === '' ? (
              <></>
            ) : (
              <Moment fromNow interval={60000}>
                {eventTime}
              </Moment>
            )}
          </div>
          <a href={ev.url} className="ml-3" target="_blank" rel="noreferrer">
            <MarkGithubIcon className="hover:scale-110 hover:fill-green-600" size={24} />
          </a>
        </div>
      </summary>
      <div className="bg-zinc-800 grid grid-cols-[10fr_1fr] lg:grid-cols-[1fr_2fr_1fr] xl:grid-cols-[1fr_3fr_1fr]">
        <div className="hidden lg:block"></div>
        <div className="">
          <p className="ml-5 text-lg mb-5">{expandedInfo}</p>
          <p className="ml-5 font-semibold">{ev.body === null || ev.body === '' ? '-' : summaryHeader}</p>
          <ReactMarkdown remarkPlugins={[[remarkGfm]]} className="mt-2 ml-5 overflow-auto prose dark:prose-invert max-w-none">
            {ev.body || ''}
          </ReactMarkdown>
        </div>
      </div>
    </details>
  )
}

export default Event
