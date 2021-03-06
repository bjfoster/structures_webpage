
// initialise graph
let data, layout;
const lineCoord = 0;
const origin = [2, lineCoord];
var massCoordx = origin[0];
var massCoordy = origin[1];
var m = 1, c = 0.5, k = 1;
var R0 = 0.05;
var dt = math.PI/24;

const maxlen = 128;
const graphlen = maxlen;
var rDeque = new Deque(maxlen);
var rdotDeque = new Deque(maxlen);
var rdotdotDeque = new Deque(maxlen);

var UDeque = new Deque(maxlen);
var DDeque = new Deque(maxlen);
var TDeque = new Deque(maxlen);

var U_deriv_Deque = new Deque(maxlen);
var D_deriv_Deque = new Deque(maxlen);
var T_deriv_Deque = new Deque(maxlen);

var total_deriv_Deque = new Deque(maxlen);

var gDeque = new Deque(maxlen);

var stepNo = 0;
var prevW = 0;
var prevR0 = 0;
var omega = 1.0;
let rsrc;

let r, rdot, rdotdot;
let U, D, T;
let U_deriv, D_deriv, T_deriv;

let graphContainer, pointsContainer, points;
let startAnim;

let springlen, springx, springy
updateSpring();

data = [{
    x: springx,
    y: springy,
    type: 'scatter',
    mode: 'line + markers',
    line: {color: 'black'},
    name: 'Spring',
    marker: {color: 'transparent', size: 0, opacity: 0},
    connectgaps: false,
  }, {
    x: [massCoordx, massCoordx],
    y: [massCoordy, massCoordy],
    type: 'scatter',
    mode: 'line + markers',
    line: {color: 'black'},
    name: 'Mass',
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
  x: 3.2,
  y: -0.5,
  xref: 'x',
  yref: 'y',
  text: '$r, \R_0\ = \\sin\(\\omega t\)\$',
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
    mode: 'lines',
    markers: {color: 'transparent', size: 0, opacity: 0},
    line: {color: 'blue'},
    name: "$r$",
    connectgaps: false,
  }, {
    x: [0, 0.1],
    y: [0, 0],
    type: 'scatter',
    mode: 'lines',
    markers: {color: 'transparent', size: 0, opacity: 0},
    line: {color: 'red', width: 2},
    name: "$\\dot{r}$",
    connectgaps: false,
  }, {
    x: [0, 0.1],
    y: [0, 0],
    type: 'scatter',
    mode: 'lines',
    markers: {color: 'transparent', size: 0, opacity: 0},
    line: {color: 'green', width: 2},
    name: "$\\ddot{r}$",
    connectgaps: false,
  }];

var data2 = [{
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'blue'},
  name: "$U$",
  connectgaps: false,
}, {
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'red', width: 2},
  name: "$D$",
  connectgaps: false,
}, {
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'green', width: 2},
  name: "$T$",
  connectgaps: false,
}];

var data3 = [{
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'blue'},
  name: "$\\frac{\\mathrm{d}U}{\\mathrm{d}r}$",
  connectgaps: false,
}, {
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'red', width: 2},
  name: "$\\frac{\\mathrm{d}D}{\\mathrm{d}\\dot{r}}$",
  connectgaps: false,
}, {
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'green', width: 2},
  name: "$\\frac{\\mathrm{d}}{\\mathrm{d}t}(\\frac{\\mathrm{d}T}{\\mathrm{d}\\dot{r}})$",
  connectgaps: false,

  
}, {
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'black', width: 2},
  name: "Sum of Above",
  connectgaps: false,

  
}, {
  x: [0, 0.1],
  y: [0, 0],
  type: 'scatter',
  mode: 'lines',
  markers: {color: 'transparent', size: 0, opacity: 0},
  line: {color: 'brown', width: 2, dash: 'dashdot'},
  name: "$R_0$",
  connectgaps: false,

  
}];


var layout1 = {
    autosize: false,
    width: 600,
    height: 200,
    plot_bgcolor:"#F4F4F4",
    paper_bgcolor:"#F4F4F4",
    margin: {
      l: 10,
      r: 10,
      b: 20,
      t: 20,
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
    legend: {
      x: 1,
      y: 0.5,
    },
    hovermode: false,
  }

  var layout3 = {
    autosize: false,
    width: 666,
    height: 200,
    plot_bgcolor:"#F4F4F4",
    paper_bgcolor:"#F4F4F4",
    margin: {
      l: 10,
      r: 10,
      b: 20,
      t: 20,
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
    legend: {
      x: 1,
      y: 0.5,
    },
    hovermode: false,
  }

  function clamp (x, xmin, xmax) {
    return math.max(xmin, math.min(x, xmax))
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
  plotData0 = rDeque.toArraySlice(graphlen);
  plotData1 = rdotDeque.toArraySlice(graphlen);
  plotData2 = rdotdotDeque.toArraySlice(graphlen);

  plotData3 = UDeque.toArraySlice(graphlen);
  plotData4 = DDeque.toArraySlice(graphlen);
  plotData5 = TDeque.toArraySlice(graphlen);

  plotData6 = U_deriv_Deque.toArraySlice(graphlen);
  plotData7 = D_deriv_Deque.toArraySlice(graphlen);
  plotData8 = T_deriv_Deque.toArraySlice(graphlen);

  plotData9 = total_deriv_Deque.toArraySlice(graphlen);
  gData0 = gDeque.toArraySlice(graphlen);

  //plotData1 = math.add(rDeque[1].toArraySlice(graphlen),-origin[1][0]);
  xrange = math.range(0, 6, 6/(graphlen))._data.slice(0, plotData0.length);

  if (plotData0.length > 0) {
    var bound1 = math.max(math.max(math.abs(plotData0)), math.max(math.abs(plotData1)), math.max(math.abs(plotData2)))+0.05;
  } else {
    var bound1 = 0.8;
  }

  if (plotData3.length > 0) {
    var bound2 = math.max(math.max(math.abs(plotData3)), math.max(math.abs(plotData4)), math.max(math.abs(plotData5)))+0.05;
  } else {
    var bound2 = 0.8;
  }

  if (plotData6.length > 0) {
    var bound3 = math.max(math.max(math.abs(plotData6)), math.max(math.abs(plotData7)), math.max(math.abs(plotData8)), math.max(math.abs(plotData9)))+0.05;
  } else {
    var bound3 = 0.8;
  }
  
  
  Plotly.relayout("plot1", { 'yaxis.range': [-bound1, bound1]});
  Plotly.restyle("plot1", {
    x: [xrange, xrange, xrange],
    y: [plotData0, plotData1, plotData2],
  });
  

  Plotly.relayout("plot2", { 'yaxis.range': [0, bound2]});
  Plotly.restyle("plot2", {
    x: [xrange, xrange, xrange],
    y: [plotData3, plotData4, plotData5],
  });
  

 
  Plotly.relayout("plot3", { 'yaxis.range': [-bound3, bound3]});
  Plotly.restyle("plot3", {
    x: [xrange, xrange, xrange, xrange, xrange],
    y: [plotData6, plotData7, plotData8, plotData9, gData0],
  }); 

  // main plot
  updateSpring();
  Plotly.restyle(graphContainer, {x: [springx, [massCoordx, massCoordx]], y: [springy, [massCoordy, massCoordy]]});

  return;
}

function updateMat () {
  var matK = [[k, 0], [0, k]];
  var matM = [[-m*omega*omega, 0], [0, -m*omega*omega]];
  var matC = [[0, -c*omega], [c*omega, 0]];

  var matA = math.add(matK, matM, matC);

  var matA_i = math.inv(matA);

  rsrc = math.multiply(matA_i,[R0, 0]);
  return;
}

function compute () {
  if (prevW == 0 || omega != prevW) {
    updateMat();
    prevW = omega;
  }
  r = rsrc[0]*math.sin(omega*stepNo*dt) + rsrc[1]*math.cos(omega*stepNo*dt);
  rdot = (omega*rsrc[0]*math.cos(omega*stepNo*dt) - omega*rsrc[1]*math.sin(omega*stepNo*dt));
  rdotdot = (-1*omega*omega*rsrc[0]*math.sin(omega*stepNo*dt) - omega*omega*rsrc[1]*math.cos(omega*stepNo*dt));
  massCoordx = math.add(r, origin[0]);

  U = 0.5 * k * r*r;
  D = 0.5 * c * rdot*rdot;
  T = 0.5 * m * rdot*rdot;

  U_deriv = k * r;
  D_deriv = c * rdot;
  T_deriv = m * rdotdot;

  total_deriv = U_deriv + D_deriv + T_deriv;

  pushDeques();
  return;
}

function pushDeques () {
  gDeque.push(R0*math.sin(omega*stepNo*dt));
  //gDeque[1].push(0);
  rDeque.push(r);
  rdotDeque.push(rdot);
  rdotdotDeque.push(rdotdot);
  //rDeque[1].push(massCoordx[1]);

  UDeque.push(U);
  DDeque.push(D);
  TDeque.push(T);

  U_deriv_Deque.push(U_deriv);
  D_deriv_Deque.push(D_deriv);
  T_deriv_Deque.push(T_deriv);

  total_deriv_Deque.push(total_deriv);
  
  return;
}

function startAnimation () {
  clearInterval(startAnim);
  startAnim = setInterval(function () {
    stepNo++;
    // console.log(stepNo)
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
  } else if (hitButton.attr('value') == "Reset"){
    hitButton.prop('value', 'Start');
    clearInterval(startAnim);
    stepNo = 0;
    rDeque = new Deque(maxlen);
    rdotDeque = new Deque(maxlen);
    rdotdotDeque = new Deque(maxlen);

    UDeque = new Deque(maxlen);
    DDeque = new Deque(maxlen);
    TDeque = new Deque(maxlen);

    U_deriv_Deque = new Deque(maxlen);
    D_deriv_Deque = new Deque(maxlen);
    T_deriv_Deque = new Deque(maxlen);

    total_deriv_Deque = new Deque(maxlen);


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
  Plotly.newPlot("plot1", data1, layout1, {displayModeBar: false});
  Plotly.newPlot("plot2", data2, layout1, {displayModeBar: false});
  Plotly.newPlot("plot3", data3, layout3, {displayModeBar: false});

  Plotly.relayout(graphContainer, {annotations: annotations, shapes: shapes});

  pointsContainer = graphContainer.querySelector(".scatterlayer .trace:last-of-type .points");
  points = pointsContainer.getElementsByTagName("path");

  for (var i = 0; i < points.length; i++) {
    points[i].handle = i;
  }

  $("input").on("change", function () {
    omega = parseFloat($("#omega").val());
    stepNo = 0;
    massCoordx = origin[0];
    m = $("#m").val();
    c = $("#c").val();
    k = $("#k").val();
    updateMat();
    if ($("#resetb").val()=="Reset") {
      startAnimation();
    }
    return;

    
  })

  $(":button").on("click", function() {buttonPress($(this))})

  
})























// end
