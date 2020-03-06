import React, { useEffect, useState } from 'react'
import MapGL, { Source, Layer, Marker } from 'react-map-gl'
import Immutable from 'immutable'
import Pin from './components/Pin'
import AreaSelector from './components/AreaSelector'

const dataLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': '#d814ff',
    'fill-opacity': 0.8
  }
}

const mapStyle = {
  version: 8,
  sources: {
    base: {
      type: 'raster',
      tiles: [
        'http://localhost:8080/tiles/databc/EPSG3857/{z}/{x}/{y}.png'
        // 'https://mapproxyoc-range-myra-dev.pathfinder.gov.bc.ca/tiles/databc/EPSG3857/{z}/{x}/{y}.png'
      ],
      scheme: 'xyz',
      tileSize: 256
    }
    // base: {
    //   type: 'raster',
    //   tiles: [
    //     'http://127.0.0.1:8080/'
    //   ],
    //   tileSize: 256,
    //   scheme: 'tms'
    // }
    // base: {
    //   type: 'raster',
    //   tiles: [
    //     // Use DataBC Web Mercator Base Map
    //     'https://maps.gov.bc.ca/arcserver/services/Province/web_mercator_cache/MapServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&exceptions=text/xml&styles=default&layers=0'
    //   ],
    //   tileSize: 256
    // },
    // tenures: {
    //   type: 'raster',
    //   tiles: [
    //     'https://openmaps.gov.bc.ca/geo/pub/WHSE_FOREST_TENURE.FTEN_RANGE_POLY_SVW/ows?service=WMS&version=1.1.1&request=GetMap&format=image/png&styles=&layers=pub:WHSE_FOREST_TENURE.FTEN_RANGE_POLY_SVW&srs=EPSG:3857&width=256&height=256&exceptions=text/xml&bbox={bbox-epsg-3857}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE'
    //   ],
    //   tileSize: 256
    // },
    // pastures: {
    //   type: 'raster',
    //   tiles: [
    //     'https://openmaps.gov.bc.ca/geo/pub/WHSE_FOREST_VEGETATION.RANGE_IMP_FEATURE_LINE_SVW/ows?service=WMS&version=1.1.1&request=GetMap&format=image/png&styles=&layers=pub:WHSE_FOREST_VEGETATION.RANGE_IMP_FEATURE_LINE_SVW&srs=EPSG:3857&width=256&height=256&exceptions=text/xml&bbox={bbox-epsg-3857}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE'
    //   ],
    //   tileSize: 256
    // },
    // layer2: {
    //   type: 'raster',
    //   tiles: [
    //     'https://openmaps.gov.bc.ca/geo/pub/WHSE_FOREST_VEGETATION.RANGE_IMP_FEATURE_PNT_SVW/ows?service=WMS&version=1.1.1&request=GetMap&format=image/png&styles=&layers=pub:WHSE_FOREST_VEGETATION.RANGE_IMP_FEATURE_PNT_SVW&srs=EPSG:3857&width=256&height=256&exceptions=text/xml&bbox={bbox-epsg-3857}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE'
    //   ],
    //   tileSize: 256
    // }
  },
  layers: [
    {
      id: 'base',
      type: 'raster',
      source: 'base',
      minzoom: 0,
      maxzoom: 24
    }
    // {
    //   id: 'tenures',
    //   type: 'raster',
    //   source: 'tenures',
    //   minzoom: 0,
    //   maxzoom: 24
    // },
    // {
    //   id: 'pastures',
    //   type: 'raster',
    //   source: 'pastures',
    //   minzoom: 0,
    //   maxzoom: 24
    // },
    // {
    //   id: 'layer2',
    //   type: 'raster',
    //   source: 'layer2',
    //   minzoom: 0,
    //   maxzoom: 24
    // }
  ]
}

const processGeoJson = data => {
  return data
}

class Markers extends React.PureComponent {
  render() {
    const { features } = this.props

    return features.map(feature => {
      return (
        feature.geometry.type === 'Point' && (
          <Marker
            key={`MARKER_${feature.properties.OPERATOR_NAME}`}
            longitude={feature.geometry.coordinates[0]}
            latitude={feature.geometry.coordinates[1]}
            {...{
              sprite: 'mapbox://sprites/mapbox/bright-v8'
            }}>
            <Pin
              label={feature.properties.OPERATOR_NAME}
              onClick={() =>
                window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
              }
            />
          </Marker>
        )
      )
    })
  }
}

export const MyMap = ({ areaSelectorOpen = false, onAreaChange }) => {
  const [viewport, setViewport] = useState({
    latitude: 53.37620087595687,
    longitude: -123.38872720937992,
    zoom: 4.889679699609528,
    bearing: 0,
    pitch: 0
  })

  const [data, setData] = useState({ features: [] })
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch('/data/GSR_ASSISTED_LIVING_LOCS_SV.geojson')

    const data = await res.json()

    setData(processGeoJson(data))
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="map-container">
      {loading ? (
        <div>Loading layers...</div>
      ) : (
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={Immutable.fromJS(mapStyle)}
          onViewportChange={setViewport}>
          {/* <Source type="geojson" data={data}>
            <Layer {...dataLayer} />
            <Markers features={data.features} />
          </Source> */}
          {areaSelectorOpen && <AreaSelector onAreaChange={onAreaChange} />}
        </MapGL>
      )}
    </div>
  )
}

export default MyMap
