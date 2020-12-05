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

        // Get Selected Category from appropriate Div
        vis.selectedCategory = $('#wordSelector').val();

        // Filter by selected
        vis.filteredData = vis.surveyData.filter(function(d) {
            return d.type == vis.selectedCategory;
        });

        // Get a words list
        vis.wordslist = vis.filteredData.map(function(d, i) {
            return {index: i, text: d.word, size: +d.freq};
        })

        // Filter according to desired number of words
        vis.displayData = vis.wordslist.filter(function(d) {
            return d.index < vis.n;
        });

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        // Initialize font scalar for word cloud
        vis.scaler = d3.scaleLinear()
            .domain([
                d3.min(vis.displayData, d=>d.size),
                d3.max(vis.displayData, d=>d.size)])
            .range([12, 40]);

        // Initialize layout
        vis.layout = d3.layout.cloud()
            .size([vis.width, vis.height])
            .padding(3)
            .rotate(function() { return 0; })
            .font("Impact")
            .fontSize(function(d) { return vis.scaler(d.size); })
            .on("end", draw);

        // Draw function for layout
        function draw(words) {
           vis.groups = vis.svg
                .append("g")
                .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] / 2 + ")");
           vis.words = vis.groups.selectAll("text")
                .data(words);

           vis.words.enter().append("text")
               .merge(vis.words)
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", "white")
                .style("font-family", "Impact")
                .attr("text-anchor", "middle")
               .attr('fill', '#ececec')
               .attr("id", function(d) { return d.text; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });

            vis.words.exit().remove();

        }

        // Instantiate word cloud and start
        vis.layout.words(vis.displayData);
        vis.layout.start();

    }


    // Functions for highlighting and unhighlighting link with barchart
    highlight(i) {
        d3.select("#" + i.text).style('fill', "#8be9fd")

    }

    unhighlight(i) {
        d3.select("#" + i.text).style('fill', "#ececec")
    }

}