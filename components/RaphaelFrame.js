import { useEffect, useState } from "react";
import _jsxRuntime from "react/jsx-runtime";

function RaphaelFrame({ scramble, randomScramble, width, height, ...props }) {
  const [element, setSelement] = (0, useState)(null);
  (0, useEffect)(() => {
    if (element) {
      element.innerHTML = "";
      scramble.drawScramble(element, randomScramble.state, width, height);
    }
  }, [element, randomScramble, width, height]);
  return /*#__PURE__*/ (0, _jsxRuntime.jsx)("div", {
    ref: (elementRef) => {
      if (!element && elementRef) {
        setSelement(elementRef);
      }
    },
    ...props,
  });
}

export default RaphaelFrame;
