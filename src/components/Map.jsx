import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'

import styles from './Map.module.css'
import { useCities } from '../contexts/CitiesContext'
import { useGeolocation, useURLPosition } from '../hooks'
import  Button  from './Button'

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { isLoading: isLoadingPosition, position: geolocationPosition, getPosition} = useGeolocation();
  const { lat, lng } = useURLPosition();
  const { cities } = useCities();
  

  useEffect(function() {
    if (lat && lng) setMapPosition([lat, lng])
  }
,[lat, lng])

  useEffect(function() {
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  },[geolocationPosition])
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (<Button type='position' onClick={getPosition}>
        {isLoadingPosition ? 'Locating...' : 'Use your position'}
      </Button>)}
      <MapContainer  center={mapPosition} zoom={13} scrollWheelZoom={true} className={styles.map}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />
    {cities.map(city => 
      <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
        <Popup>
          <span>{city.emoji}</span>
          <h3>{city.cityName}</h3>
        </Popup>
      </Marker>)}
      <ChangeCenter position={mapPosition} />
      <DetectClick />
  </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick() {
  
  const navigate = useNavigate();
  
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
}
export default Map