import { PlusCircleIcon, XCircleFillIcon } from '@primer/octicons-react'
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
    <div className="flex flex-col items-center md:block my-5">
      <p className="text-lg mb-2">Included Names</p>
      <form onSubmit={onSubmit} className="flex items-center w-[250px] mb-2">
        <input className="w-[220px] rounded-lg px-2 py-1" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">
          <div className="flex">
            <PlusCircleIcon size={24} fill="white" className="ml-2 hover:fill-green-600" />
          </div>
        </button>
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
                <XCircleFillIcon size={16} className="mr-2 cursor-pointer hover:fill-red-700" />
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
