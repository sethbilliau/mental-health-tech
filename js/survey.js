//credit goes to Loneliness Vis

survey(); // for avoiding naming issue
initSliders();



function survey() {
    var q1 = [1, "What is your gender?"];
    var q2 = [2, "What is your age?"];
    var q3 = [3, "What is your race?"];
    var q4 = [4, "What is your work position?"];
    var q5 = [5, "What % of tech professionals in each group have a mental health issue?"]
    var op1 = ["Male", "Female", "Other Gender"],
        an1 = [];
    var op2 = ['18-25', '26-35', '36-50', '51-75'],
        an2 = []
    var op3 = ['Asian', 'Hispanic/Black', 'White', 'Other Race'],
        an3 = []
    var op4 = ['Developer', 'Operations/Management', 'Support', "Designer", "Other Role"],
        an4 = []


    d3.select("#q1").on("change", function () {
        a1 = d3.select('input[name="q1"]:checked').property("value");
        an1.push(+a1);
        selectedGender = op1[a1];
        var section = 1;
        document.getElementById("q1").innerHTML = "<p class='smalltext'>" + q1[1] + "<br><br><purple>" + op1[a1] + "</purple></p>"

        $("#q2").css({
            visibility: "visible"
        });
    });

    d3.select("#q2").on("change", function () {
        a2 = d3.select('input[name="q2"]:checked').property("value");
        an2.push(+a2);
        selectedAge = op2[a2];
        var q = "<p class='smalltext'>" + q2[1] + "<br><br><purple>" + op2[a2] + "</p></purple>"
        document.getElementById("q2").innerHTML = q;

        $("#q3").css({
            visibility: "visible"
        });
    });


    d3.select("#q3").on("change", function () {
        a3 = d3.select('input[name="group-stack"]:checked').node().value;
        an3.push(+a3);
        selectedRace = op3[a3];
        var q = "<p class='smalltext'>" + q3[1] + "<br><br><purple>" + op3[a3] + "</purple></p>"
        document.getElementById("q3").innerHTML = q;

        $("#q4").css({
            visibility: "visible"
        });
    });


    d3.select("#q4").on("change", function () {
        a4 = d3.select('input[name="group-stack"]:checked').node().value;
        an4.push(+a4);
        selectedJob = op4[a4];
        var q_4 = "<p class='smalltext'>" + q4[1] + "<br><br><purple>" + op4[a4] + "</purple></p>"
        document.getElementById("q4").innerHTML = q_4;

        $("#q5").css({
            visibility: "visible"
        });
        $("#double-barchart").css({
            visibility: "visible"
        });
        $("#barchart-caption").css({
            visibility: "visible"
        });
        $("#barchart-transition1").css({
            visibility: "visible"
        });
        $("#barchart-transition2").css({
            visibility: "visible"
        });
        myDoubleBar.initVis();

        $("#slider-fill").css({
            visibility: "visible"
        });
        $("#slider-fill2").css({
            visibility: "visible"
        });
        $("#slider-fill3").css({
            visibility: "visible"
        });
        $("#slider-fill4").css({
            visibility: "visible"
        });
        $(".container").css({
            visibility: "visible"
        });

        $("#slider-header1").css({
            visibility: "visible"
        });
        $('#slider-header1').html(selectedGender);

        $("#slider-header2").css({
            visibility: "visible"
        });
        $('#slider-header2').html(selectedAge);

        $("#slider-header3").css({
            visibility: "visible"
        });
        $('#slider-header3').html(selectedRace);

        $("#slider-header4").css({
            visibility: "visible"
        });
        $('#slider-header4').html(selectedJob);

    });
}

function initSliders() {
    var data = [0, 1]

    var sliderFill = d3
        .sliderBottom()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(200)
        .tickFormat(d3.format('.0%'))
        .ticks(3)
        .default(0.5)
        .fill('lightblue')
        .on('onchange', val => {
            let valString = "gender:" + val
            $(MyEventHandler2).trigger("sliderChanged", valString);
        });

    var gFill = d3
        .select('div#slider-fill')
        .append('svg')
        .attr('width', 300)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gFill.call(sliderFill);

    var sliderFill2 = d3
        .sliderBottom()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(200)
        .tickFormat(d3.format('.0%'))
        .ticks(3)
        .default(0.5)
        .fill('lightblue')
        .on('onchange', val => {
            let valString = "age:" + val
            $(MyEventHandler2).trigger("sliderChanged", valString);
        });

    var gFill2 = d3
        .select('div#slider-fill2')
        .append('svg')
        .attr('width', 300)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gFill2.call(sliderFill2);

    var sliderFill3 = d3
        .sliderBottom()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(200)
        .tickFormat(d3.format('.0%'))
        .ticks(3)
        .default(0.5)
        .fill('lightblue')
        .on('onchange', val => {
            let valString = "race:" + val
            $(MyEventHandler2).trigger("sliderChanged", valString);
        });

    var gFill3 = d3
        .select('div#slider-fill3')
        .append('svg')
        .attr('width', 300)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gFill3.call(sliderFill3);

    var sliderFill4 = d3
        .sliderBottom()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(200)
        .tickFormat(d3.format('.0%'))
        .ticks(3)
        .default(0.5)
        .fill('lightblue')
        .on('onchange', val => {
            let valString = "job:" + val
            $(MyEventHandler2).trigger("sliderChanged", valString);
        });

    var gFill4 = d3
        .select('div#slider-fill4')
        .append('svg')
        .attr('width', 300)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gFill4.call(sliderFill4);

}