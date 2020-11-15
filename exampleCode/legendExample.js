/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {

    constructor(parentElement, geoData, covidData, usaData){
        this.parentElement = parentElement;
        this.covidData = covidData;
        this.usaData = usaData;
        this.displayData = [];
        this.geoData = geoData;


        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.projection = d3.geoAlbersUsa() // d3.geoStereographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(670);

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.usa = topojson.feature(vis.geoData, vis.geoData.objects.states).features;

        vis.states = vis.svg.selectAll("path.state")
            .data(vis.usa)
            .enter().append("path")
            .attr('class', 'state')
            .attr("d", vis.path)
            // .style('fill', 'red')
            .style('stroke', 'black')

        vis.colorScale = d3.scaleLinear()
            .range(["white", "#136D70"]);
        
        //legend implementation starts here
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            // .attr('transform', `translate(${vis.width * 2.8 / 4}, ${vis.height - 20})`)
            .attr('transform', `translate(${vis.width * 2.2 / 4}, ${vis.height - 50})`);

        vis.legendScale = d3.scaleLinear()
            .range([0, 100]);

        vis.legendAxis = d3.axisBottom()
            .scale(vis.legendScale)
            .ticks(2);

        vis.legendVis = vis.legend.append("g")
            .attr("class", "legend-axis axis")
            .attr('transform', `translate(0, 6)`)
            .call(vis.legendAxis)
            .style('font-size', '8px');

        vis.linearGradient = vis.legend.append('linearGradient')
            .attr('id', 'linear-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');
        vis.linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", 'white');
        vis.linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#136D70");
        vis.legend.append("rect")
            .attr("width", 100)
            .attr("height", 6)
            .style("fill", "url(#linear-gradient)");

        //append tooltip
        vis.toolTip = d3.select("body").append('div')
            .attr('class', "toolTip");

        vis.wrangleData();

    }

    wrangleData(){

        let vis = this;
        let filteredData = [];
        // if there is a region selected
        if (selectedTimeRange.length !== 0){
            //console.log('region selected', vis.selectedTimeRange, vis.selectedTimeRange[0].getTime() )

            // iterate over all rows the csv (dataFill)
            vis.covidData.forEach( row => {
                // and push rows with proper dates into filteredData
                if (selectedTimeRange[0].getTime() <= vis.parseDate(row.submission_date).getTime() && vis.parseDate(row.submission_date).getTime() <= selectedTimeRange[1].getTime() ){
                    filteredData.push(row);
                }
            });
        } else {
            filteredData = vis.covidData;
        }

        // prepare covid data by grouping all rows by state
        let covidDataByState = Array.from(d3.group(filteredData, d =>d.state), ([key, value]) => ({key, value}));

        // init final data structure in which both data sets will be merged into
        vis.stateInfo = []

        //get the max and min for colorScale later
        vis.maxStat = 0

        // merge
        covidDataByState.forEach( state => {

            // get full state name
            let stateName = nameConverter.getFullName(state.key)

            // init counters
            let newCasesSum = 0;
            let newDeathsSum = 0;
            let population = 0;

            // look up population for the state in the census data set
            vis.usaData.forEach( row => {
                if(row.state === stateName){
                    population += +row["2019"].replaceAll(',', '');
                }
            })

            // calculate new cases by summing up all the entries for each state
            state.value.forEach( entry => {
                newCasesSum += +entry['new_case'];
                newDeathsSum += +entry['new_death'];
            });

            if(selectedCategory == 'absCases') {
                if (newCasesSum > vis.maxStat) {
                    vis.maxStat = newCasesSum;
                }
            }
            else if(selectedCategory == 'absDeaths'){
                if (newDeathsSum > vis.maxStat) {
                    vis.maxStat = newDeathsSum;
                }
            }
            else if(selectedCategory == 'relCases'){
                if ((newCasesSum/population*100) > vis.maxStat) {
                    vis.maxStat = (newCasesSum/population*100);
                }
            }
            else if(selectedCategory == 'relDeaths'){
                if ((newDeathsSum/population*100) > vis.maxStat) {
                    vis.maxStat = (newDeathsSum/population*100);
                }
            }

            // populate the final data structure
            vis.stateInfo[stateName] = {
                    state: stateName,
                    population: population,
                    absCases: newCasesSum,
                    absDeaths: newDeathsSum,
                    relCases: (newCasesSum/population*100),
                    relDeaths: (newDeathsSum/population*100)
                };
        })

        // console.log('final data structure for myMapVis', vis.stateInfo);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        //update scales and axes
        vis.colorScale.domain([0, vis.maxStat]);

        vis.legendScale.domain([0, vis.maxStat]);
        vis.legendAxis.scale(vis.legendScale);
        vis.legendVis.call(vis.legendAxis);

        // fill state colors and manage mouseover settings for tooltip
        vis.svg.selectAll('.state')
            .style('fill', d => {
                if (d.properties.name != 'American Samoa' && d.properties.name != 'Guam' && d.properties.name != 'Commonwealth of the Northern Mariana Islands' && d.properties.name != 'Puerto Rico'&& d.properties.name != 'United States Virgin Islands') {
                    return vis.colorScale(vis.stateInfo[d.properties.name][selectedCategory]);
                }
            })
            .on('mouseover', function(event, d){
                console.log('mouseover')
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', 'rgba(255,0,0,0.47)')
                vis.toolTip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
             <h6>${vis.stateInfo[d.properties.name].state}</h6>
             <p>Population: ${vis.stateInfo[d.properties.name].population}</p>      
             <p>Cases (absolute): ${vis.stateInfo[d.properties.name].absCases}</p> 
             <p>Deaths (absolute): ${vis.stateInfo[d.properties.name].absDeaths}</p>   
             <p>Cases (relative): ${vis.stateInfo[d.properties.name].relCases}</p>                        
             <p>Deaths (relative): ${vis.stateInfo[d.properties.name].relDeaths}</p>  
         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .style("fill", d => vis.colorScale(vis.stateInfo[d.properties.name][selectedCategory]))

                vis.toolTip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
    }
}