import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { Badge, Menu, MenuItem } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import PhotoUploader from './PhotoUploader'
import NotificationsIcon from '@material-ui/icons/Notifications'
import DownloadIcon from '@material-ui/icons/CloudDownload'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}))

const Navbar = ({ drawerOpen, onOpenDrawer, onCloseDrawer }) => {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen
        })}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Mapathon
          </Typography>
          <PhotoUploader />
          <IconButton
            color="inherit"
            onClick={drawerOpen ? onCloseDrawer : onOpenDrawer}>
            <DownloadIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar
