// "use client";

// import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
// import L from "leaflet";
// import { useEffect, useState } from "react";
// import "leaflet/dist/leaflet.css";
// import { Button } from "../ui/button";

// const icon = new L.Icon({
//   iconUrl: "/images/map/marker-green.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const Markers = ({ lands, onSeeMoreDetails }: any) => {
//   const map = useMap();

//   useEffect(() => {
//     if (lands && lands.length > 0) {
//       lands.forEach((land: any) => {
//         console.log(land, "uppercase");

//         const latlng: L.LatLngTuple = [land.location[0], land.location[1]];
//         const marker = L.marker(latlng, { icon }).addTo(map);

//         marker
//           .bindPopup(
//             `<b>${land.title.toUpperCase()}</b><br><b>Size (Acre): ${
//               land.trade
//             }</b><br>${land.district}, ${land.province}`
//           )
//           .openPopup();

//         marker.on("click", () => {
//           onSeeMoreDetails(land.uid);
//           map.setView(latlng, 15);
//         });
//       });
//     }
//   }, [lands, map, onSeeMoreDetails]);

//   return null;
// };

// const Map = ({ lands, selectedLandId, onSeeMoreDetails, resetMap }: any) => {
//   const [tileLayerUrl, setTileLayerUrl] = useState(
//     "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//   );

//   const switchTileLayer = (newTileLayerUrl: string) => {
//     setTileLayerUrl(newTileLayerUrl);
//   };

//   return (
//     <MapContainer
//       center={[30.3753, 69.3451]}
//       zoom={6}
//       className="h-full w-full z-10 relative"
//     >
//       <TileLayer url={tileLayerUrl} />
//       {lands?.length > 0 && (
//         <Markers lands={lands} onSeeMoreDetails={onSeeMoreDetails} />
//       )}

//       <div className="absolute flex flex-col items-center bottom-20 left-14 z-[1000] pointer-events-auto group">
//         <Button
//           onClick={() =>
//             switchTileLayer(
//               "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             )
//           }
//           className="light-map absolute w-16 h-16 border border-primary rounded-full shadow-md transition-transform duration-300 ease-in-out group-hover:translate-y-0 group-hover:scale-110"
//         />
//         <Button
//           onClick={() =>
//             switchTileLayer(
//               "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
//             )
//           }
//           className="terrain-map absolute w-16 h-16 border border-primary rounded-full shadow-md transition-transform duration-300 ease-in-out group-hover:translate-y-[-60px] group-hover:scale-110"
//         />
//         <Button
//           onClick={() =>
//             switchTileLayer(
//               "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//             )
//           }
//           className="dark-map absolute w-16 h-16 border border-primary rounded-full shadow-md transition-transform duration-300 ease-in-out group-hover:translate-y-[-120px] group-hover:scale-110"
//         />
//       </div>
//     </MapContainer>
//   );
// };

// export default Map;

"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";

const icon = new L.Icon({
  iconUrl: "/images/map/marker-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Markers = ({ lands, onSeeMoreDetails }: any) => {
  const map = useMap();
  const currentPopup = useRef<L.Popup | null>(null);

  useEffect(() => {
    if (lands && lands.length > 0) {
      lands.forEach((land: any) => {
        console.log(land, "uppercase");

        const latlng: L.LatLngTuple = [land.location[0], land.location[1]];
        const marker = L.marker(latlng, { icon }).addTo(map);

        marker.on("click", () => {
          if (currentPopup.current) {
            map.closePopup(currentPopup.current);
          }

          const popup = L.popup()
            .setLatLng(latlng)
            .setContent(
              `<b>${land.title.toUpperCase()}</b><br><b>Size (Acre): ${
                land.trade
              }</b><br>${land.district}, ${land.province}`
            )
            .openOn(map);

          currentPopup.current = popup;

          onSeeMoreDetails(land.uuid);
          map.setView(latlng, 15);
        });
      });
    }
  }, [lands, map, onSeeMoreDetails]);

  return null;
};

const Map = ({ lands, selectedLandId, onSeeMoreDetails, resetMap }: any) => {
  const [tileLayerUrl, setTileLayerUrl] = useState(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  const switchTileLayer = (newTileLayerUrl: string) => {
    setTileLayerUrl(newTileLayerUrl);
  };

  return (
    <MapContainer
      center={[30.3753, 69.3451]}
      zoom={6}
      className="h-full w-full z-10 relative"
    >
      <TileLayer url={tileLayerUrl} />
      {lands?.length > 0 && (
        <Markers lands={lands} onSeeMoreDetails={onSeeMoreDetails} />
      )}

      {/* Tile Layer Switch Buttons */}
      <div className="absolute flex flex-col items-center bottom-20 left-14 z-[1000] pointer-events-auto group">
        <Button
          onClick={() =>
            switchTileLayer(
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            )
          }
          className="light-map absolute w-16 h-16 border border-primary rounded-full shadow-md transition-transform duration-300 ease-in-out group-hover:translate-y-0 group-hover:scale-110"
        />
        <Button
          onClick={() =>
            switchTileLayer(
              "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            )
          }
          className="terrain-map absolute w-16 h-16 border border-primary rounded-full shadow-md transition-transform duration-300 ease-in-out group-hover:translate-y-[-60px] group-hover:scale-110"
        />
        <Button
          onClick={() =>
            switchTileLayer(
              "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            )
          }
          className="dark-map absolute w-16 h-16 border border-primary rounded-full shadow-md transition-transform duration-300 ease-in-out group-hover:translate-y-[-120px] group-hover:scale-110"
        />
      </div>
    </MapContainer>
  );
};

export default Map;
