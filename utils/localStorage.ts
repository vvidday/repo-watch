import { Filter, FilterObj } from './types'

export const retrieveFilterFromStorage = (): Filter => {
  const storageString = localStorage.getItem('filter')
  if (storageString === null) {
    return {
      exclude_name: new Set<string>(['vercel[bot]', 'dependabot[bot]', 'github-actions[bot]']),
      include_only_name: new Set<string>(),
      exclude_event_type: new Set<string>(),
      exclude_repo: new Set<string>(),
    }
  } else {
    const filterObj = JSON.parse(storageString)
    return {
      exclude_name: new Set<string>(filterObj.exclude_name),
      include_only_name: new Set<string>(filterObj.include_only_name),
      exclude_event_type: new Set<string>(filterObj.exclude_event_type),
      exclude_repo: new Set<string>(filterObj.exclude_repo),
    }
  }
}

export const storeFilterInStorage = (filter: Filter) => {
  const filterObj: FilterObj = {
    exclude_name: Array.from(filter.exclude_name),
    include_only_name: Array.from(filter.include_only_name),
    exclude_event_type: Array.from(filter.exclude_event_type),
    exclude_repo: Array.from(filter.exclude_repo),
  }
  localStorage.setItem('filter', JSON.stringify(filterObj))
}
