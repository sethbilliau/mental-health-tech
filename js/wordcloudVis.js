/* * * * * * * * * * * * * *
*          Word Cloud Vis          *
* * * * * * * * * * * * * */

class WordCloudVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, surveyData, _title, _n) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        this.wordCloudTitle = _title;
        this.n = _n;

        this.parseDate = d3.timeParse("%m/%d/%Y");



        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svgtitle = d3.select("#cloudDiv").append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height/ 10);
        vis.svg =  d3.select("#cloudDiv").append("svg")
            .attr("width", vis.width)
            .attr("height", (vis.height * 9) /10);

        vis.svgtitle
            .append('g')
            .attr('class', 'title cloud-title')
            .append('text')
            .text(vis.wordCloudTitle)
            .style("word-break", "break-all;")
            .style("white-space", "normal")
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${vis.width / 2}, 20)`);

        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        // check out the data
        vis.wordslist = vis.surveyData.map(function(d, i) {
            return {index: i, text: d.word, size: d.freq};
        })

        vis.wordslist = vis.wordslist.filter(function(d, i) {
            console.log(d);
            return d.index < vis.n;
        });
        console.log(vis.wordslist);
        // console.log('final data structure: ', vis.surveyData);


        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        vis.scaler = d3.scaleLinear()
            .domain([
                d3.min(vis.wordslist, d=>d.size),
                d3.max(vis.wordslist, d=>d.size)])
            .range([12, 40]);

        vis.layout = d3.layout.cloud()
            .size([vis.width, vis.height*9/10])
            .padding(3)
            .rotate(function() { return 0; })
            .font("Impact")
            .fontSize(function(d) { return vis.scaler(d.size); })
            .on("end", draw);


        function draw(words) {
           vis.svg
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


        vis.layout.words(vis.wordslist);

        vis.layout.start();

    }

}