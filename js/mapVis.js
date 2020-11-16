/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, geoData, surveyData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.surveyData = surveyData;

        this.parseDate = d3.timeParse("%m/%d/%Y");



        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title map-title')
            .append('text')
            .text('United States')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        vis.lowColor = '#f9f9f9'
        vis.highColor = '#e11584'
        vis.ramp = d3.scaleLinear()
            .range([vis.lowColor,vis.highColor]);


        // TODO
        vis.projection = d3.geoAlbersUsa()
            .scale(700)
            .translate([vis.width / 2, vis.height / 2]);

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.usa = topojson.feature(vis.geoData, vis.geoData.objects.states).features

        vis.states = vis.svg.selectAll("path")
            .data(vis.usa)
            .enter()
            .append("path")
            .attr('class', 'states')
            .attr("d", vis.path);



        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');

        // vis.legend = vis.svg.append("g")
        //     .attr('class', 'legend')
        //     .attr('transform', `translate(${0}, ${vis.height - 20})`);
        // vis.legendText = vis.svg.append("g")
        //     .attr('class', 'legendText')
        //     .attr('transform', `translate(${0}, ${vis.height - 40})`);

        // vis.x = d3.scaleLinear()
        //     .range([0, vis.width/2]);
        //
        // vis.xAxis = d3.axisBottom(vis.x).ticks(4);
        //
        // vis.svg.append("g")
        //     .attr("class", "x-axis")
        //     .attr("transform", "translate("+ (3 *vis.width / 8)+ ","+(vis.height - 20) + ")");

        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        // check out the data
        // console.log(vis.surveyData)

        let filteredData = vis.surveyData.filter(function (d) {
            return d.country_live == "United States of America";
        });
        // console.log(filteredData);

        vis.numResponsesTotal = filteredData.length
        // console.log(vis.numResponsesTotal)

        // prepare covid data by grouping all rows by state
        let DataByState = Array.from(d3.group(filteredData, d =>d.state_work), ([key, value]) => ({key, value}))



        // have a look
        // console.log("Data by State" + DataByState)

        // init final data structure in which both data sets will be merged into
        vis.stateInfo = []

        // merge
        DataByState.forEach( state => {


            // get full state name


            // console.log(state)
            // init counters
            let numResponses = 0;
            let ageSum = 0;
            let disorderCount = 0;

            // calculate new cases by summing up all the entries for each state
            state.value.forEach( entry => {
                numResponses += 1;
                ageSum += +entry['age'];
                if (entry["disorder"] == "Yes") {
                    disorderCount += 1;
                }


            });

            // populate the final data structure
            vis.stateInfo.push(
                {
                    state: state.key,
                    numResponses: numResponses,
                    percResponses: numResponses/ vis.numResponsesTotal,
                    avgAge: ageSum / numResponses,
                    disorderCount: disorderCount ,
                    percDisorder: disorderCount / numResponses,

                }
            )

        })

        vis.stateInfo.push(
            {
                state: "Arkansas",
                numResponses: 0,
                percResponses: 0,
                avgAge: 0,
                disorderCount: 0,
                percDisorder: 0,
            }
        )

        console.log('final data structure for myDataTable', vis.stateInfo);


        vis.updateVis();

    }

    updateVis() {
        let vis = this;


        let selectedCategory = $('#categorySelector').val();
        // console.log(selectedCategory)
        let maxValue = d3.max(vis.stateInfo, d=>d[selectedCategory])
        // console.log(maxValue)
        vis.ramp
            .domain([0,maxValue])

        vis.states
            .on('mouseover', function(event, d){
                let index = vis.stateInfo.findIndex(p => p.state == d.properties.name);
                let f = d3.format(".2%")
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'cornflowerblue');

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 10px">
                             <h3> ${d.properties.name}<h3>
                             <p style="font-size: 12px"> Number of Responses (absolute): ${vis.stateInfo[index]["numResponses"]}</p>
                             <p style="font-size: 12px"> Perc. of Responses: ${f(vis.stateInfo[index]["percResponses"])}</p>
                             <p style="font-size: 12px"> Number of Disorders (Absolute): ${vis.stateInfo[index]["disorderCount"]}</p>
                             <p style="font-size: 12px"> Perc. of Respondents with Disorders (Relative): ${f(vis.stateInfo[index]["percDisorder"])}</p>
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", function(d) {
                        let index = vis.stateInfo.findIndex(p => p.state == d.properties.name);
                        if (index == -1) {
                            return "gray";
                        }
                        return vis.ramp(vis.stateInfo[index][selectedCategory]);
                    });

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .attr("fill", function(d) {
                // console.log(d)
                let index = vis.stateInfo.findIndex(p => p.state == d.properties.name);
                if (index == -1) {
                    return "gray";
                }
                return vis.ramp(vis.stateInfo[index][selectedCategory]);
            });

        // add a legend

        // var legend = vis.svg.append("defs")
        //     .append("svg:linearGradient")
        //     .attr("id", "gradient")
        //     .attr("x1", "100%")
        //     .attr("y1", "100%")
        //     .attr("x2", "0%")
        //     .attr("y2", "100%")
        //     .attr("spreadMethod", "pad");
        //
        // legend.append("stop")
        //     .attr("offset", "0%")
        //     .attr("stop-color", vis.highColor)
        //     .attr("stop-opacity", 1);
        //
        // legend.append("stop")
        //     .attr("offset", "100%")
        //     .attr("stop-color", vis.lowColor)
        //     .attr("stop-opacity", 1);

        // vis.svg.append("rect")
        //     .attr("width", vis.width/2)
        //     .attr("height", vis.height/11)
        //     .style("fill", "url(#gradient)")
        //     .attr("transform", "translate("+ (3 *vis.width / 8)+ ","+(vis.height - vis.height/11 - 20) + ")");

        // vis.x.domain([0, maxValue]);

        // vis.svg.select(".x-axis").call(vis.xAxis);


    }
}