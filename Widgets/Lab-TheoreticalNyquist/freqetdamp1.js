
//what variables are these?
let R,k,c,m;

const wStart = 0.1;
const wEnd = 3;
const n =500;
const a = (wEnd - wStart)/(n-1);

let damplNorm=[],vamplNorm=[],aamplNorm=[];
let dinNorm=[];
let doutNorm=[];

let vinNorm=[];
let voutNorm=[];

let ainNorm=[];
let aoutNorm=[];

let w=[],alfa=[],wc=[],delta=[],din=[],dout=[],vin=[],vout=[];
let ain=[],aout=[],dampl=[],phased=[],vampl=[],phasev=[],aampl=[],phasea=[];


let trace1,trace2,trace3,trace4,trace5,trace6,trace7,trace8,trace9;
let trace10,trace11,trace12,trace13,trace14,trace15;
let data1,data2,data3;
let data4,data5,data6;
let layout1,layout2,layout3;
let layout4,layout5,layout6;

const cDisp = 'rgb(0, 128, 255)', cVel='rgb(255, 128, 0)', cAcc='rgb(77, 172, 0)';


// function that opens the theory page in a new tab
$('#theory').click(function() {
  window.open('freqanddampingtheory1.html', '_blank');
});
// function animates and relayouts given new data and a plotly div
function animate_shorthand(data,div){
  Plotly.animate(div, {
    data: data,
    traces: [0, 1, 2],
    },
    {
    transition: {
      duration: 0,
      easing: 'cubic-in-out'
    },
    frame: {duration: 0,redraw: false}
  });
  Plotly.relayout( div, {
    'xaxis.autorange': true,
    'yaxis.autorange': true
  });
};

//all the math goes here
function calculate(){
for (var i = 0;  i < n; i++) {

    w[i]= wStart + i*a;
    alfa[i] = k - Math.pow(w[i], 2)*m;
    wc[i] = w[i]*c;
    delta[i] = Math.pow(alfa[i], 2) + Math.pow(wc[i],2);
    din[i] = alfa[i]*R/(delta[i]);
    dout[i] = -wc[i]*R/(delta[i]);
    vin[i]=-w[i]*dout[i];
    vout[i]=w[i]*din[i];
    ain[i]=-w[i]*vout[i];
    aout[i]=w[i]*vin[i];

    dampl[i]=Math.sqrt(Math.pow(din[i], 2) + Math.pow(dout[i], 2));
    phased[i]=Math.atan2(dout[i], din[i]);

    vampl[i]=Math.sqrt(Math.pow(vin[i], 2) + Math.pow(vout[i], 2));
    phasev[i]=Math.atan2(vout[i], vin[i]);

    aampl[i]=Math.sqrt(Math.pow(ain[i], 2) + Math.pow(aout[i], 2));
    phasea[i]=Math.atan2(aout[i], ain[i]);
    }
};


//sets the list of traces given the calculated physical arrays
function setTraces(){

  trace1 = {
    x: w,
    y: dampl,
    name: 'Displacement',
    type: 'scatter',
    mode: "lines",
    marker: {color: cDisp}
  };
   trace2 = {
    x: w,
    y: vampl,
    name: 'Velocity',
    type: 'scatter',
    mode: 'lines',
    marker: {color: cVel}
  };
  trace3 = {
    x: w,
    y: aampl,
    name: 'Acceleration',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cAcc}
  };

  trace4 = {
    x: din,
    y: dout,
    name: 'Displacement',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cDisp}
  };
  trace5 = {
    x: vin,
    y: vout,
    name: 'Velocity',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cVel}
  };
  trace6 = {
    x: ain,
    y: aout,
    name: 'Acceleration',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cAcc}
  };

  trace7 = {
    x: w,
    y: phased,
    name: 'Displacement',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cDisp}
    };
  trace8 = {
    x: w,
    y: phasev,
    name: 'Velocity',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cVel}
    };
  trace9 = {
    x: w,
    y: phasea,
    name: 'Acceleration',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cAcc}
  };

  trace10 = {
    x: w,
    y: din,
    name: 'Displacement In-phase',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cDisp}
  };
  trace11 = {
    x: w,
    y: dout,
    name: 'Displacement Out-phase',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cDisp},
    line: {dash: 'dot'}
  };
  trace12 = {
    x: w,
    y: vin,
    name: 'Velocity In-phase',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cVel}
  };
  trace13 = {
    x: w,
    y: vout,
    name: 'Velocity Out-phase',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cVel},
    line: {dash: 'dot'}
  };
  trace14 = {
    x: w,
    y: ain,
    name: 'In phase',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cAcc},
  };
  trace15 = {
    x: w,
    y: aout,
    name: 'Out of phase',
    type: 'scatter',
    mode: 'lines',
    marker:{color: cAcc},
    line: {dash: 'dot'}
  };



  data1 = [trace1, trace2, trace3];
  data2 = [trace4, trace5, trace6];
  data3 = [trace7, trace8, trace9];

  data4 = [trace10, trace11];
  data5 = [trace12, trace13];
  data6 = [trace14, trace15];

  layout1= {
    plot_bgcolor:"#F4F4F4",
    paper_bgcolor:"#F4F4F4",
    autosize: true,
    margin:{
    l:50, r:10, b:45, t:10
    },
    xaxis:{title:'Frequency (rad/s)'},
    yaxis:{title:'Magnitude'},
    legend: {x: 0, y: 10, orientation: "h"},
    showlegend: false,
    font: {family: "Fira Sans", size:12}
};

  layout2= {
    plot_bgcolor:"#F4F4F4",
    paper_bgcolor:"#F4F4F4",
    autosize: true,
    margin:{
    l:50, r:10, b:45, t:10
    },
    legend: {x: 50, y: 10, orientation: "h"
    },
    showlegend: false,
    xaxis: {title:'In-phase Component'},
    yaxis: {scaleanchor: "x",title:'Out-of-phase Component'},

    font: {
    family: "Fira Sans", size:12
    }
};

layout3= {
    plot_bgcolor:"#F4F4F4",
    paper_bgcolor:"#F4F4F4",
    autosize: true,
    margin:{
        l:50, r:10, b:45, t:10
    },
    legend: {x: 50, y: 1, orientation: "v"
    },
    xaxis:{title:'Frequency (rad/s)'},
    yaxis:{title:'Phase (rad)'},
    font: {
        family: "Fira Sans", size:12
    }

};

layout4= {
  plot_bgcolor:"#F4F4F4",
  paper_bgcolor:"#F4F4F4",
  autosize: true,
  margin:{
      l:50, r:10, b:45, t:10
  },
  legend: {x: 50, y: 1, orientation: "v"
  },
  showlegend: false,
  xaxis:{title:'Frequency (rad/s)'},
  yaxis:{title:'Displacement Component'},
  font: {
      family: "Fira Sans", size:12
  }

};

layout5= {
  plot_bgcolor:"#F4F4F4",
  paper_bgcolor:"#F4F4F4",
  autosize: true,
  margin:{
      l:50, r:10, b:45, t:10
  },
  legend: {x: 50, y: 1, orientation: "v"
  },
  showlegend: false,
  xaxis:{title:'Frequency (rad/s)'},
  yaxis:{title:'Velocity Component'},
  font: {
      family: "Fira Sans", size:12
  }

};

layout6= {
  plot_bgcolor:"#F4F4F4",
  paper_bgcolor:"#F4F4F4",
  autosize: true,
  margin:{
      l:50, r:10, b:45, t:10
  },
  legend: {x: 50, y: 1, orientation: "v"
  },
  xaxis:{title:'Frequency (rad/s)'},
  yaxis:{title:'Acceleration Component'},
  font: {
      family: "Fira Sans", size:12
  }

};

}

// generate the data that is used to create the plots
function initPlot() {
         R = $("input#Force").val();
         k = $("input#Spring").val();
         c = $("input#Damping").val();
         m = $("input#Mass").val();

        calculate();
        setTraces();

        animate_shorthand(data1,'graph1')
        animate_shorthand(data2,'graph2')
        animate_shorthand(data3,'graph3')

        animate_shorthand(data4,'graph4')
        animate_shorthand(data5,'graph5')
        animate_shorthand(data6,'graph6')
}

// create an empty plot that is displayed when the page is loaded. Default values are used
function emptyPlot(){
         R = $("input#Force").val();
         k = $("input#Spring").val();
         c = $("input#Damping").val();
         m = $("input#Mass").val();

        calculate();
        setTraces();

            // as before, first plot, amplitude vs frequency


            Plotly.newPlot('graph1', data1, layout1, {displayModeBar:false});

            // in phase vs out of phase

            Plotly.newPlot('graph2', data2, layout2, {displayModeBar:false});

            //phase vs frequency

            Plotly.newPlot('graph3', data3, layout3, {displayModeBar:false});

            Plotly.newPlot('graph4', data4, layout4, {displayModeBar:false});

            Plotly.newPlot('graph5', data5, layout5, {displayModeBar:false});

            Plotly.newPlot('graph6', data6, layout6, {displayModeBar:false});
};

// function that makes the sliders nice
function main() {
    $("input[type=range]").each(function () {
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val());
            initPlot();
        });
    });
  }

$(window).on('load',emptyPlot)
$(document).ready = main();
