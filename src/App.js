import React from 'react'
import MyMap from './MyMap'
import AddIcon from '@material-ui/icons/Add'
import Navbar from './components/Navbar'

import { Fab, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}))

function App() {
  const classes = useStyles()

  return (
    <div>
      <Navbar />
      <MyMap />
      <Fab color="primary" aria-label="add" className={classes.fab}>
        <AddIcon />
      </Fab>
    </div>
  )
}

export default App
