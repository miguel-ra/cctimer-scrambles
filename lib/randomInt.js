/* eslint-disable */

const randomInt = function() {
  function n() {
    var n = "WARNING: randomInt is falling back to Math.random for random number generation.";
    console.warn
      ? console.warn(n)
      : console.log(n),
    e = !0
  }
  function o(n) {
    if ("number" != typeof n || 0 > n || Math.floor(n) !== n)
      throw new Error("randomInt.below() not called with a positive integer value.");
    if (n > 9007199254740992)
      throw new Error("Called randomInt.below() with max == " + n + ", which is larger than Javascript can handle with integer precision.")
  }
  function r(n) {
    o(n);
    var e = a(),
      i = Math.floor(t / n) * n;
    return i > e
      ? e % n
      : r(n)
  }
  var a,
    t = 9007199254740992,
    e = !1,
    i = window.crypto || window.msCrypto || window.cryptoUint32;
  if (i)
    a = function() {
      var n = 2097152,
        o = new Uint32Array(2);
      return i.getRandomValues(o),
      o[0] * n + (o[1] >> 21)
    };
  else {
    var l = "ERROR: randomInt could not find a suitable crypto.getRandomValues() function.";
    console.error
      ? console.error(l)
      : console.log(l),
    a = function() {
      if (e)
        return Math.floor(Math.random() * t);
      throw new Error("randomInt cannot get random values.")
    }
  }
  return {below: r, enableInsecureMathRandomFallback: n}
}();

export default randomInt;
