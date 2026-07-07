"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(DefaultIcon);

export default function Map() {
  const position: [number, number] = [-1.9448, 30.1265]; // KG 11 Ave, Kigali
  const mapsUrl =
    "https://www.google.com/maps/dir//KG+11+Ave,+Kigali/@-1.9450509,30.1149417,14.5z/data=!4m17!1m8!3m7!1s0x19dca71759b7aa45:0x2cde50a29ad17c85!2sKG+11+Ave,+Kigali!3b1!8m2!3d-1.9448082!4d30.1290542!16s%2Fg%2F12xp_wcyk!4m7!1m0!1m5!1m1!1s0x19dca71759b7aa45:0x2cde50a29ad17c85!2m2!1d30.1290542!2d-1.9448082?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D";

  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <strong>RSK Associates</strong>
          <br />
          KIMIRONKO, KG11 Av, NO 60
          <br />
          POBOX 6556 Kigali
          <br />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary underline"
          >
            Open in Google Maps
          </a>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
