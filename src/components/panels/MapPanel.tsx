import { useRef, useEffect, type CSSProperties } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import { Style, Icon, Stroke, Circle as CircleStyle, Fill } from "ol/style";

import { useSimulationStore, type Entity } from "../../store/simulationStore";
import { unitIconMap, defaultIcon } from "../../utils/unitIcons";
import { sendCommand } from "../../services/websocketService";

const createUnitStyle = (entity: Entity) => [
  new Style({
    image: new CircleStyle({
      radius: 16,
      fill: new Fill({ color: "rgba(255, 255, 255, 0.8)" }),
      stroke: new Stroke({ color: "rgba(0, 0, 0, 0.5)", width: 1 }),
    }),
  }),
  new Style({
    image: new Icon({
      src: unitIconMap[entity.type] || defaultIcon,
      scale: 0.3,
      anchor: [0.5, 0.5],
    }),
  }),
];
const createSelectedUnitStyle = (entity: Entity) => [
  new Style({
    image: new CircleStyle({
      radius: 18,
      fill: new Fill({ color: "rgba(51, 153, 255, 0.5)" }),
      stroke: new Stroke({ color: "#3399ff", width: 2 }),
    }),
    zIndex: 10,
  }),
  new Style({
    image: new Icon({
      src: unitIconMap[entity.type] || defaultIcon,
      scale: 0.35,
      anchor: [0.5, 0.5],
    }),
    zIndex: 11,
  }),
];
const routeStyle = new Style({
  stroke: new Stroke({
    color: "rgba(0, 0, 0, 0.83)",
    width: 2,
    lineDash: [4, 8],
  }),
});
const selectedRouteStyle = new Style({
  stroke: new Stroke({ color: "rgba(0, 0, 0, 1)", width: 2 }),
});
const previewRouteStyle = new Style({
  stroke: new Stroke({
    color: "rgba(0, 0, 255, 0.7)",
    width: 2,
    lineDash: [8, 8],
  }),
});
//esc hint
const hintStyle: CSSProperties = {
  position: "absolute",
  bottom: "4px",
  right: "4px",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "white",
  padding: "8px 12px",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "sans-serif",
  pointerEvents: "none",
  zIndex: 1000,
  transition: "opacity 0.3s ease-in-out",
};

const MapPanel = () => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const entitiesLayerRef = useRef<VectorLayer<any> | null>(null);
  const routeLayerRef = useRef<VectorLayer<any> | null>(null);
  const previewFeatureRef = useRef<Feature | null>(null);
  const isDraggingRef = useRef(false);

  const { entities, selectedEntityId, selectEntity } = useSimulationStore();

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;
    const entitiesSource = new VectorSource();
    entitiesLayerRef.current = new VectorLayer({ source: entitiesSource });
    const routeSource = new VectorSource();
    routeLayerRef.current = new VectorLayer({ source: routeSource });
    const previewSource = new VectorSource();
    previewFeatureRef.current = new Feature({ geometry: new LineString([]) });
    previewSource.addFeature(previewFeatureRef.current);
    const previewLayer = new VectorLayer({
      source: previewSource,
      style: previewRouteStyle,
    });
    mapRef.current = new Map({
      target: mapElement.current,
      controls: [],
      layers: [
        new TileLayer({ source: new OSM() }),
        routeLayerRef.current,
        previewLayer,
        entitiesLayerRef.current,
      ],
      // Praha
      view: new View({ center: fromLonLat([14.4378, 50.0755]), zoom: 10 }),
    });

    mapRef.current.on("pointermove", () => {
      isDraggingRef.current = false;
    });

    mapRef.current.on("pointerdrag", () => {
      isDraggingRef.current = true;
      (previewFeatureRef.current?.getGeometry() as LineString)?.setCoordinates(
        []
      );
    });

    mapRef.current.on("click", (event) => {
      if (isDraggingRef.current) {
        return;
      }
      const feature = mapRef.current?.forEachFeatureAtPixel(
        event.pixel,
        (f, layer) => (layer === entitiesLayerRef.current ? f : undefined)
      );
      const currentSelectedId = useSimulationStore.getState().selectedEntityId;
      if (feature) {
        const clickedId = feature.get("id");
        selectEntity(clickedId === currentSelectedId ? null : clickedId);
      } else if (currentSelectedId) {
        const coords = toLonLat(event.coordinate);
        sendCommand({
          type: "addWaypoint",
          payload: { entityId: currentSelectedId, point: coords },
        });
      }
    });

    mapRef.current.on("pointermove", (event) => {
      if (isDraggingRef.current) return;
      const state = useSimulationStore.getState();
      const currentSelectedEntity =
        state.entities[state.selectedEntityId || ""];
      const previewGeom =
        previewFeatureRef.current?.getGeometry() as LineString;
      if (!currentSelectedEntity || !previewGeom) {
        previewGeom?.setCoordinates([]);
        return;
      }
      const route = currentSelectedEntity.route || [];
      const startPointCoords =
        route.length > 0
          ? route[route.length - 1]
          : currentSelectedEntity.position;
      previewGeom.setCoordinates([
        fromLonLat(startPointCoords),
        event.coordinate,
      ]);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        selectEntity(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  // Unit sync
  useEffect(() => {
    if (!entitiesLayerRef.current) return;
    const source = entitiesLayerRef.current.getSource();
    source.clear();
    const features = Object.values(entities).map((entity) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(entity?.position)),
        id: entity.id,
      });
      feature.setStyle(
        entity.id === selectedEntityId
          ? createSelectedUnitStyle(entity)
          : createUnitStyle(entity)
      );
      return feature;
    });
    source.addFeatures(features);
  }, [entities, selectedEntityId]);

  // Route sync
  useEffect(() => {
    if (!routeLayerRef.current) return;
    const source = routeLayerRef.current.getSource();
    source.clear();
    const routeFeatures = Object.values(entities)
      .filter((entity) => entity.route && entity.route.length > 0)
      .map((entity) => {
        const routePoints = [entity.position, ...entity.route].map((coord) =>
          fromLonLat(coord)
        );
        const routeFeature = new Feature({
          geometry: new LineString(routePoints),
        });
        routeFeature.setStyle(
          entity.id === selectedEntityId ? selectedRouteStyle : routeStyle
        );
        return routeFeature;
      });
    source.addFeatures(routeFeatures);
  }, [entities, selectedEntityId]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapElement} style={{ width: "100%", height: "100%" }} />
      {selectedEntityId && (
        <div style={hintStyle}>
          Pro zrušení výběru stiskněte <b>ESC</b>
        </div>
      )}
    </div>
  );
};

export default MapPanel;
