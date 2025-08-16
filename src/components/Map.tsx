"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

// 建立自訂圖示，明確指向 public 資料夾中的檔案
const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapDisplay = ({
  lat,
  lng,
  model,
}: {
  lat: number;
  lng: number;
  model?: string;
}) => (
  <MapContainer
    center={[lat, lng]}
    zoom={13}
    scrollWheelZoom={true}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[lat, lng]} icon={customIcon}>
      <Tooltip>{model ? `使用 ${model} 在此拍攝` : "拍攝地點"}</Tooltip>
    </Marker>
  </MapContainer>
);

export default MapDisplay;
