import { Stage, Layer } from "react-konva";
import { useEditorStore } from "../../../../../lib/zustand/stores/editorStore";
import PenTool from "../Pen/Pen";

function Canvas() {
  const activeTool = useEditorStore((state) => state.activeTool);
  const onMouseDownEvent = useEditorStore((state) => state.onMouseDownEvent);

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDownEvent}
      >
        <Layer>
          <PenTool />
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;
