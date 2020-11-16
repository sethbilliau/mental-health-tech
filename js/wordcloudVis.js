/* * * * * * * * * * * * * *
*          Word Cloud Vis          *
* * * * * * * * * * * * * */

class WordCloudVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;

        this.parseDate = d3.timeParse("%m/%d/%Y");



        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


        vis.layout = d3.layout.cloud()
            .size([500, 500])
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw);


        function draw(words) {
            d3.select("#cloudDiv").append("svg")
                .attr("width", vis.layout.size()[0])
                .attr("height", vis.layout.size()[1])
                .append("g")
                .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                // .style("fill", "white")
                .style("font-family", "Impact")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
        }


        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        // check out the data
        // console.log(vis.surveyData)
        vis.words = ""

        vis.surveyData.forEach( d => {



        })



        console.log('final data structure: ', vis.surveyData);


        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        vis.layout.words([
            "anxiety", "fired", "co-worker", "job", "depression", "disorder", "support",
            "negative", "leave"].map(function(d) {
            return {text: d, size: 10 + Math.random() * 90, test: "haha"};
        }));

        vis.layout.start();

    }

}