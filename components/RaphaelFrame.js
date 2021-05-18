import { useEffect, useState } from "react";
import _jsxRuntime from "react/jsx-runtime";

function RaphaelFrame({ scramble, randomScramble, width, height, ...props }) {
  const [element, setSelement] = (0, useState)(null);
  (0, useEffect)(() => {
    if (element) {
      scramble.drawScramble(element, randomScramble.state, width, height);
    }
  }, [element]);
  return /*#__PURE__*/ (0, _jsxRuntime.jsx)("div", {
    ref: (element) => {
      setSelement(element);
    },
    ...props,
  });
}

export default RaphaelFrame;
