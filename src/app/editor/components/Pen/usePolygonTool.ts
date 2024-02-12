import { KonvaEventObject } from "konva/lib/Node";
import { useState, useCallback, useEffect } from "react";
export type Point = {
  x: number;
  y: number;
};

export type Polygon = {
  points: Point[];
  isClosed: boolean;
};
const usePolygonTool = (activeTool: string, closeThreshold: number = 15) => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);

  const addPointToCurrentPolygon = (point: Point) => {
    setCurrentPolygon([...currentPolygon, point]);
  };

  const closeCurrentPolygon = () => {
    if (currentPolygon.length > 2) {
      setPolygons([...polygons, { points: currentPolygon, isClosed: true }]);
      setCurrentPolygon([]);
    }
  };

  const handleCanvasClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (activeTool !== "pen") return;

      const stage = e.target.getStage();
      const pointerPosition = stage?.getPointerPosition();
      if (!pointerPosition) return;

      const isCloseToFirstPoint =
        currentPolygon.length > 0 &&
        Math.hypot(
          currentPolygon[0].x - pointerPosition.x,
          currentPolygon[0].y - pointerPosition.y
        ) < closeThreshold;

      if (isCloseToFirstPoint) {
        closeCurrentPolygon();
      } else {
        addPointToCurrentPolygon(pointerPosition);
      }
    },
    [activeTool, currentPolygon, polygons, closeThreshold]
  );

  useEffect(() => {
    if (activeTool !== "pen" && currentPolygon.length) {
      setCurrentPolygon([]);
    }
  }, [activeTool, currentPolygon.length]);

  return { polygons, currentPolygon, handleCanvasClick };
};

export default usePolygonTool;
