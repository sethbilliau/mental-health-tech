class BubbleBar {
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        this.filteredData = surveyData;
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = $("#" + vis.parentElement).height()  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.filter = "gender";
        vis.subfilter = "M";
        this.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.surveyData.forEach(el => {
            if (el[vis.fiter] == vis.subfilter) {
                
            }
        })
        this.updateVis();
    }

    updateVis() {
        let vis = this;
    }
}