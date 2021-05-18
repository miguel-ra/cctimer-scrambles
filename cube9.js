import _jsxRuntime from "react/jsx-runtime";
import RaphaelFrame from "./components/RaphaelFrame";
import { scramble } from "./cubeN";

export default {
  getRandomScramble: scramble.cube9.getRandomScramble,
  ScrambleImage: (props) =>
    /*#__PURE__*/ (0, _jsxRuntime.jsx)(RaphaelFrame, {
      ...props,
      scramble: scramble.cube9,
      width: 400,
      height: 300,
    }),
};
