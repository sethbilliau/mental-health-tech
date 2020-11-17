/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myMapVis;
let lineGraphVis;
let myCloudVis;
let myDoubleBar;
let bubbleChart;


// load data using promises
let promises = [

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
    // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to ft your browser window
    d3.csv("data/df_1619_vF.csv"),
    d3.csv("data/sp.csv"),
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

let surveyDemographics = ['F', '18_25', 'Black or African American', 'Back-end Developer'];
let surveyGuesses = [25, 30, 35, 40];
// initMainPage
function initMainPage(dataArray) {

    // log data
    console.log('check out the data', dataArray);

    // Map Vis
    myMapVis = new MapVis('map', dataArray[0], dataArray[1]);

    myCloudVis = new WordCloudVis('cloudDiv', dataArray[1]);
    lineGraphVis = new LineGraph("lineGraphDiv", dataArray[2]);

    myDoubleBar = new DoubleBarchart('double-barchart', dataArray[1], surveyDemographics, surveyGuesses);

    bubbleChart = new BubbleChart("bubble-chart", dataArray[1])
}

function categoryChange() {
    selectedCategory = $('#categorySelector').val();
    myMapVis.wrangleData(); // maybe you need to change this slightly depending on the name of your MapVis instance
}



