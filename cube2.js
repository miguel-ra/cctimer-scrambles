/*

scramble_222.js

2x2x2 Solver / Scramble Generator in Javascript.

Code taken from the official WCA scrambler.
Ported by Lucas Garron, November 23, 2011.

 */
import randomInt from "./lib/randomInt";

var posit = new Array();
function initbrd() {
  posit = new Array(
                1, 1, 1, 1,
                2, 2, 2, 2,
                5, 5, 5, 5,
                4, 4, 4, 4,
                3, 3, 3, 3,
                0, 0, 0, 0);
}
initbrd();

// ----[ This function is replaced by mix2() ]------
/*
function mix(){
    initbrd();
    for(var i=0;i<500;i++){
        var f=Math.floor(randomInt.below(3)+3) + 16*Math.floor(randomSource.random()*3);
        domove(f);
    }
}
*/

// Alternative mixing function, based on generating a random-state (by Conrad Rider)
function mix2() {
  // Fixed cubie
  const fixed = 6;
  // Generate random permutation
  const perm_src = [0, 1, 2, 3, 4, 5, 6, 7];
  const perm_sel = Array();
  for (var i = 0; i < 7; i++) {
    let ch = randomInt.below(7 - i);
    ch = perm_src[ch] === fixed ? (ch + 1) % (8 - i) : ch;
    perm_sel[i >= fixed ? i + 1 : i] = perm_src[ch];
    perm_src[ch] = perm_src[7 - i];
  }
  perm_sel[fixed] = fixed;
  // Generate random orientation
  let total = 0;
  const ori_sel = Array();
  var i = fixed === 0 ? 1 : 0;
  for (; i < 7; i = i === fixed - 1 ? i + 2 : i + 1) {
    ori_sel[i] = randomInt.below(3);
    total += ori_sel[i];
  }
  if (i <= 7) ori_sel[i] = (3 - (total % 3)) % 3;
  ori_sel[fixed] = 0;

  // Convert to face format
  // Mapping from permutation/orientation to facelet
  let D = 1,
    L = 2,
    B = 5,
    U = 4,
    R = 3,
    F = 0;
  // D 0 1 2 3  L 4 5 6 7  B 8 9 10 11  U 12 13 14 15  R 16 17 18 19  F 20 21 22 23
  // Map from permutation/orientation to face
  const fmap = [
    [U, R, F],
    [U, B, R],
    [U, L, B],
    [U, F, L],
    [D, F, R],
    [D, R, B],
    [D, B, L],
    [D, L, F],
  ];
  // Map from permutation/orientation to facelet identifier
  const pos = [
    [15, 16, 21],
    [13, 9, 17],
    [12, 5, 8],
    [14, 20, 4],
    [3, 23, 18],
    [1, 19, 11],
    [0, 10, 7],
    [2, 6, 22],
  ];
  // Convert cubie representation into facelet representaion
  for (var i = 0; i < 8; i++) {
    for (let j = 0; j < 3; j++) {
      posit[pos[i][(ori_sel[i] + j) % 3]] = fmap[perm_sel[i]][j];
    }
  }
}
// ----- [End of alternative mixing function]--------------

const piece = new Array(15, 16, 16, 21, 21, 15, 13, 9, 9, 17, 17, 13, 14, 20, 20, 4, 4, 14, 12, 5, 5, 8, 8, 12,
  3, 23, 23, 18, 18, 3, 1, 19, 19, 11, 11, 1, 2, 6, 6, 22, 22, 2, 0, 10, 10, 7, 7, 0);
const adj = new Array();
adj[0] = new Array();
adj[1] = new Array();
adj[2] = new Array();
adj[3] = new Array();
adj[4] = new Array();
adj[5] = new Array();
const opp = new Array();
let auto;
let tot;
function calcadj() {
  // count all adjacent pairs (clockwise around corners)
  let a, b;
  for (a = 0; a < 6; a++) for (b = 0; b < 6; b++) adj[a][b] = 0;
  for (a = 0; a < 48; a += 2) {
    if (posit[piece[a]] <= 5 && posit[piece[a + 1]] <= 5) {
      adj[posit[piece[a]]][posit[piece[a + 1]]]++;
    }
  }
}
const sol = new Array();
function solve() {
  calcadj();
  const opp = new Array();
  for (a = 0; a < 6; a++) {
    for (b = 0; b < 6; b++) {
      if (a != b && adj[a][b] + adj[b][a] === 0) {
        opp[a] = b;
        opp[b] = a;
      }
    }
  }
  // Each piece is determined by which of each pair of opposite colours it uses.
  const ps = new Array();
  const tws = new Array();
  var a = 0;
  for (let d = 0; d < 7; d++) {
    let p = 0;
    for (b = a; b < a + 6; b += 2) {
      if (posit[piece[b]] === posit[piece[42]]) p += 4;
      if (posit[piece[b]] === posit[piece[44]]) p += 1;
      if (posit[piece[b]] === posit[piece[46]]) p += 2;
    }
    ps[d] = p;
    if (
      posit[piece[a]] === posit[piece[42]] ||
      posit[piece[a]] === opp[posit[piece[42]]]
    )
      tws[d] = 0;
    else if (
      posit[piece[a + 2]] === posit[piece[42]] ||
      posit[piece[a + 2]] === opp[posit[piece[42]]]
    )
      tws[d] = 1;
    else tws[d] = 2;
    a += 6;
  }
  // convert position to numbers
  let q = 0;
  for (var a = 0; a < 7; a++) {
    var b = 0;
    for (let c = 0; c < 7; c++) {
      if (ps[c] === a) break;
      if (ps[c] > a) b++;
    }
    q = q * (7 - a) + b;
  }
  let t = 0;
  for (var a = 5; a >= 0; a--) {
    t = t * 3 + tws[a] - 3 * Math.floor(tws[a] / 3);
  }
  if (q != 0 || t != 0) {
    sol.length = 0;
    for (let l = seqlen; l < 100; l++) {
      if (search(0, q, t, l, -1)) break;
    }
    t = "";
    for (q = 0; q < sol.length; q++) {
      t = `${"URF".charAt(sol[q] / 10) + "'2 ".charAt(sol[q] % 10)} ${t}`;
    }
    return t;
  }
}
function search(d, q, t, l, lm) {
  // searches for solution, from position q|t, in l moves exactly. last move was lm, current depth=d
  if (l === 0) {
    if (q === 0 && t === 0) {
      return true;
    }
  } else {
    if (perm[q] > l || twst[t] > l) return false;
    let p, s, a, m;
    for (m = 0; m < 3; m++) {
      if (m != lm) {
        p = q;
        s = t;
        for (a = 0; a < 3; a++) {
          p = permmv[p][m];
          s = twstmv[s][m];
          sol[d] = 10 * m + a;
          if (search(d + 1, p, s, l - 1, m)) return true;
        }
      }
    }
  }
  return false;
}
var perm = new Array();
var twst = new Array();
var permmv = new Array();
var twstmv = new Array();
function calcperm() {
  // calculate solving arrays
  // first permutation

  for (var p = 0; p < 5040; p++) {
    perm[p] = -1;
    permmv[p] = new Array();
    for (var m = 0; m < 3; m++) {
      permmv[p][m] = getprmmv(p, m);
    }
  }

  perm[0] = 0;
  for (var l = 0; l <= 6; l++) {
    var n = 0;
    for (var p = 0; p < 5040; p++) {
      if (perm[p] === l) {
        for (var m = 0; m < 3; m++) {
          var q = p;
          for (var c = 0; c < 3; c++) {
            var q = permmv[q][m];
            if (perm[q] === -1) {
              perm[q] = l + 1;
              n++;
            }
          }
        }
      }
    }
  }

  // then twist
  for (var p = 0; p < 729; p++) {
    twst[p] = -1;
    twstmv[p] = new Array();
    for (var m = 0; m < 3; m++) {
      twstmv[p][m] = gettwsmv(p, m);
    }
  }

  twst[0] = 0;
  for (var l = 0; l <= 5; l++) {
    var n = 0;
    for (var p = 0; p < 729; p++) {
      if (twst[p] === l) {
        for (var m = 0; m < 3; m++) {
          var q = p;
          for (var c = 0; c < 3; c++) {
            var q = twstmv[q][m];
            if (twst[q] === -1) {
              twst[q] = l + 1;
              n++;
            }
          }
        }
      }
    }
  }
  // remove wait sign
}
function getprmmv(p, m) {
  // given position p<5040 and move m<3, return new position number
  let a, b, c, q;
  // convert number into array;
  const ps = new Array();
  q = p;
  for (a = 1; a <= 7; a++) {
    b = q % a;
    q = (q - b) / a;
    for (c = a - 1; c >= b; c--) ps[c + 1] = ps[c];
    ps[b] = 7 - a;
  }
  // perform move on array
  if (m === 0) {
    // U
    c = ps[0];
    ps[0] = ps[1];
    ps[1] = ps[3];
    ps[3] = ps[2];
    ps[2] = c;
  } else if (m === 1) {
    // R
    c = ps[0];
    ps[0] = ps[4];
    ps[4] = ps[5];
    ps[5] = ps[1];
    ps[1] = c;
  } else if (m === 2) {
    // F
    c = ps[0];
    ps[0] = ps[2];
    ps[2] = ps[6];
    ps[6] = ps[4];
    ps[4] = c;
  }
  // convert array back to number
  q = 0;
  for (a = 0; a < 7; a++) {
    b = 0;
    for (c = 0; c < 7; c++) {
      if (ps[c] === a) break;
      if (ps[c] > a) b++;
    }
    q = q * (7 - a) + b;
  }
  return q;
}
function gettwsmv(p, m) {
  // given orientation p<729 and move m<3, return new orientation number
  let a, b, c, d, q;
  // convert number into array;
  const ps = new Array();
  q = p;
  d = 0;
  for (a = 0; a <= 5; a++) {
    c = Math.floor(q / 3);
    b = q - 3 * c;
    q = c;
    ps[a] = b;
    d -= b;
    if (d < 0) d += 3;
  }
  ps[6] = d;
  // perform move on array
  if (m === 0) {
    // U
    c = ps[0];
    ps[0] = ps[1];
    ps[1] = ps[3];
    ps[3] = ps[2];
    ps[2] = c;
  } else if (m === 1) {
    // R
    c = ps[0];
    ps[0] = ps[4];
    ps[4] = ps[5];
    ps[5] = ps[1];
    ps[1] = c;
    ps[0] += 2;
    ps[1]++;
    ps[5] += 2;
    ps[4]++;
  } else if (m === 2) {
    // F
    c = ps[0];
    ps[0] = ps[2];
    ps[2] = ps[6];
    ps[6] = ps[4];
    ps[4] = c;
    ps[2] += 2;
    ps[0]++;
    ps[4] += 2;
    ps[6]++;
  }
  // convert array back to number
  q = 0;
  for (a = 5; a >= 0; a--) {
    q = q * 3 + (ps[a] % 3);
  }
  return q;
}

// Default settings
const size = 2;
var seqlen = 0;
const colorString = "yobwrg"; // In dlburf order. May use any colours in colorList below

// list of available colours
const colorList = new Array(
  "y",
  "yellow.jpg",
  "yellow",
  "b",
  "blue.jpg",
  "blue",
  "r",
  "red.jpg",
  "red",
  "w",
  "white.jpg",
  "white",
  "g",
  "green.jpg",
  "green",
  "o",
  "orange.jpg",
  "orange",
  "p",
  "purple.jpg",
  "purple",
  "0",
  "grey.jpg",
  "grey" // used for unrecognised letters, or when zero used.
);

const colors = new Array(); // stores colours used
var posit = new Array(); // facelet array
let flat2posit; // lookup table for drawing cube
const colorPerm = new Array(); // dlburf face colour permutation for each cube orientation
colorPerm[0] = new Array(5, 0, 1, 4, 3, 2);

// get all the form settings from the url parameters
function parse() {
  /*
  var s="";
  var urlquery=location.href.split("?")
  if(urlquery.length>1){
    var urlterms=urlquery[1].split("&")
    for( var i=0; i<urlterms.length; i++){
      var urllr=urlterms[i].split("=");
      if(urllr[0]==="len") {
        if(urllr[1]-0 >= 1 ) seqlen=urllr[1]-0;
      } else if(urllr[0]==="num"){
        if(urllr[1]-0 >= 1 ) numcub=urllr[1]-0;
      } else if(urllr[0]==="col") {
        if(urllr[1].length===6) colorString = urllr[1];
      }
    }
  }
  */

  // expand colour string into 6 actual html color names
  for (let k = 0; k < 6; k++) {
    colors[k] = colorList.length - 3; // gray
    for (let i = 0; i < colorList.length; i += 3) {
      if (colorString.charAt(k) === colorList[i]) {
        colors[k] = i;
        break;
      }
    }
  }
}

const initialized = false;

// generate sequence of scambles
function initialize() {
  if (!initialized) {
    let i, j;
    // build lookup table
    flat2posit = new Array(12 * size * size);
    for (i = 0; i < flat2posit.length; i++) flat2posit[i] = -1;
    for (i = 0; i < size; i++) {
      for (j = 0; j < size; j++) {
        flat2posit[4 * size * (3 * size - i - 1) + size + j] = i * size + j; // D
        flat2posit[4 * size * (size + i) + size - j - 1] =
          (size + i) * size + j; // L
        flat2posit[4 * size * (size + i) + 4 * size - j - 1] =
          (2 * size + i) * size + j; // B
        flat2posit[4 * size * i + size + j] = (3 * size + i) * size + j; // U
        flat2posit[4 * size * (size + i) + 2 * size + j] =
          (4 * size + i) * size + j; // R
        flat2posit[4 * size * (size + i) + size + j] =
          (5 * size + i) * size + j; // F
      }
    }
  }

  /*
        19                32
    16           48           35
        31   60      51   44
    28     80    63    67     47
              83  64
          92          79
              95  76

                  0
              12     3
                15
*/
}

const generateScramble = function () {
  initializeFull();

  mix2();
  const solution = solve();

  return {
    state: posit.join(''),
    text: solution.trim(),
  };
};

let drawingInitialized = false;

var initializeDrawing = function (continuation) {
  if (!drawingInitialized) {
    calcperm();
    parse();
    initialize();

    drawingInitialized = true;
  }

  if (continuation) {
    setTimeout(continuation, 0);
  }
};

var initializeFull = function (continuation, _) {
  initializeDrawing();

  if (continuation) {
    setTimeout(continuation, 0);
  }
};

export default generateScramble;
