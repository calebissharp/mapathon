import React, { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const AreaCacheContext = React.createContext()

export const useCache = () => React.useContext(AreaCacheContext)

export default function AreaCacheProvider({ children }) {
  const [state, setState] = React.useState({
    cachedAreas: []
  })

  const addCachedArea = area => {
    const id = uuidv4()
    setState({
      ...state,
      cachedAreas: [
        ...state.cachedAreas,
        { ...area, downloading: false, downloaded: false, id }
      ]
    })

    setTimeout(() => {
      downloadArea(id)
    }, 1000)
  }

  const downloadArea = async id => {
    // const area = state.cachedAreas.find(area => area.id === id)

    setArea(id, area => ({ ...area, downloading: true }))

    setTimeout(() => {
      setArea(id, area => ({ ...area, downloading: false, downloaded: true }))
    }, 1000)
  }

  useEffect(() => {
    state.cachedAreas.forEach(area => {
      if (!area.downloaded && !area.downloading) {
        downloadArea(area.id)
      }
    })
  }, [state.cachedAreas.length])

  const removeCachedArea = index => {
    setState({
      ...state,
      cachedAreas: state.cachedAreas
        .slice(0, index)
        .concat(state.cachedAreas.slice(index + 1))
    })
  }

  const setArea = (id, cb) => {
    // console.log(state)

    setState({
      ...state,
      cachedAreas: state.cachedAreas.map(area =>
        area.id === id ? cb(area) : area
      )
    })
  }

  return (
    <AreaCacheContext.Provider
      value={{ ...state, addCachedArea, removeCachedArea }}>
      {children}
    </AreaCacheContext.Provider>
  )
}
