import Image from 'next/image'
import { FC, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import { getIconFromType, getSumamryHeaderFromType, getSummaryFromEvent } from '../utils/helpers'
import { EventInfo } from '../utils/types'
import remarkGfm from 'remark-gfm'
import { MarkGithubIcon } from '@primer/octicons-react'

const Event: FC<{
  ev: EventInfo
}> = ({ ev }) => {
  const icon = getIconFromType(ev.type, ev.action ?? '')
  const summary = getSummaryFromEvent(ev)
  const summaryHeader = getSumamryHeaderFromType(ev.type)

  return (
    <details className="md:w-4/5 m-auto">
      <summary className="flex items-center mx-5 my-3 cursor-pointer justify-between">
        <div className="flex items-center">
          {icon}
          {summary}
        </div>
        <a href={ev.url} className="ml-3" target="_blank">
          <MarkGithubIcon size={24} />
        </a>
      </summary>
      <div className="bg-slate-800">
        <p className="ml-5 font-bold">{ev.body === null || ev.body === '' ? '-' : summaryHeader}</p>
        <ReactMarkdown
          remarkPlugins={[[remarkGfm]]}
          className="mt-2 ml-5 overflow-auto prose dark:prose-invert max-w-none"
          children={ev.body || ''}
        />
      </div>
    </details>
  )
}

export default Event
