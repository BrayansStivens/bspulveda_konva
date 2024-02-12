import React, { useState, useEffect, useCallback } from "react";
import { Line, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEditorStore } from "../../../../../lib/zustand/stores/editorStore";

type Point = {
  x: number;
  y: number;
};

type Polygon = {
  points: Point[];
  isClosed: boolean;
};

const PenTool: React.FC = () => {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const activeTool = useEditorStore((state) => state.activeTool);

  const closeThreshold = 15;

  const handleCanvasClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage() && activeTool === "pen") {
        const pointerPosition = e.target.getPointerPosition();
        if (pointerPosition) {
          if (
            currentPolygon.length > 2 &&
            checkCloseToFirstPoint(pointerPosition, currentPolygon)
          ) {
            setPolygons([
              ...polygons,
              { points: currentPolygon, isClosed: true },
            ]);
            setCurrentPolygon([]);
          } else {
            setCurrentPolygon([
              ...currentPolygon,
              { x: pointerPosition.x, y: pointerPosition.y },
            ]);
          }
        }
      }
    },
    [activeTool, currentPolygon, polygons]
  );

  const checkCloseToFirstPoint = (
    pointerPosition: { x: number; y: number },
    points: Point[]
  ) => {
    const firstPoint = points[0];
    const dx = pointerPosition.x - firstPoint.x;
    const dy = pointerPosition.y - firstPoint.y;
    return Math.sqrt(dx * dx + dy * dy) < closeThreshold;
  };

  const handleDragMove =
    (pointIndex: number, polygonIndex: number) =>
    (e: KonvaEventObject<MouseEvent>) => {
      if (activeTool !== "pen") return;

      e.cancelBubble = true;

      if (polygonIndex === polygons.length) {
        const updatedPoints = currentPolygon.map((p, i) => {
          if (i === pointIndex) {
            const pos = e.target.position();
            return { x: pos.x, y: pos.y };
          }
          return p;
        });
        setCurrentPolygon(updatedPoints);
      } else {
        const newPolygons = polygons.slice();
        const newPoints = newPolygons[polygonIndex].points.slice();
        const pos = e.target.position();
        newPoints[pointIndex] = { x: pos.x, y: pos.y };
        newPolygons[polygonIndex].points = newPoints;
        setPolygons(newPolygons);
      }
    };

  const flattenedPoints = (points: Point[]) =>
    points.reduce<number[]>((acc, { x, y }) => [...acc, x, y], []);

  const handleDragStart = (e: KonvaEventObject<MouseEvent>) => {
    if (activeTool !== "pen") return;
    e.cancelBubble = true;
  };

  const handleLineClick = (pointIndex: any, polygonIndex: any, e: any) => {
    if (activeTool !== "pen") return;
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (stage) {
      const mousePos = stage.getPointerPosition();
      if (mousePos) {
        const newPolygons = polygons.map((polygon, idx) => {
          if (idx === polygonIndex) {
            const newPoints = polygon.points.slice();
            newPoints.splice(pointIndex + 1, 0, {
              x: mousePos.x,
              y: mousePos.y,
            });
            return { ...polygon, points: newPoints };
          }
          return polygon;
        });
        setPolygons(newPolygons);
      }
    }
  };

  const handlePolygonClick = (e: KonvaEventObject<MouseEvent>) => {
    if (activeTool === "pen") {
      const stage = e.target.getStage();
      const pointerPosition = stage?.getPointerPosition();

      if (pointerPosition) {
        const syntheticEvent = {
          ...e,
          target: stage,
          currentTarget: stage,
          evt: {
            ...e.evt,
            layerX: pointerPosition.x,
            layerY: pointerPosition.y,
          },
        };

        handleCanvasClick(
          syntheticEvent as unknown as KonvaEventObject<MouseEvent>
        );
      }
    }
  };

  useEffect(() => {
    if (activeTool !== "pen" && currentPolygon.length > 0) {
      setCurrentPolygon([]);
    }
  }, [activeTool, currentPolygon]);

  useEffect(() => {
    const updateMouseDownEvent: any =
      useEditorStore.getState().setOnMouseDownEvent;

    if (activeTool === "pen") {
      updateMouseDownEvent(handleCanvasClick);
    }

    return () => {
      updateMouseDownEvent(() => {});
    };
  }, [activeTool, handleCanvasClick]);

  return (
    <>
      {polygons.map((polygon, polyIndex) => (
        <React.Fragment key={polyIndex}>
          {polygon.points.map((point, pointIndex, arr) => {
            if (pointIndex < arr.length - 1) {
              const nextPoint = arr[pointIndex + 1];
              return (
                <Line
                  key={pointIndex}
                  points={[point.x, point.y, nextPoint.x, nextPoint.y]}
                  strokeWidth={20}
                  stroke={"transparent"}
                  onMouseUp={(e) => handleLineClick(pointIndex, polyIndex, e)}
                />
              );
            }
            return null;
          })}

          <Line
            points={flattenedPoints(polygon.points)}
            stroke="#333"
            strokeWidth={1.5}
            fill="transparent"
            closed={polygon.isClosed}
            onClick={handlePolygonClick}
            listening={activeTool === "pen"}
          />
          {polygon.isClosed &&
            activeTool === "pen" &&
            polygon.points.map((point, index) => (
              <Circle
                key={index}
                x={point.x}
                y={point.y}
                radius={4}
                fill="#bbb"
                stroke="#fff"
                strokeWidth={0.5}
                draggable
                onDragStart={handleDragStart}
                onDragMove={handleDragMove(index, polyIndex)}
              />
            ))}
        </React.Fragment>
      ))}

      {activeTool === "pen" && (
        <Line
          points={flattenedPoints(currentPolygon)}
          stroke="#666"
          strokeWidth={1.5}
          fill="transparent"
          lineJoin="round"
          lineCap="round"
          dash={[4, 3]}
          listening={false}
        />
      )}
      {activeTool === "pen" &&
        currentPolygon.map((point, index) => (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={4}
            fill="#777"
            stroke="#fff"
            strokeWidth={0.5}
            draggable
            onDragStart={handleDragStart}
            onDragMove={handleDragMove(index, polygons.length)}
          />
        ))}
    </>
  );
};

export default PenTool;
