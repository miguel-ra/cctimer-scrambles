/* eslint-disable */
const scramble = (function () {
  function rndEl(x) {
    return x[Math.floor(Math.random() * x.length)];
  }

  function rn(n) {
    return Math.floor(Math.random() * n);
  }

  function getRandomScramble(len = 300) {
    const minxsuff = ["", "2", "'", "2'"];
    let ret = "";
    let i;
    let j;
    for (i = 0; i < Math.ceil(len / 10); i += 1) {
      for (j = 0; j < 10; j += 1) {
        ret += `${
          (j % 2 === 0 ? "Rr".charAt(rn(2)) : "Dd".charAt(rn(2))) +
          rndEl(["+ ", "++", "- ", "--"])
        } `;
      }
      ret += `y${rndEl(minxsuff)}\n`;
    }
    return {
      state: null,
      string: ret.trim(),
    };
  }

  return {
    getRandomScramble,
    drawScramble: null,
  };
})();

export default {
  getRandomScramble: scramble.getRandomScramble,
  ScrambleImage: null,
};
