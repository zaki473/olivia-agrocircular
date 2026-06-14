"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const pengepulIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const barterIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const jualIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export type MapMarker = {
  id: string;
  nama: string;
  lat: number;
  lng: number;
  lokasi: string;
  tipe: "pengepul" | "barter" | "jual";
  info?: string;
};

export default function MapLeaflet({
  markers,
  onMarkerClick,
}: {
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
}) {
  const getIcon = (tipe: MapMarker["tipe"]) => {
    if (tipe === "pengepul") return pengepulIcon;
    if (tipe === "barter") return barterIcon;
    return jualIcon;
  };

  const validMarkers = markers.filter((m) => m.lat != null && m.lng != null);

  return (
    <MapContainer
      center={[-7.5, 110.0]}
      zoom={9}
      style={{ height: "350px", width: "100%", borderRadius: "12px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validMarkers.map((m) => (
        <Marker
          key={`${m.tipe}-${m.id}`}
          position={[m.lat, m.lng]}
          icon={getIcon(m.tipe)}
          eventHandlers={{
            click: () => onMarkerClick?.(m),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{m.nama}</p>
              <p className="text-gray-500">{m.lokasi}</p>
              {m.info && <p className="text-green-600 text-xs mt-1">{m.info}</p>}
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                m.tipe === "pengepul" ? "bg-blue-100 text-blue-700"
                : m.tipe === "barter" ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
              }`}>
                {m.tipe === "pengepul" ? "Pengepul" : m.tipe === "barter" ? "Barter" : "Jual"}
              </span>
              {m.tipe === "pengepul" && onMarkerClick && (
                <button
                  onClick={() => onMarkerClick(m)}
                  className="mt-2 w-full bg-green-700 text-white text-xs py-1.5 rounded-lg"
                >
                  Lihat Detail & Ajukan Tawaran
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}