/* * * * * * * * * * * * * *
*          Word Cloud Vis          *
* * * * * * * * * * * * * */

class WordCloudVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, surveyData, _n) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        this.n = _n;

        this.initVis();
    }

    initVis() {
        let vis = this;



        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svg =  d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height );

        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        vis.selectedCategory = $('#wordSelector').val();
        // check out the data
        vis.filteredData = vis.surveyData.filter(function(d) {
            return d.type == vis.selectedCategory;
        });

        vis.wordslist = vis.filteredData.map(function(d, i) {
            return {index: i, text: d.word, size: +d.freq};
        })

        vis.displayData = vis.wordslist.filter(function(d) {
            return d.index < vis.n;
        });
        // console.log('final data structure: ', vis.displayData );

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        vis.scaler = d3.scaleLinear()
            .domain([
                d3.min(vis.displayData, d=>d.size),
                d3.max(vis.displayData, d=>d.size)])
            .range([12, 40]);

        vis.layout = d3.layout.cloud()
            .size([vis.width, vis.height])
            .padding(3)
            .rotate(function() { return 0; })
            .font("Impact")
            .fontSize(function(d) { return vis.scaler(d.size); })
            .on("end", draw);


        function draw(words) {
           vis.groups = vis.svg
                .append("g")
                .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] / 2 + ")");
           vis.words = vis.groups.selectAll("text")
                .data(words);

           vis.words.enter().append("text")
               .merge(vis.words)
                .style("font-size", function(d) { return d.size + "px"; })
                // .style("fill", )
                .style("font-family", "Impact")
                .attr("text-anchor", "middle")
               .attr("id", function(d) { return d.text; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });

            vis.words.exit().remove();

        }


        vis.layout.words(vis.displayData);


        vis.layout.start();

    }

    highlight(i) {
        d3.select("#" + i.text).style('fill', "cornflowerblue")

    }

    unhighlight(i) {
        d3.select("#" + i.text).style('fill', "black")
    }

}