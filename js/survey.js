//credit goes to Loneliness Vis

questionaire(); // for avoiding naming issue




function questionaire(){
    var q1 = [1, "What is your gender?"];
    var q2 = [2, "What is your age?"];
    var q3 = [3, "What is your race?"];
    var q4 = [4, "What is your work position?"];
    var q5 = [5, "What % of tech professionals in each group have a mental health disorder?"]
    var a1 = ["Male","Female","Other"],an1=[];
    var a2 = ['18-25', '26-35', '36-50', '51-75'], an2=[]
    var a3 = ['Asian', 'Hispanic/Black', 'White', 'Other'], an3 = []
    var a4 = ['Developer', 'Operations/Management', 'Support', "Designer", "Other"], an4 = []



    var q_1 = "<p class='smalltext' data-aos='fade-in'><b>"+q1[1]+"</b></p><form id='question"+q1[0]+"'data-aos='fade-in'><input type='radio' name='q1' value='F'>Female<br><input type='radio' name='q1' value='M'>Male<br><input type='radio' name='q1' value='Other'>Other</form>";

    document.getElementById("q1").innerHTML = q_1;

    d3.select("#q1").on("change", function () {
        a1 = d3.select('input[name="q1"]:checked').property("value");
        an1.push(+a1);
        var section = 1;
        document.getElementById("q1").innerHTML = "<p class='smalltext' style='color:#404040;'>"+q1[1]+"<br><br>"+a[a1]+"</p>"

        var q = "<p class='smalltext' data-aos='fade-in'><b>"+q2[1]+"</b></p><form id='question"+q2[0]+"'data-aos='fade-in'><input type='radio' name='q2' value=0> Never<br><input type='radio' name='q2' value=1> Rare<br><input type='radio' name='q2' value=2> Sometimes<br><input type='radio' name='q2' value=3> Always</form>"
        document.getElementById("q2").innerHTML = q;
    });

    d3.select("#q2").on("change", function () {
        a2 = d3.select('input[name="q2"]:checked').property("value");
        an.push(+a2);
        var q = "<p class='smalltext' style='color:#404040;'>"+q2[1]+"<br><br>"+a[a2]+"</p>"
        document.getElementById("q2").innerHTML = q;
        var q_2 = "<p class='smalltext' data-aos='fade-in'><b>"+q3[1]+"</b></p><form id='question"+q3[0]+"'data-aos='fade-in'><input type='radio' name='group-stack' value=0> Never<br><input type='radio' name='group-stack' value=1> Rare<br><input type='radio' name='group-stack' value=2> Sometimes<br><input type='radio' name='group-stack' value=3> Always</form>"
        document.getElementById("q3").innerHTML = q_2;
    });


    d3.select("#q3").on("change", function () {
        a3 = d3.select('input[name="group-stack"]:checked').node().value;
        an.push(+a3);
        var q = "<p class='smalltext' style='color:#404040;'>"+q3[1]+"<br><br>"+a[a3]+"</p>"
        document.getElementById("q3").innerHTML = q;
        var q_3 = "<p class='smalltext' data-aos='fade-in'><b>"+q4[1]+"</b></p><form id='question"+q4[0]+"'data-aos='fade-in'><input type='radio' name='group-stack' value=0> Never<br><input type='radio' name='group-stack' value=1> Rare<br><input type='radio' name='group-stack' value=2> Sometimes<br><input type='radio' name='group-stack' value=3> Always</form>"
        document.getElementById("q4").innerHTML = q_3;
    });


    d3.select("#q4").on("change", function () {
        a4 = d3.select('input[name="group-stack"]:checked').node().value;
        an.push(+a4);
        var q_4 = "<p class='smalltext' style='color:#404040;'>"+q4[1]+"<br><br>"+a[a4]+"</p>"
        document.getElementById("q4").innerHTML = q_4;

        const arrSum = arr => arr.reduce((a,b) => a + b, 0);
        console.log(arrSum(an));
        if((arrSum(an))>4){
            var answer = "<div data-aos='fade-in'><p style='text-align: center'>based on your answers:</p><h5 style='text-align: center'><b style='color: #8293b6 !important;'><br>You are likely to be lonely,</b><br>and everyone feels lonely sometimes.</h5><p style='text-align: center'><br><br><br>Loneliness is actually more prevalent than you may think.<br>It is an anxious, depressing feeling that is shared among many of us.<br><br><b>yet, why are we still struggling with it alone?</b></p></div>";
            document.getElementById("questionaire").innerHTML = answer;
            var review = "Loneliness can be depressing, but the more you understand about it the less scary it becomes.<br>In the end, we live in a lonely world, <b>but you are not alone.</b>";
            document.getElementById("questionreview").innerHTML = review;
        }else{
            var answer = "<div data-aos='fade-in'><p style='text-align: center'>based on your answers:</p><h5 style='text-align: center'>you are among the lucky, happy few<br><b style='color: #8293b6 !important;'>in a world with many, many lonely people.</b></h5><p style='text-align: center'><br><br><br>Loneliness is actually more prevalent than you may think.<br>Did you know that about 35% of the world suffers from loneliness?<br><b>and what can we do? how can we help?</b></p></div>";
            document.getElementById("questionaire").innerHTML = answer;
            var review = "Even though you do not struggle with loneliness, you can always look for ways to help others.<br>We live in a lonely world, <b>but no one should be alone.</b>";
            document.getElementById("questionreview").innerHTML = review;
            //console.log(arrSum(an));
        }

    });
}