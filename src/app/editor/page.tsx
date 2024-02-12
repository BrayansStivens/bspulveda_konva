"use client";
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("./components/Canvas/Canvas"), {
  ssr: false,
});
import { NextPage } from "next";

interface Props {}

const EditorPage: NextPage<Props> = ({}) => {
  return (
    <main>
      <Canvas />
    </main>
  );
};

export default EditorPage;
