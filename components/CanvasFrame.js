import { useEffect, useState } from "react";
import _jsxRuntime from "react/jsx-runtime";

function CanvasFrame({ scramble, randomScramble, width, height, ...props }) {
  const [element, setSelement] = (0, useState)(null);
  (0, useEffect)(() => {
    if (element) {
      scramble.drawScramble(element, randomScramble.state);
    }
  }, [element]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", { ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("canvas", {
      width: width || "100%",
      height: height,
      ref: element => {
        setSelement(element);
      }
    })
  });
}

export default CanvasFrame;
