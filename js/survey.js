//credit goes to Loneliness Vis

questionaire(); // for avoiding naming issue
initSliders();



function questionaire() {
    var q1 = [1, "What is your gender?"];
    var q2 = [2, "What is your age?"];
    var q3 = [3, "What is your race?"];
    var q4 = [4, "What is your work position?"];
    var q5 = [5, "What % of tech professionals in each group have a mental health disorder?"]
    var op1 = ["Male", "Female", "Other Gender"],
        an1 = [];
    var op2 = ['18-25', '26-35', '36-50', '51-75'],
        an2 = []
    var op3 = ['Asian', 'Hispanic/Black', 'White', 'Other Race'],
        an3 = []
    var op4 = ['Developer', 'Operations/Management', 'Support', "Designer", "Other Role"],
        an4 = []



    var q_1 = "<p class='smalltext' data-aos='fade-in'><b>" + q1[1] + "</b></p><form id='question" + q1[0] + "'data-aos='fade-in'><input type='radio' name='q1' value='1'>Female<br><input type='radio' name='q1' value='0'>Male<br><input type='radio' name='q1' value='2'>Other Gender</form>";

    document.getElementById("q1").innerHTML = q_1;

    d3.select("#q1").on("change", function () {
        a1 = d3.select('input[name="q1"]:checked').property("value");
        an1.push(+a1);
        selectedGender = op1[a1];
        var section = 1;
        document.getElementById("q1").innerHTML = "<p class='smalltext' style='color:#fafafa;'>" + q1[1] + "<br><br>" + op1[a1] + "</p>"

        var q = "<p class='smalltext' data-aos='fade-in'><b>" + q2[1] + "</b></p><form id='question" + q2[0] + "'data-aos='fade-in'><input type='radio' name='q2' value=0>18-25<br><input type='radio' name='q2' value=1>26-35<br><input type='radio' name='q2' value=2>36-50<br><input type='radio' name='q2' value=3>51-75</form>"
        document.getElementById("q2").innerHTML = q;
    });

    d3.select("#q2").on("change", function () {
        a2 = d3.select('input[name="q2"]:checked').property("value");
        an2.push(+a2);
        selectedAge = op2[a2];
        var q = "<p class='smalltext' style='color:#fafafa;'>" + q2[1] + "<br><br>" + op2[a2] + "</p>"
        document.getElementById("q2").innerHTML = q;
        var q_2 = "<p class='smalltext' data-aos='fade-in'><b>" + q3[1] + "</b></p><form id='question" + q3[0] + "'data-aos='fade-in'><input type='radio' name='group-stack' value=0>Asian<br><input type='radio' name='group-stack' value=1>Hispanic/Black<br><input type='radio' name='group-stack' value=2>White<br><input type='radio' name='group-stack' value=3>Other Race</form>"
        document.getElementById("q3").innerHTML = q_2;
    });


    d3.select("#q3").on("change", function () {
        a3 = d3.select('input[name="group-stack"]:checked').node().value;
        an3.push(+a3);
        selectedRace = op3[a3];
        var q = "<p class='smalltext' style='color:#fafafa;'>" + q3[1] + "<br><br>" + op3[a3] + "</p>"
        document.getElementById("q3").innerHTML = q;
        var q_3 = "<p class='smalltext' data-aos='fade-in'><b>" + q4[1] + "</b></p><form id='question" + q4[0] + "'data-aos='fade-in'><input type='radio' name='group-stack' value=0>Developer<br><input type='radio' name='group-stack' value=1>Operations/Management<br><input type='radio' name='group-stack' value=2>Support<br><input type='radio' name='group-stack' value=3>Designer<br><input type='radio' name='group-stack' value=4>Other Role</form>"
        document.getElementById("q4").innerHTML = q_3;
    });


    d3.select("#q4").on("change", function () {
        a4 = d3.select('input[name="group-stack"]:checked').node().value;
        an4.push(+a4);
        selectedJob = op4[a4];
        var q_4 = "<p class='smalltext' style='color:#fafafa;'>" + q4[1] + "<br><br>" + op4[a4] + "</p>"
        document.getElementById("q4").innerHTML = q_4;
        var q_5 = `<p><b>${q5[1]}</b></p>`
        document.getElementById("q5").innerHTML = q_5;
        // document.getElementById("barchart-container").innerHTML = "<div id = 'double-barchart'></div>";

        $("#double-barchart").css({visibility: "visible"});
        document.getElementById('barchart-caption').innerHTML ="You submitted your expectations. Here's how they compare against OSMI's survey results:"
        document.getElementById('barchart-transition1').innerHTML = "How did you do? Were you surprised by your results?"
        document.getElementById('barchart-transition2').innerHTML = "<br>And it's not just your demographic groups that are struggling..."
        myDoubleBar.initVis();

        $("#slider-fill").css({ visibility: "visible"});
        $("#slider-fill2").css({ visibility: "visible"});
        $("#slider-fill3").css({ visibility: "visible"});
        $("#slider-fill4").css({ visibility: "visible"});
        $(".container").css({ visibility: "visible"});

        $("#slider-header1").css({ visibility: "visible"});
        $('#slider-header1').html(selectedGender);

        $("#slider-header2").css({ visibility: "visible"});
        $('#slider-header2').html(selectedAge);

        $("#slider-header3").css({ visibility: "visible"});
        $('#slider-header3').html(selectedRace);

        $("#slider-header4").css({ visibility: "visible"});
        $('#slider-header4').html(selectedJob);


        // bubbleChart.initVis();
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
            .ticks(4)
            .default(0.5)
            .fill('#2196f3')
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
            .ticks(4)
            .default(0.5)
            .fill('#2196f3')
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
            .ticks(4)
            .default(0.5)
            .fill('#2196f3')
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
            .ticks(4)
            .default(0.5)
            .fill('#2196f3')
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