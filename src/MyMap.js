import React, { useEffect, useState } from 'react'
import MapGL, { Source, Layer, Marker } from 'react-map-gl'
import Immutable from 'immutable'
import Pin from './components/Pin'

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
    'base-tiles': {
      type: 'raster',
      tiles: [
        // Use DataBC Web Mercator Base Map
        'http://maps.gov.bc.ca/arcserver/services/Province/web_mercator_cache/MapServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&exceptions=text/xml&styles=default&layers=0'
      ],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'test',
      type: 'raster',
      source: 'base-tiles',
      minzoom: 0,
      maxzoom: 24
    }
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
            <Pin label={feature.properties.OPERATOR_NAME} />
          </Marker>
        )
      )
    })
  }
}

export const MyMap = () => {
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
          <Source type="geojson" data={data}>
            <Layer {...dataLayer} />
            <Markers features={data.features} />
          </Source>
        </MapGL>
      )}
    </div>
  )
}

export default MyMap
