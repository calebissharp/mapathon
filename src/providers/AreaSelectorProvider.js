import React from 'react'
import { debounce } from 'lodash'

const AreaSelectorContext = React.createContext()

export const useAreaSelect = () => React.useContext(AreaSelectorContext)

export default function AreaSelectorProvider({ children }) {
  const [state, setState] = React.useState({
    selectedArea: [],
    isSelecting: false
  })

  const setSelectedArea = debounce(selectedArea => {
    setState({
      ...state,
      selectedArea
    })
  }, 500)

  const setSelecting = isSelecting => {
    setSelectedArea.cancel()
    setState({ ...state, isSelecting })
  }

  return (
    <AreaSelectorContext.Provider
      value={{ ...state, setSelectedArea, setSelecting }}>
      {children}
    </AreaSelectorContext.Provider>
  )
}
