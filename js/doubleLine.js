class DoubleLine {
    constructor(parentElement, surveyData) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {
            top: 20,
            right: 40,
            bottom: 30,
            left: 50
        };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.parseTime = d3.timeParse("%Y");

        vis.x = d3.scaleTime().range([0, vis.width]);
        vis.y0 = d3.scaleLinear().range([vis.height, 0]);
        vis.y1 = d3.scaleLinear().range([vis.height, 0]);

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.displayData = {
            "has_disorder": {
                "2016": 0,
                "2017": 0,
                "2018": 0,
                "2019": 0
            }
            
        }

        console.log(vis.surveyData)
        this.updateVis();
    }

    updateVis() {
        let vis = this;
    }
}