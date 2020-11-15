class LineGraph {
    constructor(parentElement, displayData) {
        this.parentElement = parentElement;
        this.displayData = displayData;
        this.initVis();
    }

    initVis() {
        let vis = this;
        let parseYear = d3.timeParse("%Y");

        vis.margin = { top: 50, right: 50, bottom: 50, left: 50 };

        vis.width = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.9  - vis.margin.left - vis.margin.right;
        vis.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.3 - vis.margin.top - vis.margin.bottom;
     
        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleTime()
            .domain(d3.extent(vis.displayData, d => parseYear(d.date)))
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .domain([0, 40])
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d => d + "%")
            .ticks(5);

        // vis.svg.append("clipPath")
        //     .attr("id", "clip")
        //   .append("rect")
        //     .attr("width", vis.width)
        //     .attr("height", vis.height);
      

        let technologyData = vis.displayData.filter(d => d.industry === "Technology");
        let financialData = vis.displayData.filter(d => d.industry === "Financial");

        let line = d3.line()
            .x(d => vis.x(parseYear(d.date)))
            .y(d => vis.y(parseFloat(d.percent)))
            .curve(d3.curveMonotoneX);

        let colors = d3.scaleOrdinal(d3.schemeCategory10);
 

        let lines = vis.svg.selectAll("line")
            .data([technologyData, financialData])
            .enter()
            .append("g");
        
        lines.append("path")
            .attr('clip-path', 'url(#clip)')
            .attr("fill", "none")
            .attr("d", d => line(d));

        // lines.append("text")
        //     .attr("class", "serie_label")
        //     .datum(d => d)
        //     .attr("transform", `translate(${vis.x(parseYear(d.date)) + 10}, ${vis.y(parseFloat(d.percent)) + 5})`)
        //     .attr("x", 5)
        //     .text(d => d.industry);

        // const ghost_lines = lines.append("path")
        //     .attr("class", "ghost-line")
        //     .attr("d", function(d) { return line(d); });    

            vis.svg.selectAll(".ghost-line")
            .on('mouseover', function() {
                const selection = d3.select(this).raise();
        
                selection
                    .transition()
                    .delay("100").duration("10")
                    .style("stroke","#ed3700")
                    .style("opacity","1")
                    .style("stroke-width","3");
        
                // add the legend action
                const legend = d3.select(this.parentNode)
                    .select(".serie_label");
        
                legend
                    .transition()
                    .delay("100")
                    .duration("10")
                    .style("fill","#2b2929");
                })
        
            .on('mouseout', function() {
                const selection = d3.select(this)
        
                selection
                    .transition()
                    .delay("100")
                    .duration("10")
                    .style("stroke","#d2d2d2")
                    .style("opacity","0")
                    .style("stroke-width","10");
        
                // add the legend action
                const legend = d3.select(this.parentNode)
                    .select(".serie_label");
        
                legend
                    .transition()
                    .delay("100")
                    .duration("10")
                    .style("fill","#d2d2d2");
            });
        // vis.svg.call(this.hover, path)

        // let path = vis.svg.append('path')
        //     .attr('class', 'line');

        // vis.svg.selectAll('.line')
        //     .attr("d", line(vis.displayData));

        vis.svg.append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Add the x-axis.
        vis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);

            // Add the y-axis.
        vis.svg.append("g")
            .attr("class", "y axis")
            .call(vis.yAxis);

        let curtain = vis.svg.append('rect')
            .attr('x', -1 * vis.width)
            .attr('y', -1 * vis.height)
            .attr('height', vis.height)
            .attr('width', vis.width)
            .attr('class', 'curtain')
            .attr('transform', 'rotate(180)')
            .style('fill', '#ffffff')

        let t = vis.svg.transition()
            .delay(750)
            .duration(6000)
            .ease(d3.easeLinear);

        t.select('rect.curtain')
            .attr('width', 0);

        console.log(vis.displayData)

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;
        this.updateVis();
    }

    updateVis() {
        let vis = this;
    }

    hover(svg, path) {
  
        if ("ontouchstart" in document) svg
            .style("-webkit-tap-highlight-color", "transparent")
            .on("touchmove", moved)
            .on("touchstart", entered)
            .on("touchend", left)
        else svg
            .on("mousemove", moved)
            .on("mouseenter", entered)
            .on("mouseleave", left);
      
        const dot = svg.append("g")
            .attr("display", "none");
      
        dot.append("circle")
            .attr("r", 2.5);
      
        dot.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .attr("y", -8);
      
     function moved(event) {
          event.preventDefault();
          const pointer = d3.pointer(event, this);
          const xm = x.invert(pointer[0]);
          const ym = y.invert(pointer[1]);
          const i = d3.bisectCenter(data.dates, xm);
          const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
          path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
          dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
          dot.select("text").text(s.name);
        }
      
    function entered() {
          path.style("mix-blend-mode", null).attr("stroke", "#ddd");
          dot.attr("display", null);
        }
      
    function left() {
          path.style("mix-blend-mode", "multiply").attr("stroke", null);
          dot.attr("display", "none");
        }
      }
}