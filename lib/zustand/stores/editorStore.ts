import { create } from "zustand";
import { KonvaEventObject } from "konva/lib/Node";

interface Point {
  x: number;
  y: number;
}

interface Polygon {
  points: Point[];
  isClosed: boolean;
}

interface EditorStoreState {
  activeTool: string;
  polygons: Polygon[];
  setActiveTool: (tool: string) => void;
  setPolygons: (polygons: Polygon[]) => void;
  updatePolygonPoint: (
    polygonIndex: number,
    pointIndex: number,
    newPoint: Point
  ) => void;
  onMouseDownEvent?: (e: KonvaEventObject<MouseEvent>) => void;
  setOnMouseDownEvent?: (fn: (e: KonvaEventObject<MouseEvent>) => void) => void;
}

export const useEditorStore = create<EditorStoreState>((set) => ({
  activeTool: "",
  polygons: [],
  setActiveTool: (tool) => set({ activeTool: tool }),
  setPolygons: (polygons) => set({ polygons }),
  updatePolygonPoint: (polygonIndex, pointIndex, newPoint) =>
    set((state) => {
      const updatedPolygons = state.polygons.map((polygon, index) => {
        if (index === polygonIndex) {
          const updatedPoints = polygon.points.map((point, idx) => {
            if (idx === pointIndex) {
              return newPoint;
            }
            return point;
          });
          return { ...polygon, points: updatedPoints };
        }
        return polygon;
      });
      return { polygons: updatedPolygons };
    }),
  onMouseDownEvent: () => {},
  setOnMouseDownEvent: (fn) => set(() => ({ onMouseDownEvent: fn })),
}));
