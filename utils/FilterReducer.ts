import { storeFilterInStorage } from './localStorage'
import { Filter, FilterAct, FilterAction, FilterType } from './types'

function reducer(state: Filter, action: FilterAction): Filter {
  switch (action.type) {
    case FilterType.EXCLUDE_NAMES:
      const new_exclude_name = new Set(state.exclude_name)
      if (action.action === FilterAct.ADD) {
        for (const name of action.payload) {
          if (typeof name === 'string') new_exclude_name.add(name)
        }
      } else {
        for (const name of action.payload) {
          if (typeof name === 'string') new_exclude_name.delete(name)
        }
      }
      const filter = { ...state, exclude_name: new_exclude_name }
      storeFilterInStorage(filter)
      return filter

    case FilterType.EXCLUDE_EVENT_TYPES:
      const new_exclude_event_type = new Set(state.exclude_event_type)
      if (action.action === FilterAct.ADD) {
        for (const name of action.payload) {
          if (typeof name === 'string') new_exclude_event_type.add(name)
        }
      } else {
        for (const name of action.payload) {
          if (typeof name === 'string') new_exclude_event_type.delete(name)
        }
      }
      const _filter = { ...state, exclude_event_type: new_exclude_event_type }
      storeFilterInStorage(_filter)
      return _filter

    case FilterType.EXCLUDE_REPOS:
      const new_exclude_repo = new Set(state.exclude_repo)
      if (action.action === FilterAct.ADD) {
        for (const repo of action.payload) {
          if (typeof repo === 'string') new_exclude_repo.add(repo)
        }
      } else {
        for (const repo of action.payload) {
          if (typeof repo === 'string') new_exclude_repo.delete(repo)
        }
      }
      const __filter = { ...state, exclude_repo: new_exclude_repo }
      storeFilterInStorage(__filter)
      return __filter

    case FilterType.INCLUDE_ONLY_NAMES:
      const new_include_only_name = new Set(state.include_only_name)
      if (action.action === FilterAct.ADD) {
        for (const name of action.payload) {
          if (typeof name === 'string') new_include_only_name.add(name)
        }
      } else {
        for (const name of action.payload) {
          if (typeof name === 'string') new_include_only_name.delete(name)
        }
      }
      const ___filter = { ...state, include_only_name: new_include_only_name }
      storeFilterInStorage(___filter)
      return ___filter

    case FilterType.SET:
      if (action.filter === undefined) return state
      return action.filter
  }
}

export default reducer
