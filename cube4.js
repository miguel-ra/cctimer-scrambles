import _jsxRuntime from "react/jsx-runtime";
import RaphaelFrame from "./components/RaphaelFrame";
import { scramble } from "./cubeN";

export default {
  getRandomScramble: scramble.cube4.getRandomScramble,
  ScrambleImage: (props) =>
    /*#__PURE__*/ (0, _jsxRuntime.jsx)(RaphaelFrame, {
      ...props,
      scramble: scramble.cube4,
      width: 200,
      height: 150,
    }),
};
