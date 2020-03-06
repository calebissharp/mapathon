import React from 'react'

const AreaCacheContext = React.createContext()

export const useCache = () => React.useContext(AreaCacheContext)

export default function AreaCacheProvider({ children }) {
  const [state, setState] = React.useState({
    cachedAreas: []
  })

  const addCachedArea = area => {
    setState({
      ...state,
      cachedAreas: [...state.cachedAreas, area]
    })
  }

  const removeCachedArea = index => {
    setState({
      ...state,
      cachedAreas: state.cachedAreas
        .slice(0, index)
        .concat(state.cachedAreas.slice(index + 1))
    })
  }

  return (
    <AreaCacheContext.Provider
      value={{ ...state, addCachedArea, removeCachedArea }}>
      {children}
    </AreaCacheContext.Provider>
  )
}
