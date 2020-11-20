/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myMapVis;
let lineGraphVis;
let myCloudVis;
let myDoubleBar;
let bubbleChart;
let bubbleBar;
let mySankey;

// load data using promises
let promises = [

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
    // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to ft your browser window
    d3.csv("data/df_1619_colnames.csv"),
    d3.csv("data/sp.csv"),
    d3.json("data/phase1.json"),
    d3.json("data/phase2.json"),
    d3.json("data/phase3.json"),
    d3.json("data/phase4.json"),
    d3.json("data/phase5.json"),
    d3.csv("data/sankey_data.csv"),
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

let surveyDemographics = ['F', '18_25', 'Black or African American', 'Back-end Developer'];
let surveyGuesses = [25, 30, 35, 40];

let MyEventHandler = {};
// initMainPage
function initMainPage(dataArray) {

    // log data

    // Map Vis
    myMapVis = new MapVis('map', dataArray[0], dataArray[1]);

    myCloudVis = new WordCloudVis('cloudDiv', dataArray[1]);
    lineGraphVis = new LineGraph("lineGraphDiv", dataArray[2]);

    myDoubleBar = new DoubleBarchart('double-barchart', dataArray[1], surveyDemographics, surveyGuesses);

    let phases = {
        0: dataArray[3],
        1: dataArray[4],
        2: dataArray[5],
        3: dataArray[6],
        4: dataArray[7]
    };
    bubbleChart = new BubbleChart("bubble-chart", dataArray[1], phases, MyEventHandler);
    bubbleBar = new BubbleBar("bubble-bar", dataArray[1]);
    mySankey = new SankeyVis('sankeyDiv', dataArray[8]);
}

function categoryChange() {
    selectedCategory = $('#categorySelector').val();
    myMapVis.wrangleData(); // maybe you need to change this slightly depending on the name of your MapVis instance
}


new TypeIt("#title", {
    strings: "Mental Health in the Tech Industry",
    speed: 50,
    waitUntilVisible: true
  }).go();

$(MyEventHandler).bind("bubbleHovered", function(event, key) {
    console.log(key)
    bubbleBar.onBubbleHovered(key);
});