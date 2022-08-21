import { XCircleFillIcon } from '@primer/octicons-react'
import { Dispatch, FC, FormEvent, useState } from 'react'
import { Filter, FilterAct, FilterAction, FilterType } from '../utils/types'

const FilterIncludeName: FC<{ filter: Filter; changeFilter: Dispatch<FilterAction> }> = ({ filter, changeFilter }) => {
  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (name === '') return
    changeFilter({
      type: FilterType.INCLUDE_ONLY_NAMES,
      action: FilterAct.ADD,
      payload: [name],
    })
    setName('')
  }

  const [name, setName] = useState('')

  return (
    <div>
      <p>Included Names</p>
      <form onSubmit={onSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {Array.from(filter.include_only_name.values()).map((name, i) => {
          return (
            <li key={i} className="flex">
              <div
                onClick={() => {
                  changeFilter({
                    type: FilterType.INCLUDE_ONLY_NAMES,
                    action: FilterAct.REMOVE,
                    payload: [name],
                  })
                }}
              >
                <XCircleFillIcon size={16} className="cursor-pointer hover:fill-red-700" />
              </div>
              {name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FilterIncludeName
