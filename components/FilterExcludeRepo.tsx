import { XCircleFillIcon } from '@primer/octicons-react'
import Fuse from 'fuse.js'
import { Dispatch, FC, FormEvent, useMemo, useState } from 'react'
import { Filter, FilterAct, FilterAction, FilterType, FuseResult, RepoMap } from '../utils/types'

const FilterExcludeRepo: FC<{ filter: Filter; changeFilter: Dispatch<FilterAction>; repoMap: RepoMap }> = ({
  filter,
  changeFilter,
  repoMap,
}) => {
  function onChange(event: FormEvent<HTMLInputElement>) {
    setSearchResults(fuse.search({ key: event.currentTarget.value }))
    setRepo(event.currentTarget.value)
  }

  const [repo, setRepo] = useState('')
  const [searchResults, setSearchResults] = useState<FuseResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

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
    <div className="flex flex-col items-center md:block my-5">
      <p className="text-lg mb-2">Excluded Repos</p>
      <input
        className="rounded-lg px-2 py-1 w-[250px] border-neutral-200 border dark:bg-stone-800 dark:border-neutral-500"
        type="text"
        value={repo}
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
                  overflow-hidden bg-neutral-100 dark:bg-stone-800 dark:border-neutral-500 hover:bg-neutral-200 
                  dark:hover:bg-stone-900 h-[50px] w-[250px] flex items-center cursor-pointer"
                  style={{ top: `${i * 50}px` }}
                  key={i}
                  onMouseDown={() => {
                    changeFilter({
                      type: FilterType.EXCLUDE_REPOS,
                      action: FilterAct.ADD,
                      payload: [result.item.value],
                    })
                    setRepo('')
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

      <ul>
        {Array.from(filter.exclude_repo.values()).map((name, i) => {
          return (
            <li key={i} className="flex">
              <div
                onClick={() => {
                  changeFilter({
                    type: FilterType.EXCLUDE_REPOS,
                    action: FilterAct.REMOVE,
                    payload: [name],
                  })
                }}
              >
                <XCircleFillIcon size={16} className="mr-2 cursor-pointer hover:fill-red-700" />
              </div>
              {repoMap[name]}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FilterExcludeRepo
