import { Dispatch, FC, useState } from 'react'
import { Filter, FilterAction, RepoMap } from '../utils/types'
import FilterExcludeEvent from './FilterExcludeEvent'
import FilterExcludeName from './FilterExcludeName'
import FilterExcludeRepo from './FilterExcludeRepo'
import FilterIncludeName from './FilterIncludeName'

const FilterComp: FC<{ filter: Filter; changeFilter: Dispatch<FilterAction>; repoMap: RepoMap }> = ({ filter, changeFilter, repoMap }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div className="flex justify-center">
        <button onClick={() => setExpanded(!expanded)} className="text-xl hover:text-green-600">
          Filters
        </button>
      </div>

      {expanded ? (
        <div className="flex flex-col md:flex-row flex-wrap justify-around">
          <FilterExcludeName filter={filter} changeFilter={changeFilter} />
          <FilterIncludeName filter={filter} changeFilter={changeFilter} />
          <FilterExcludeRepo filter={filter} changeFilter={changeFilter} repoMap={repoMap} />
          <FilterExcludeEvent filter={filter} changeFilter={changeFilter} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default FilterComp
