
// initialise graph
let data, layout;
const lineCoord = 0;
const origin = [2, lineCoord];
var massCoordx = origin[0];
var massCoordy = origin[1];
var m = 1, c = 0, k = 1;
var forceG = 0.25;
var dt = math.PI/24;

const maxlen = 512;
const graphlen = maxlen;
var rDeque = new Deque(maxlen);
var rdotDeque = new Deque(maxlen);
var rdotdotDeque = new Deque(maxlen);
var gDeque = new Deque(maxlen);
var amp = 5;
var rAmp = 0.2;

var stepNo = 0;
var prevW = 0;
var omega = 0.1;
let rsrc;

let rdot, rdotdot;

let graphContainer;
let startAnim;

let springlen, springx, springy
updateSpring();

data = [{
    x: springx,
    y: springy,
    type: 'scatter',
    mode: 'line + markers',
    line: {color: 'black'},
    marker: {color: 'transparent', size: 0, opacity: 0},
    connectgaps: false,
  }, {
    x: massCoordx,
    y: massCoordy,
    type: 'scatter',
    mode: 'markers',
    marker: {color: 'blue', size: 50, symbol: 'square'},
    connectgaps: false,
  }];

layout = {
  autosize: true,
  width: 800,
  height: 200,
  plot_bgcolor:"#F4F4F4",
  paper_bgcolor:"#F4F4F4",
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0,
    pad: 4,
  },
  xaxis: {
    range: [-0.5,6.5],
    showgrid: false,
    zeroline: false,
    showline: false,
    autotick: false,
    ticks: '',
    showticklabels: false,
    fixedrange: true,
  },
  yaxis: {
    range: [-1,1],
    showgrid: false,
    zeroline: false,
    showline: false,
    autotick: false,
    ticks: '',
    showticklabels: false,
    fixedrange: true,
  },
  showlegend: false,
  hovermode: false,
}

var annotations = [{
  x: 1,
  y: 0.4,
  xref: 'x',
  yref: 'y',
  text: "$k, c$",
  font: {color: "black", size: 20},
  showarrow: true,
  arrowcolor: 'transparent',
  arrowhead: 2,
  arrowsize: 0,
  ax: 0,
  ay: 0,
}, {
  x: 2,
  y: 0.4,
  xref: 'x',
  yref: 'y',
  text: "$m$",
  font: {color: "black", size: 20},
  showarrow: true,
  arrowcolor: 'transparent',
  arrowhead: 2,
  arrowsize: 0,
  ax: 0,
  ay: 0,
},  {
  x: 2.6,
  y: -.5,
  xref: 'x',
  yref: 'y',
  showarrow: true,
  arrowcolor: 'black',
  arrowhead: 2,
  arrowsize: 1,
  ax: -10,
  ay: 0,
}, {
  x: 3.4,
  y: -0.5,
  xref: 'x',
  yref: 'y',
  text: "$r, R=R_0 sin{\omega t}$",
  font: {color: "black", size: 20},
  showarrow: true,
  arrowcolor: 'transparent',
  arrowhead: 2,
  arrowsize: 0,
  ax: 0,
  ay: 0,
}]

var wallOnly = [{
  type: "line",
  x0: -0,
  y0: -0.2,
  x1: -0,
  y1: 0.2,
  line: {
    color: "black",
    width: 5,
  }
}];

var shapes = [{ // wall
  type: "line",
  x0: 0,
  y0: -0.2,
  x1: 0,
  y1: 0.2,
  line: {
    color: "black",
    width: 5,
  }
}, { // line 1
  type: "line",
  x0: 2,
  y0: -.3,
  x1: 2,
  y1: -.5,
  line: {
    color: "black",
    width: 2,
  }
}, {
  type: "line",
  x0: 2,
  y0: -.5,
  x1: 2.5,
  y1: -.5,
  line: {
    color: "black",
    width: 2,
  }
}];

var data1 = [{
    x: [0, 0.1],
    y: [0, 0],
    type: 'scatter',
    mode: 'line + markers',
    markers: {color: 'transparent', size: 0, opacity: 0},
    line: {color: 'black', width: 2},
    name: "R0",
    connectgaps: false,
  }, {
    x: [0, 0.1],
    y: [0, 0],
    type: 'scatter',
    mode: 'line + markers',
    markers: {color: 'transparent', size: 0, opacity: 0},
    line: {color: 'blue'},
    name: "r",
    connectgaps: false,
  }, {
    x: [0, 0.1],
    y: [0, 0],
    type: 'scatter',
    mode: 'line + markers',
    markers: {color: 'transparent', size: 0, opacity: 0},
    line: {color: 'red', width: 2},
    name: "rdot",
    connectgaps: false,
  }, {
    x: [0, 0.1],
    y: [0, 0],
    type: 'scatter',
    mode: 'line + markers',
    markers: {color: 'transparent', size: 0, opacity: 0},
    line: {color: 'green', width: 2},
    name: "rdotdot",
    connectgaps: false,
  }];

var layout1 = {
    autosize: false,
    width: 800,
    height: 250,
    plot_bgcolor:"#F4F4F4",
    paper_bgcolor:"#F4F4F4",
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4,
    },
    xaxis: {
      range: [-.1,6],
      showgrid: true,
      zeroline: true,
      showline: false,
      autotick: true,
      ticks: '',
      showticklabels: false,
      fixedrange: true,
    },
    yaxis: {
      range: [-0.8,0.8],
      showgrid: true,
      zeroline: true,
      showline: false,
      autotick: true,
      ticks: '',
      showticklabels: false,
      fixedrange: true,
    },
    showlegend: true,
    hovermode: false,
  }

function updateSpring () {
  springlen = [massCoordx-1];
  springx = [
    0,
    0.5,
    0.5+springlen*(1/16),
    0.5+springlen*(2/16),
    0.5+springlen*(3/16),
    0.5+springlen*(4/16),
    0.5+springlen*(5/16),
    0.5+springlen*(6/16),
    0.5+springlen*(7/16),
    0.5+springlen*(8/16),
    0.5+springlen*(9/16),
    0.5+springlen*(10/16),
    0.5+springlen*(11/16),
    0.5+springlen*(12/16),
    0.5+springlen*(13/16),
    0.5+springlen*(14/16),
    0.5+springlen*(15/16),
    massCoordx-0.5,
    massCoordx
  ];
  springy = [
    origin[1],
    origin[1],
    origin[1]-0.1,
    origin[1],
    origin[1]+0.1,
    origin[1],
    origin[1]-0.1,
    origin[1],
    origin[1]+0.1,
    origin[1],
    origin[1]-0.1,
    origin[1],
    origin[1]+0.1,
    origin[1],
    origin[1]-0.1,
    origin[1],
    origin[1]+0.1,
    origin[1],
    massCoordy
  ];
}

function updatePosition () {
  // subplot
  plotData0 = math.add(rDeque.toArraySlice(graphlen),-origin[0]);
  plotData1 = rdotDeque.toArraySlice(graphlen);
  plotData2 = rdotdotDeque.toArraySlice(graphlen);

  //plotData1 = math.add(rDeque[1].toArraySlice(graphlen),-origin[1][0]);
  xrange = math.range(0, 6, 6/(graphlen))._data.slice(0, plotData0.length);
  xrange1 = math.range(0, 6, 6/(graphlen))._data.slice(0, plotData1.length);
  xrange2 = math.range(0, 6, 6/(graphlen))._data.slice(0, plotData2.length);

  gData0 = gDeque.toArraySlice(graphlen);
  //gData1 = gDeque[1].toArraySlice(graphlen);
  xrange0 = math.range(0, 6, 6/(graphlen))._data.slice(0, gData0.length);

  if (plotData0.length > 0 && plotData0.length > 0) {
    var bound = math.max(math.max(math.abs(gData0)), math.max(math.abs(plotData0)))+0.05;
  } else {
    var bound = 0.8;
  }

  Plotly.relayout("plot", { 'yaxis.range': [-bound, bound]});
  Plotly.restyle("plot", {
    x: [xrange0, xrange, xrange1, xrange2],
    y: [gData0, plotData0, plotData1, plotData2],
  });

  // main plot
  updateSpring();
  Plotly.restyle(graphContainer, {x: [springx, massCoordx], y: [springy, massCoordy]}, [0, 1]);

  return;
}

function updateMat () {
  var matK = [[k, 0], [0, k]];
  var matM = [[-m*omega^2, 0], [0, -m*omega^2]];
  var matC = [[0, -c], [c, 0]];

  var matA = math.add(matK, matM, matC);

  var matA_i = math.inv(matA);

  rsrc = math.multiply(matA_i,[rAmp, 0]);
  return;
}

function compute () {
  if (prevW == 0 || omega != prevW) {
    updateMat();
    prevW = omega;
  }
  var r = rsrc[0]*math.sin(omega*stepNo*dt) + rsrc[1]*math.cos(omega*stepNo*dt);
  rdot = (omega*rsrc[0]*math.sin(omega*stepNo*dt) - omega*rsrc[1]*math.cos(omega*stepNo*dt));
  rdotdot = (-1*omega*omega*rsrc[0]*math.sin(omega*stepNo*dt) - omega*omega*rsrc[1]*math.cos(omega*stepNo*dt));
  massCoordx = math.add(r, origin[0]);
  pushDeques();
  return;
}

function pushDeques () {
  gDeque.push(forceG*math.sin(omega*stepNo*dt));
  //gDeque[1].push(0);
  rDeque.push(massCoordx);
  rdotDeque.push(rdot);
  rdotdotDeque.push(rdotdot);
  //rDeque[1].push(massCoordx[1]);
  return;
}

function startAnimation () {
  clearInterval(startAnim);
  startAnim = setInterval(function () {
    stepNo++;
    compute();
    updatePosition();
    return;
  }, 15);
  return;
}

function buttonPress (hitButton) {
  if (hitButton.attr('value') == "Start") {
    hitButton.prop('value', 'Reset');
    Plotly.relayout(graphContainer, {annotations: [], shapes: wallOnly});
    startAnimation();
  } else {
    hitButton.prop('value', 'Start');
    clearInterval(startAnim);
    stepNo = 0;
    rDeque = new Deque(maxlen);
    rdotDeque = new Deque(maxlen);
    rdotdotDeque = new Deque(maxlen);
    gDeque = new Deque(maxlen);
    massCoordx = origin[0];
    updatePosition();
    Plotly.relayout(graphContainer, {annotations: annotations, shapes: shapes});
  }
  return;
}

// when page ready
$(document).ready(function () {

  // typeset math
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  graphContainer = document.getElementById("graph0");

  Plotly.newPlot(graphContainer, data, layout, {displayModeBar: false});
  Plotly.newPlot("plot", data1, layout1, {displayModeBar: false});
  Plotly.relayout(graphContainer, {annotations: annotations, shapes: shapes});

  $("input").on("change", function () {
    omega = parseFloat($("#omega").val());
    stepNo = 0;
    massCoordx = origin[0];
    if ($("#resetb").val()=="Reset") {
      startAnimation();
    }
    return;
  })

  $(":button").on("click", function() {buttonPress($(this))})

})























// end
