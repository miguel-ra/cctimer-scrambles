/* Base script written by Jaap Scherphuis, jaapsch a t yahoo d o t com */
/* Javascript written by Syoji Takamatsu, , red_dragon a t honki d o t net */
/* Random-State modification by Lucas Garron (lucasg a t gmx d o t de / garron.us) in collaboration with Michael Gottlieb (mzrg.com) */
/* Optimal modification by Michael Gottlieb (qqwref a t gmail d o t com) from Jaap's code */
/* Version 1.0 */

import randomInt from "./lib/randomInt";

var numcub = 1;

var colorString = "xgryb"; //In dlburf order. May use any colours in colorList below

// list of available colours
var colorList = [
  "g",
  "r",
  "y",
  "b",
  "w",
  "o",
  "p",
  "0",
  "grey", // used for unrecognised letters, or when zero used.
];
// layout
var layout = [
  1, 2, 1, 2, 1, 0, 2, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1, 0,
  0, 0, 1, 0, 2, 1, 2, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
];

var colmap = []; // color map
var colors = []; //stores colours used
var scramblestring = [];

function parse() {
  // expand colour string into 6 actual html color names
  for (var k = 0; k < 6; k++) {
    colors[k + 1] = colorList.length - 3; // gray
    for (var i = 0; i < colorList.length; i += 3) {
      if (colorString.charAt(k) == colorList[i]) {
        colors[k + 1] = i; // not use index 0
        break;
      }
    }
  }
}
parse();

function init_colors(n) {
  colmap[n] = [
    1, 1, 1, 1, 1, 0, 2, 0, 3, 3, 3, 3, 3, 0, 1, 1, 1, 0, 2, 2, 2, 0, 3, 3, 3,
    0, 0, 0, 1, 0, 2, 2, 2, 2, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0,
  ];
}

function scramble() {
  var i, j, n, ls, t;

  for (n = 0; n < numcub; n++) {
    initbrd();
    dosolve();

    scramblestring[n] = "";
    init_colors(n);
    for (i = 0; i < sol.length; i++) {
      scramblestring[n] +=
        ["U", "L", "R", "B"][sol[i] & 7] + ["", "'"][(sol[i] & 8) / 8] + " ";
      picmove([3, 0, 1, 2][sol[i] & 7], 1 + (sol[i] & 8) / 8, n);
    }
    var tips = ["l", "r", "b", "u"];
    for (i = 0; i < 4; i++) {
      var j = randomInt.below(3);
      if (j < 2) {
        scramblestring[n] += tips[i] + ["", "'"][j] + " ";
        picmove(4 + i, 1 + j, n);
      }
    }
  }
}
var mode;
var perm = []; // pruning table for edge permutation
var twst = []; // pruning table for edge orientation+twist
var permmv = []; // transition table for edge permutation
var twstmv = []; // transition table for edge orientation+twist
var sol = [];
var pcperm = [];
var pcori = [];
var soltimer;

function initbrd() {
  if (mode == 4) clearTimeout(soltimer);
  mode = 0;
  sol.length = 0;
}

var edges = [2, 11, 1, 20, 4, 31, 10, 19, 13, 29, 22, 28];

var movelist = [];
movelist[0] = [0, 18, 9, 6, 24, 15, 1, 19, 11, 2, 20, 10]; //U
movelist[1] = [23, 3, 30, 26, 7, 34, 22, 1, 31, 20, 4, 28]; //L
movelist[2] = [5, 14, 32, 8, 17, 35, 4, 11, 29, 2, 13, 31]; //R
movelist[3] = [12, 21, 27, 16, 25, 33, 13, 19, 28, 10, 22, 29]; //B

function dosolve() {
  var a,
    b,
    c,
    l,
    t = 0,
    q = 0;
  // Get a random permutation and orientation.
  var parity = 0;
  pcperm = [0, 1, 2, 3, 4, 5];
  for (var i = 0; i < 4; i++) {
    var other = i + randomInt.below(6 - i);
    var temp = pcperm[i];
    pcperm[i] = pcperm[other];
    pcperm[other] = temp;
    if (i != other) parity++;
  }
  if (parity % 2 == 1) {
    var temp = pcperm[4];
    pcperm[4] = pcperm[5];
    pcperm[5] = temp;
  }
  parity = 0;
  pcori = [];
  for (var i = 0; i < 5; i++) {
    pcori[i] = randomInt.below(2);
    parity += pcori[i];
  }
  pcori[5] = parity % 2;
  for (var i = 6; i < 10; i++) {
    pcori[i] = randomInt.below(3);
  }

  for (a = 0; a < 6; a++) {
    b = 0;
    for (c = 0; c < 6; c++) {
      if (pcperm[c] == a) break;
      if (pcperm[c] > a) b++;
    }
    q = q * (6 - a) + b;
  }
  //corner orientation
  for (a = 9; a >= 6; a--) {
    t = t * 3 + pcori[a];
  }
  //edge orientation
  for (a = 4; a >= 0; a--) {
    t = t * 2 + pcori[a];
  }

  // solve it
  if (q != 0 || t != 0) {
    for (l = 7; l < 12; l++) {
      //allow solutions from 7 through 11 moves
      if (search(q, t, l, -1)) break;
    }
  }
}

function search(q, t, l, lm) {
  //searches for solution, from position q|t, in l moves exactly. last move was lm, current depth=d
  if (l == 0) {
    if (q == 0 && t == 0) {
      return true;
    }
  } else {
    if (perm[q] > l || twst[t] > l) return false;
    var p, s, a, m;
    for (m = 0; m < 4; m++) {
      if (m != lm) {
        p = q;
        s = t;
        for (a = 0; a < 2; a++) {
          p = permmv[p][m];
          s = twstmv[s][m];
          sol[sol.length] = m + 8 * a;
          if (search(p, s, l - 1, m)) return true;
          sol.length--;
        }
      }
    }
  }
  return false;
}

function calcperm() {
  var c, p, q, l, m, n;
  //calculate solving arrays
  //first permutation
  // initialise arrays
  for (p = 0; p < 720; p++) {
    perm[p] = -1;
    permmv[p] = [];
    for (m = 0; m < 4; m++) {
      permmv[p][m] = getprmmv(p, m);
    }
  }
  //fill it
  perm[0] = 0;
  for (l = 0; l <= 6; l++) {
    n = 0;
    for (p = 0; p < 720; p++) {
      if (perm[p] == l) {
        for (m = 0; m < 4; m++) {
          q = p;
          for (c = 0; c < 2; c++) {
            q = permmv[q][m];
            if (perm[q] == -1) {
              perm[q] = l + 1;
              n++;
            }
          }
        }
      }
    }
  }
  //then twist
  // initialise arrays
  for (p = 0; p < 2592; p++) {
    twst[p] = -1;
    twstmv[p] = [];
    for (m = 0; m < 4; m++) {
      twstmv[p][m] = gettwsmv(p, m);
    }
  }
  //fill it
  twst[0] = 0;
  for (l = 0; l <= 5; l++) {
    n = 0;
    for (p = 0; p < 2592; p++) {
      if (twst[p] == l) {
        for (m = 0; m < 4; m++) {
          q = p;
          for (c = 0; c < 2; c++) {
            q = twstmv[q][m];
            if (twst[q] == -1) {
              twst[q] = l + 1;
              n++;
            }
          }
        }
      }
    }
  }
}

function getprmmv(p, m) {
  //given position p<720 and move m<4, return new position number

  //convert number into array
  var a, b, c;
  var ps = [];
  var q = p;
  for (a = 1; a <= 6; a++) {
    c = Math.floor(q / a);
    b = q - a * c;
    q = c;
    for (c = a - 1; c >= b; c--) ps[c + 1] = ps[c];
    ps[b] = 6 - a;
  }
  //perform move on array
  if (m == 0) {
    //U
    cycle3(ps, 0, 3, 1);
  } else if (m == 1) {
    //L
    cycle3(ps, 1, 5, 2);
  } else if (m == 2) {
    //R
    cycle3(ps, 0, 2, 4);
  } else if (m == 3) {
    //B
    cycle3(ps, 3, 4, 5);
  }
  //convert array back to number
  q = 0;
  for (a = 0; a < 6; a++) {
    b = 0;
    for (c = 0; c < 6; c++) {
      if (ps[c] == a) break;
      if (ps[c] > a) b++;
    }
    q = q * (6 - a) + b;
  }
  return q;
}
function gettwsmv(p, m) {
  //given position p<2592 and move m<4, return new position number

  //convert number into array;
  var a,
    b,
    c,
    d = 0;
  var ps = [];
  var q = p;

  //first edge orientation
  for (a = 0; a <= 4; a++) {
    ps[a] = q & 1;
    q >>= 1;
    d ^= ps[a];
  }
  ps[5] = d;

  //next corner orientation
  for (a = 6; a <= 9; a++) {
    c = Math.floor(q / 3);
    b = q - 3 * c;
    q = c;
    ps[a] = b;
  }

  //perform move on array
  if (m == 0) {
    //U
    ps[6]++;
    if (ps[6] == 3) ps[6] = 0;
    cycle3(ps, 0, 3, 1);
    ps[1] ^= 1;
    ps[3] ^= 1;
  } else if (m == 1) {
    //L
    ps[7]++;
    if (ps[7] == 3) ps[7] = 0;
    cycle3(ps, 1, 5, 2);
    ps[2] ^= 1;
    ps[5] ^= 1;
  } else if (m == 2) {
    //R
    ps[8]++;
    if (ps[8] == 3) ps[8] = 0;
    cycle3(ps, 0, 2, 4);
    ps[0] ^= 1;
    ps[2] ^= 1;
  } else if (m == 3) {
    //B
    ps[9]++;
    if (ps[9] == 3) ps[9] = 0;
    cycle3(ps, 3, 4, 5);
    ps[3] ^= 1;
    ps[4] ^= 1;
  }
  //convert array back to number
  q = 0;
  //corner orientation
  for (a = 9; a >= 6; a--) {
    q = q * 3 + ps[a];
  }
  //corner orientation
  for (a = 4; a >= 0; a--) {
    q = q * 2 + ps[a];
  }
  return q;
}

function picmove(type, direction, n) {
  switch (type) {
    case 0: // L
      rotate3(n, 14, 58, 18, direction);
      rotate3(n, 15, 57, 31, direction);
      rotate3(n, 16, 70, 32, direction);
      rotate3(n, 30, 28, 56, direction);
      break;
    case 1: // R
      rotate3(n, 32, 72, 22, direction);
      rotate3(n, 33, 59, 23, direction);
      rotate3(n, 20, 58, 24, direction);
      rotate3(n, 34, 60, 36, direction);
      break;
    case 2: // B
      rotate3(n, 14, 10, 72, direction);
      rotate3(n, 1, 11, 71, direction);
      rotate3(n, 2, 24, 70, direction);
      rotate3(n, 0, 12, 84, direction);
      break;
    case 3: // U
      rotate3(n, 2, 18, 22, direction);
      rotate3(n, 3, 19, 9, direction);
      rotate3(n, 16, 20, 10, direction);
      rotate3(n, 4, 6, 8, direction);
      break;
    case 4: // l
      rotate3(n, 30, 28, 56, direction);
      break;
    case 5: // r
      rotate3(n, 34, 60, 36, direction);
      break;
    case 6: // b
      rotate3(n, 0, 12, 84, direction);
      break;
    case 7: // u
      rotate3(n, 4, 6, 8, direction);
      break;
  }
}

function rotate3(n, v1, v2, v3, clockwise) {
  if (clockwise == 2) {
    cycle3(colmap[n], v3, v2, v1);
  } else {
    cycle3(colmap[n], v1, v2, v3);
  }
}

function cycle3(arr, i1, i2, i3) {
  var c = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = arr[i3];
  arr[i3] = c;
}

/* Methods added by Lucas. */

var generateScramble = function () {
  initializeFull();
  scramble();

  return {
    state: colmap[0].filter(function(col) { return col !== 0}).join(""),
    text: scramblestring[0].trim(),
  };
};

var initialized = false;

var initializeFull = function (continuation, _) {
  if (initialized) {
    return;
  }
  initialized = true;

  parse();
  calcperm();

  if (continuation) {
    setTimeout(continuation, 0);
  }
};

export default generateScramble;
