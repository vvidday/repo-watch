import { Dispatch, FC, useState } from 'react'
import { Filter, FilterAction, RepoMap } from '../utils/types'
import FilterExcludeName from './FilterExcludeName'
import FilterExcludeRepo from './FilterExcludeRepo'
import FilterIncludeName from './FilterIncludeName'

const FilterComp: FC<{ filter: Filter; changeFilter: Dispatch<FilterAction>; repoMap: RepoMap }> = ({ filter, changeFilter, repoMap }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>Filters</button>
      {expanded ? (
        <div className="flex">
          Filter Settings
          <FilterExcludeName filter={filter} changeFilter={changeFilter} />
          <FilterIncludeName filter={filter} changeFilter={changeFilter} />
          <FilterExcludeRepo filter={filter} changeFilter={changeFilter} repoMap={repoMap} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default FilterComp
