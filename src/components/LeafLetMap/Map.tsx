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

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, useRef, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";

const icon = new L.Icon({
  iconUrl: "/images/map/marker-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MarkersAndPolygons = ({
  projects,
  selectedProjectId,
  resetMap,
  onSeeMoreDetails,
}: any) => {
  const map = useMap();
  const currentPopup = useRef<L.Popup | null>(null);

  const showProjectDetailsOnMap = useCallback(
    (project: any) => {
      if (currentPolygon.current) {
        map.removeLayer(currentPolygon.current);
      }
      if (currentPopup.current) {
        currentPopup.current.removeFrom(map);
      }

      const geometry = project.geometry.map((coord: any) => [
        coord[1],
        coord[0],
      ]);
      currentPolygon.current = L.polygon(geometry).addTo(map);
      const latlng: L.LatLngTuple = [project.location[1], project.location[0]];
      const marker = L.marker(latlng, { icon }).addTo(map);

      const popup = marker
        .bindPopup(
          `<b>${project.estate.toUpperCase()}</b><br><b>Size (Acre): ${project.size_acre.toFixed(
            2
          )}</b><br>${project.district}, ${project.province}`
        )
        .openPopup()
        .getPopup();

      if (popup) {
        currentPopup.current = popup;
      } else {
        currentPopup.current = null;
      }
      map.setView(latlng, 20);
    },
    [map]
  );

  useEffect(() => {
    if (projects && projects.length > 0) {
      projects.forEach((project: any) => {
        const latlng: L.LatLngTuple = [
          project.location[1],
          project.location[0],
        ];
        const marker = L.marker(latlng, { icon }).addTo(map);

        marker.on("click", () => {
          showProjectDetailsOnMap(project);
          onSeeMoreDetails(project.uid);
        });

        if (selectedProjectId && project.uid === selectedProjectId) {
          showProjectDetailsOnMap(project);
        }
      });
    }
    if (resetMap && !selectedProjectId) {
      map.setView([30.3753, 69.3451], 6);
      if (currentPolygon.current) {
        map.removeLayer(currentPolygon.current);
        currentPolygon.current = null;
      }
      if (currentPopup.current) {
        currentPopup.current.removeFrom(map);
        currentPopup.current = null;
      }
    }
  }, [
    projects,
    map,
    selectedProjectId,
    resetMap,
    onSeeMoreDetails,
    showProjectDetailsOnMap,
  ]);

  return null;
};

const Map = ({
  projects,
  selectedProjectId,
  onSeeMoreDetails,
  resetMap,
}: any) => {
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
      {projects?.length > 0 && (
        <MarkersAndPolygons
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSeeMoreDetails={onSeeMoreDetails}
          resetMap={resetMap}
        />
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
