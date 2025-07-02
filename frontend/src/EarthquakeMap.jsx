import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEarthquakes } from './features/earthquakeSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Marquee from "./Marquee";
import Sidebar from './Sidebar';
import Analytics from './Analytics';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

import Filters from './Filters';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function EarthquakeMap() {
  const dispatch = useDispatch();
  const earthquakes = useSelector((state) => state.earthquake.data);
  const status = useSelector((state) => state.earthquake.status);
  const error = useSelector((state) => state.earthquake.error);

  const [minMag, setMinMag] = useState('');
  const [maxMag, setMaxMag] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [activeChart, setActiveChart] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEarthquakes());
    }
  }, [status, dispatch]);

  const today = new Date().toISOString().slice(0, 10);


const filteredEarthquakes = earthquakes.filter((eq) => {
  if (minMag && eq.magnitude < parseFloat(minMag)) return false;
  if (maxMag && eq.magnitude > parseFloat(maxMag)) return false;
  if (location && !eq.location.toLowerCase().includes(location.toLowerCase())) return false;

  if (date) {
    const eqDateTime = new Date(eq.occurred_at);
    const filterDate = new Date(date);
    const filterDateNext = new Date(filterDate);
    filterDateNext.setDate(filterDateNext.getDate() + 1);

    
    if (eqDateTime < filterDate || eqDateTime >= filterDateNext) return false;
  }

  return true;
});


  const clearFilters = () => {
    setMinMag('');
    setMaxMag('');
    setLocation('');
    setDate(today);
  };

  if (status === 'loading') return <p>Yükleniyor...</p>;
  if (status === 'failed') return <p>Hata: {error}</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Filters
        minMag={minMag}
        maxMag={maxMag}
        location={location}
        date={date}
        setMinMag={setMinMag}
        setMaxMag={setMaxMag}
        setLocation={setLocation}
        setDate={setDate}
        onClear={clearFilters}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar'a filtrelenmemiş orijinal veriyi gönderiyoruz */}
        <Sidebar 
          onSelect={setActiveChart} 
          data={earthquakes}  
          style={{ flexShrink: 0 }} 
        />

        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={[39.0, 35.0]}
            zoom={6}
            style={{ height: 'calc(100% - 40px)', width: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredEarthquakes.map((eq) => (
              <Marker key={eq.event_id} position={[eq.latitude, eq.longitude]}>
                <Popup>
                  <strong>{eq.location}</strong><br />
                  Tarih: {new Date(eq.occurred_at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}<br />
                  Büyüklük: {eq.magnitude}<br />
                  Derinlik: {eq.depth} km
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Modal container: absolute ve yüksek z-index */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 10000,
              pointerEvents: activeChart ? 'auto' : 'none',
            }}
          >
            <Analytics
              activeChart={activeChart}
              onClose={() => setActiveChart(null)}
              data={earthquakes}  
            />
          </div>
        </div>
      </div>

      <Marquee />
    </div>
  );
}
