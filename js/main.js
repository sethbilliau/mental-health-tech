/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myMapVis;
let lineGraphVis;
let myCloudVis;
let myWordBar;
let myDoubleBar;
let bubbleChart;
let myStories;
let bubbleBar;
let mySankey;
let doubleLine;

let selectedGender;
let selectedAge;
let selectedRace;
let selectedJob;

let SPECIALSTRINGS;

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
    d3.csv("data/textanalysis.csv"),
    d3.csv("data/randomsubset.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

let surveyDemographics = ['F', '18_25', 'Black or African American', 'dev'];
let surveyGuesses = [25, 30, 35, 40];

let MyEventHandler = {};
let MyEventHandler2 = {};
// initMainPage
function initMainPage(dataArray) {

    // log data

    // Map Vis
    myMapVis = new MapVis('map', dataArray[0], dataArray[1]);
    bubbleBar = new BubbleBar("bubble-bar", dataArray[1]);

    myCloudVis = new WordCloudVis('cloudDiv', dataArray[9], 50);
    myWordBar = new WordBar("wordbubbleDiv", dataArray[9]);
    myStories = new Story("stories", dataArray[10]);

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
    doubleLine = new DoubleLine('doubleLine', dataArray[1]);
}

function categoryChange() {
    myMapVis.wrangleData();
}

function sankeyChange() {
    mySankey.wrangleData(0);
}

function nextPhase() {
    mySankey.wrangleData(1);
}

function prevPhase() {
    mySankey.wrangleData(-1);
}

function wordChange() {
    $("#stories-p").html("")
    myWordBar.wrangleData();
    myStories.wrangleData();
    d3.select('#cloudDiv').selectAll('svg').remove();
    myCloudVis.initVis();

}

function generateText() {
    myStories.wrangleData();
}




let title = new TypeIt("#title", {
    speed: 50,
    waitUntilVisible: true,
    lifeLike: true,
    afterComplete: async(step, instance) => {
        new TypeIt("#subtitle", {
            speed: 50,
            lifeLike: true,
          })
          .type("Mental Health in the Tech Industry")
          .go();
        title.destroy();
    }
  })
  .type("More than Just Code?", {delay: 1000})
  .delete(1)
  .type(".", {delay: 1000})
//   .type("<br><h5>Mental Health in the Tech Industry</h5>")
  .move('END')
  .go();


new TypeIt("#osmi-title", {
    strings: "<orange-bold>OSMI's survey on mental health in the tech industry.</orange-bold>",
    speed: 35,
    waitUntilVisible: true
  })
    .go();
new TypeIt("#quiz-title", {
    strings: "<strong>How much do you think tech professionals in <orange>your demographic groups </orange> are struggling with mental health issues?</strong>",
    speed: 35,
    waitUntilVisible: true
})
    .go();
new TypeIt('#who-title', {
    strings: "What might explain why <cyan>41% of all survey respondents</cyan> said they were struggling with mental health issues?",
    speed: 35,
    waitUntilVisible: true
})
    .go();

$(MyEventHandler).bind("bubbleHovered", function(event, key) {
    bubbleBar.onBubbleHovered(key);
});

$(MyEventHandler2).bind("sliderChanged", function (event, value) {
    myDoubleBar.onSliderChanged(value);
})

function onScrollClick(e) {
    $('html, body').animate({
        scrollTop: $(`#section5`).offset().top - 90
    }, 1000);

}

function onMouseOver(d, i) {
    myCloudVis.highlight(i);
}


function onMouseOut(d, i) {
    myCloudVis.unhighlight(i);
}
