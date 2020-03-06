import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import AreaSelectorProvider from './providers/AreaSelectorProvider'
import AreaCacheProvider from './providers/AreaCacheProvider'

ReactDOM.render(
  <AreaSelectorProvider>
    <AreaCacheProvider>
      <App />
    </AreaCacheProvider>
  </AreaSelectorProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/photo-sw.js').then(function(reg) {

    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
