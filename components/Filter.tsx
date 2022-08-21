import { Dispatch, FC, useState } from 'react'
import { Filter, FilterAction } from '../utils/types'
import FilterExcludeName from './FilterExcludeName'
import FilterIncludeName from './FilterIncludeName'

const FilterComp: FC<{ filter: Filter; changeFilter: Dispatch<FilterAction> }> = ({ filter, changeFilter }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>Filters</button>
      {expanded ? (
        <div>
          Filter Settings
          <FilterExcludeName filter={filter} changeFilter={changeFilter} />
          <FilterIncludeName filter={filter} changeFilter={changeFilter} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default FilterComp
