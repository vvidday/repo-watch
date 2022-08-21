import { FC, FormEvent, useMemo, useState } from 'react'
import { FuseResult, RepoMap } from '../utils/types'
import Fuse from 'fuse.js'

const Repositories: FC<{ repoMap: RepoMap }> = ({ repoMap }) => {
  const [currentRepo, setCurrentRepo] = useState('')
  const [searchResults, setSearchResults] = useState<FuseResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  function onChange(event: FormEvent<HTMLInputElement>) {
    setSearchResults(fuse.search({ key: event.currentTarget.value }))
    setCurrentRepo(event.currentTarget.value)
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
      <input
        className="rounded-lg px-2 py-1 w-[250px]"
        type="text"
        value={currentRepo}
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
                  className="-translate-x-1/2 md:translate-x-0 absolute first:rounded-t-lg last:rounded-b-lg
                  overflow-hidden bg-slate-600 hover:bg-slate-700 h-[50px] w-[250px] flex items-center cursor-pointer"
                  style={{ top: `${i * 50}px` }}
                  key={i}
                  onMouseDown={() => {
                    setCurrentRepo('')
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
  )
}

export default Repositories
