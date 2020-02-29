import React from 'react'
import MyMap from './MyMap'
import CowIcon from 'mdi-react/CowIcon'
import CrosshairsGpsIcon from 'mdi-react/CrosshairsGpsIcon'
import SkullIcon from 'mdi-react/SkullIcon'
import Navbar from './components/Navbar'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}))

const actions = [
  { icon: <SkullIcon />, name: 'Purge' },
  { icon: <CrosshairsGpsIcon />, name: 'Locate' }
]

function App() {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <div>
      <Navbar />
      <MyMap />
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.fab}
        icon={<CowIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up">
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </div>
  )
}

export default App
