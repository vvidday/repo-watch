import { FC, FormEvent, useMemo, useState, Dispatch, SetStateAction } from 'react'
import { EventInfo, FuseResult, RepoMap } from '../utils/types'
import Fuse from 'fuse.js'
import Repository from './Repository'

const Repositories: FC<{
  repoMap: RepoMap
  events: EventInfo[]
  setEvents: Dispatch<SetStateAction<EventInfo[]>>
  currentRepoId: string
  setCurrentRepoId: Dispatch<SetStateAction<string>>
}> = ({ repoMap, events, setEvents, currentRepoId, setCurrentRepoId }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<FuseResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  function onChange(event: FormEvent<HTMLInputElement>) {
    setSearchResults(fuse.search({ key: event.currentTarget.value }))
    setSearchTerm(event.currentTarget.value)
  }

  const fuse = useMemo(() => {
    const data = []
    for (const id in repoMap) {
      data.push({
        key: repoMap[id],
        value: id,
      })
    }
    return new Fuse(data, { keys: ['key'] })
  }, [repoMap])

  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-8">
        <p className="text-xl">Search for Repo</p>
        <input
          className="rounded-lg px-2 py-1 w-[250px] border-neutral-200 border dark:bg-stone-800 dark:border-neutral-500"
          type="text"
          value={searchTerm}
          onChange={onChange}
          onFocus={() => {
            if (!showSearchResults) setShowSearchResults(true)
          }}
          onBlur={() => {
            if (showSearchResults) setShowSearchResults(false)
          }}
        />
        {showSearchResults ? (
          <div>
            <ul className="relative">
              {searchResults.map((result, i) => {
                return (
                  <li
                    className="-translate-x-1/2 absolute first:rounded-t-lg last:rounded-b-lg
                  overflow-hidden bg-neutral-100 dark:bg-stone-800 dark:border-neutral-500 hover:bg-neutral-200 
                  dark:hover:bg-stone-900 h-[50px] w-[250px] flex items-center cursor-pointer"
                    style={{ top: `${i * 50}px` }}
                    key={i}
                    onMouseDown={() => {
                      setCurrentRepoId(result.item.value)
                      setSearchTerm('')
                    }}
                  >
                    <p className="px-2">{result.item.key}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>

      <Repository
        repo_id={currentRepoId}
        events={events}
        setEvents={setEvents}
        getRepoNameFromId={(id) => repoMap[id]}
      />
    </div>
  )
}

export default Repositories
