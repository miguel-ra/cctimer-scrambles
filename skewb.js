/* Port by Caleb Hoover from Shuang Chen's skewb scrambler.
  Source: https://github.com/cubing/qqTimer/blob/mzrg/index.htm#L2158
  Designed to work with Scrambo
*/
var colmap = new Array();

var randomSource = Math;
var setRandomSource = function (src) {
  randomSource = src;
};
var length = 11;
var setScrambleLength = function (len) {
  length = len;
};

var initialize = function (iniRandomSource) {
  randomSource = iniRandomSource;
};

function rotate3(s1, s2, s3, clockwise) {
  var tmp;

  if (clockwise == 1) {
    tmp = colmap[s3];
    colmap[s3] = colmap[s2];
    colmap[s2] = colmap[s1];
    colmap[s1] = tmp;
  } else {
    tmp = colmap[s1];
    colmap[s1] = colmap[s2];
    colmap[s2] = colmap[s3];
    colmap[s3] = tmp;
  }
}

function L(clockwise) {
  rotate3(5, 20, 25, clockwise);
  rotate3(8, 24, 26, clockwise);
  rotate3(6, 23, 27, clockwise);
  rotate3(9, 22, 28, clockwise);
  rotate3(13, 3, 19, clockwise);
}

function U(clockwise) {
  rotate3(0, 15, 20, clockwise);
  rotate3(1, 17, 21, clockwise);
  rotate3(3, 16, 23, clockwise);
  rotate3(2, 19, 22, clockwise);
  rotate3(6, 12, 28, clockwise);
}

function R(clockwise) {
  rotate3(10, 25, 15, clockwise);
  rotate3(14, 29, 18, clockwise);
  rotate3(12, 27, 19, clockwise);
  rotate3(13, 28, 16, clockwise);
  rotate3(9, 23, 2, clockwise);
}

function B(clockwise) {
  rotate3(15, 25, 20, clockwise);
  rotate3(1, 14, 8, clockwise);
  rotate3(17, 29, 24, clockwise);
  rotate3(18, 26, 21, clockwise);
  rotate3(19, 28, 23, clockwise);
}

function generateScramble() {
  function t(e) {
    var t = arguments.length - 1,
      n = e[arguments[t]];
    for (var r = t; r > 1; r--) {
      e[arguments[r]] = e[arguments[r - 1]];
    }
    e[arguments[1]] = n;
  }

  function n(e, t) {
    return (e[t >> 3] >> ((t & 7) << 2)) & 15;
  }

  function r(e, t, n, r) {
    for (var i = 0; i < r; i++) {
      e[i] = [];
      for (var s = 0; s < t; s++) {
        e[i][s] = n(s, i);
      }
    }
  }

  function i(e, t, r, i, s, o, u) {
    var a = Array.isArray(s);
    for (var f = 0, l = (r + 7) >>> 3; f < l; f++) {
      e[f] = -1;
    }
    e[t >> 3] ^= 15 << ((t & 7) << 2);
    for (var c = 0; c <= i; c++) {
      var h = (c + 1) ^ 15;
      for (var p = 0; p < r; p++) {
        if (n(e, p) == c) {
          for (var d = 0; d < o; d++) {
            var v = p;
            for (var m = 0; m < u; m++) {
              v = a ? s[d][v] : s(v, d);
              if (n(e, v) == 15) {
                e[v >> 3] ^= h << ((v & 7) << 2);
              }
            }
          }
        }
      }
    }
  }

  function s(e, t, r, i, o) {
    if (0 == r) return 0 == e && 0 == t;
    if (n(a, e) > r || n(f, t) > r) return !1;
    for (var u = 0; 4 > u; u++)
      if (u != i)
        for (var h = e, p = t, d = 0; 2 > d; d++)
          if (((h = l[u][h]), (p = c[u][p]), s(h, p, r - 1, u, o)))
            return o.push(u * 2 + (1 - d)), !0;
    return !1;
  }

  function o(e, n) {
    var r = e % 12;
    e = ~~(e / 12);
    for (var i = [], s = 5517840, o = 0, u = 0; 5 > u; u++) {
      var a = h[5 - u],
        f = ~~(e / a),
        e = e - f * a,
        o = o ^ f,
        f = f << 2;
      i[u] = (s >> f) & 15;
      a = (1 << f) - 1;
      s = (s & a) + ((s >> 4) & ~a);
    }
    0 == (o & 1) ? (i[5] = s) : ((i[5] = i[4]), (i[4] = s));
    0 == n && t(i, 0, 3, 1);
    2 == n && t(i, 1, 5, 2);
    1 == n && t(i, 0, 2, 4);
    3 == n && t(i, 3, 4, 5);
    e = 0;
    s = 5517840;
    for (u = 0; 4 > u; u++)
      (f = i[u] << 2), (e *= 6 - u), (e += (s >> f) & 15), (s -= 1118480 << f);
    return e * 12 + p[r][n];
  }

  function u(e, t) {
    var n = [];
    var r = [];
    for (var i = 0; i < 4; i++) {
      n[i] = e % 3;
      e = ~~(e / 3);
    }
    for (var i = 0; i < 3; i++) {
      r[i] = e % 3;
      e = ~~(e / 3);
    }
    r[3] = (6 - r[0] - r[1] - r[2]) % 3;
    n[t] = (n[t] + 1) % 3;
    var s;
    if (t == 0) {
      var s = r[0];
      r[0] = r[2] + 2;
      r[2] = r[1] + 2;
      r[1] = s + 2;
    } else if (t == 1) {
      var s = r[0];
      r[0] = r[1] + 2;
      r[1] = r[3] + 2;
      r[3] = s + 2;
    } else if (t == 2) {
      var s = r[0];
      r[0] = r[3] + 2;
      r[3] = r[2] + 2;
      r[2] = s + 2;
    } else if (t == 3) {
      var s = r[1];
      r[1] = r[2] + 2;
      r[2] = r[3] + 2;
      r[3] = s + 2;
    }
    for (var i = 2; i >= 0; i--) {
      e = e * 3 + (r[i] % 3);
    }
    for (var i = 3; i >= 0; i--) {
      e = e * 3 + n[i];
    }
    return e;
  }

  colmap = new Array(
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5
  );

  var a = [],
    f = [],
    l = [],
    c = [];
  var h = [1, 1, 1, 3, 12, 60, 360];
  var p = [
    [6, 5, 10, 1],
    [9, 7, 4, 2],
    [3, 11, 8, 0],
    [10, 1, 6, 5],
    [0, 8, 11, 3],
    [7, 9, 2, 4],
    [4, 2, 9, 7],
    [11, 3, 0, 8],
    [1, 10, 5, 6],
    [8, 0, 3, 11],
    [2, 4, 7, 9],
    [5, 6, 1, 10],
  ];
  var d = [0, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 0];
  var v,
    m,
    y = [];
  r(l, 4320, o, 4);
  i(a, 0, 4320, 7, l, 4, 2);
  r(c, 2187, u, 4);
  i(f, 0, 2187, 6, c, 4, 2);
  do {
    v = 0 | (randomSource.random() * 4320);
    m = 0 | (randomSource.random() * 2187);
  } while (
    (v == 0 && m == 0) ||
    d[v % 12] != (m + ~~(m / 3) + ~~(m / 9) + ~~(m / 27)) % 3
  );
  for (; 99 > length && !s(v, m, length, -1, y); length++) {}

  var scramble = [];
  var w = ["L", "R", "B", "U"];
  for (var u = 0; u < y.length; u++) {
    var E = y[u] >> 1;
    var S = y[u] & 1;
    if (E == 2) {
      for (var l = 0; l <= S; l++) {
        var x = w[0];
        w[0] = w[1];
        w[1] = w[3];
        w[3] = x;
      }
    }
    scramble.push(w[E] + (S == 1 ? "'" : ""));
    scrambleColor(w[E], S);
  }

  return {
    state: colmap.join(''),
    text: scramble.join(" ").trim(),
  };
}

function scrambleColor(letter, clockwise) {
  switch (letter) {
    case "B":
      B(clockwise);
      break;
    case "U":
      U(clockwise);
      break;
    case "R":
      R(clockwise);
      break;
    case "L":
      L(clockwise);
      break;
    default:
      return false;
  }
}

export default generateScramble;
