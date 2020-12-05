/* expectations vs. reality double barchart for comparison */

class DoubleBarchart {


    constructor(_parentElement, _data, _surveyDemographics, _surveyGuesses) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.surveyDemographics = _surveyDemographics;
        this.surveyGuesses = _surveyGuesses;
        this.guessData = {
            "gender": 0.5,
            "age": 0.5,
            "race": 0.5,
            "job": 0.5
        }

        this.displayData = [];

        console.log('hello')

        // this.initVis();
    }

    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 100
        };

        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
            vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // Scales and axes

        let axisTicks = {
            qty: 5,
            outerSize: 0,
            tickFormat: d3.format('.0%')
        };

        vis.xScale0 = d3.scaleBand().range([0, vis.width - vis.margin.left - vis.margin.right]).padding(0.2)
        vis.xScale1 = d3.scaleBand()
        vis.yScale = d3.scaleLinear().range([vis.height - vis.margin.top - vis.margin.bottom, 0])

        vis.xAxis = d3.axisBottom(vis.xScale0).tickSizeOuter(axisTicks.outerSize);
        vis.yAxis = d3.axisLeft(vis.yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize).tickFormat(axisTicks.tickFormat);

        vis.xAxis_group = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(0,${vis.height - vis.margin.top - vis.margin.bottom})`)
        vis.yAxis_group = vis.svg.append("g")
            .attr("class", "y-axis axis")

        //legend
        vis.svg.append('rect')
            .attr('id', 'guess-legend')
            .attr('x', vis.width - vis.margin.right - vis.margin.left)
            .attr('width', 10)
            .attr('y', vis.margin.top + vis.height / 5)
            .attr('height', 10)
            .style('fill', '#B19CD9');
        vis.svg.append('text')
            .attr('id', 'guess-leg-label')
            .attr('x', vis.width - vis.margin.right - vis.margin.left + 15)
            .attr('width', 10)
            .attr('y', vis.margin.top + vis.height / 5 + 10)
            .attr('height', 10)
            .style('font-size', '15px')
            .style('fill', '#fafafa')
            .text('Your guess');


        vis.svg.append('rect')
            .attr('id', 'actual-legend')
            .attr('x', vis.width - vis.margin.right - vis.margin.left)
            .attr('width', 10)
            .attr('y', vis.margin.top + vis.height / 3.5)
            .attr('height', 10)
            .style('fill', '#ffb86c');
        vis.svg.append('text')
            .attr('id', 'actual-leg-label')
            .attr('x', vis.width - vis.margin.right - vis.margin.left + 15)
            .attr('width', 10)
            .attr('y', vis.margin.top + vis.height / 3.5 + 10)
            .attr('height', 10)
            .style('fill', '#fafafa')
            .style('font-size', '15px')
            .text('OSMI survey results');

        //y-axis label
        vis.svg.append('text')
            .attr('class', 'yaxis_label')
            .attr('x', 5)
            .attr('y', vis.margin.top - 20)
            .attr('text-anchor', 'start')
            .attr('transform', 'rotate(90, 5,' + (vis.margin.top - 20) + ')')
            .attr('font-size', 11)
            .style('fill', 'darkgray')
            .text('% struggling with Mental Health disorder');

        console.log(vis.displayData)

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    wrangleData() {

        let vis = this
        let age_min;
        let age_max;
        let category_label;
        vis.displayData = []
        vis.surveyDemographics = [selectedGender, selectedAge, selectedRace, selectedJob];
        vis.surveyGuesses = [vis.guessData.gender, vis.guessData.age, vis.guessData.race, vis.guessData.job]
        console.log(vis.data)
        vis.surveyDemographics.forEach((d, i) => {
            let demoFilter;

            if (i == 0) {
                if (d == 'Female') {
                    console.log('Female')
                    demoFilter = vis.data.filter(j => j.gender == 'F')
                } else if (d == 'Male') {
                    demoFilter = vis.data.filter(j => j.gender == 'M')
                } else {
                    demoFilter = vis.data.filter(j => j.gender == 'Other')
                }
                category_label = d;

            } else if (i == 1) {
                let age = d;
                if (age == '18-25') {
                    age_min = 18
                    age_max = 25
                } else if (age == '26-35') {
                    age_min = 26
                    age_max = 35
                } else if (age == '36_50') {
                    age_min = 36
                    age_max = 50
                } else {
                    age_min = 51
                    age_max = 75
                }
                category_label = d;
                demoFilter = vis.data.filter(j => j.age >= age_min && j.age <= age_max)
            } else if (i == 2) {
                category_label = d;
                if (d == 'Hispanic/Black'){
                    demoFilter = vis.data.filter(j => j.race == 'Hispanic' || j.race == 'Black or African American')
                }
                else if (d == 'Other Race'){
                    console.log('other race')
                    demoFilter = vis.data.filter(j => j.race != 'Hispanic' && j.race != 'Black or African American' && j.race != 'Asian' && j.race != 'White'&& j.race != 'NA')
                    console.log(demoFilter)
                }
                else{
                    demoFilter = vis.data.filter(j => j.race == d)
                }
            } else {
                if (d == 'Developer') {
                    demoFilter = vis.data.filter(j => j.dev == 1)
                }
                else if(d=='Management'){
                    demoFilter = vis.data.filter(j => j.mgmt == 1)
                }
                else if (d == 'Other Role'){
                    console.log('other job');
                    demoFilter = vis.data.filter(j => j.other_job == 1)
                    console.log(demoFilter)
                }
                else if (d == 'Designer'){
                    demoFilter = vis.data.filter(j => j.designer == 1)
                }
                else{
                    demoFilter = vis.data.filter(j => j.support == 1)
                }
                category_label = d;
            }

            let disorder_filter = demoFilter.filter(j => j.disorder == "Yes")
            // let disorder_filter = demoFilter.filter(j => j.disorder_diagnosed == "Yes" || j.past_disorder == "Yes" || j.disorder == "Yes")
            let disorder_count = disorder_filter.length;
            let disorder_percentage = disorder_count / demoFilter.length

            vis.displayData.push({
                'category': category_label,
                'guess': vis.surveyGuesses[i],
                'actual': disorder_percentage.toFixed(2)
            })

        });


        // //testing something - delete later
        // let filter = vis.data.filter(j => j.disorder == "Yes")
        // let count = filter.length;
        // let percentage = count / vis.data.length
        // console.log('percentage' + percentage)

        // vis.guessData = {
        //     "gender": 0,
        //     "age": 0,
        //     "race": 0,
        //     "job": 0
        // }

        console.log(vis.displayData);
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.xScale0.domain(vis.displayData.map(d => d.category));
        vis.xScale1.domain(['guess', 'actual']).range([0, vis.xScale0.bandwidth()]);

        vis.yScale.domain([0, 1])


        vis.categoryName_data = vis.svg.selectAll(".category-name")
            .data(vis.displayData)
        vis.categoryName = vis.categoryName_data.enter().append("g")
            .attr("class", "category-name")
            .merge(vis.categoryName_data)
            .attr("transform", d => `translate(${vis.xScale0(d.category)},0)`);



        /* Add field1 bars */
        let guess_bar_data = vis.categoryName.selectAll(".bar.field1")
            .data(d => [d])
        guess_bar_data.enter()
            .append("rect")
            .attr("class", "bar field1")
            .style("fill", "#B19CD9")
            .merge(guess_bar_data)
            .transition().duration(300)
            .attr("x", d => vis.xScale1('guess'))
            .attr("y", d => vis.yScale(d.guess))
            .attr("width", vis.xScale1.bandwidth())
            .attr("height", d => {
                return vis.height - vis.margin.top - vis.margin.bottom - vis.yScale(d.guess)
            });
        guess_bar_data.exit().remove()

        /*Add field 1 labels */
        let guess_label_data = vis.categoryName.selectAll('.guess-label')
            .data(d => [d]);
        guess_label_data.enter().append('text')
            .attr('class', 'guess-label')
            .style('font-size', '15px')
            .merge(guess_label_data)
            .transition().duration(300)
            .attr('x', d => vis.xScale1('guess') + vis.xScale1.bandwidth() / 3)
            .attr('y', d => vis.yScale(d.guess) - 10)
            .attr('fill', '#B19CD9')
            .style('font-weight','bold')
            .text(d => {
                let formatPerc = d3.format('.0%');
                return formatPerc(d.guess)
            });
        guess_label_data.exit().remove();

        // /* Add field2 bars */
        let actual_bar_data=vis.categoryName.selectAll(".bar.field2")
            .data(d => [d])
        actual_bar_data.enter()
            .append("rect")
            .attr("class", "bar field2")
            .style("fill", "#ffb86c")
            .merge(actual_bar_data)
            // .transition().duration(300)
            .attr("x", d => vis.xScale1('actual'))
            .attr("y", d => vis.yScale(d.actual))
            .attr("width", vis.xScale1.bandwidth())
            .attr("height", d => {
                return vis.height - vis.margin.top - vis.margin.bottom - vis.yScale(d.actual)
            });
        actual_bar_data.exit().remove();

        /* Add field2 labels */
        let actual_label_data = vis.categoryName.selectAll('.actual-label')
            .data(d => [d]);
        actual_label_data.enter().append('text')
            .attr('class', 'guess-label')
            .style('font-size', '15px')
            .merge(actual_label_data)
            // .transition().duration(300)
            .attr('x', d => vis.xScale1('actual') + vis.xScale1.bandwidth() / 3)
            .attr('y', d => vis.yScale(d.actual) - 10)
            .attr('fill', '#ffb86c')
            .style('font-weight', 'bold')
            .text(d => {
                let formatPerc = d3.format('.0%');
                return formatPerc(d.actual)
            });
        actual_label_data.exit().remove();
        vis.categoryName.exit().remove();

        // Add the X Axis
        vis.xAxis_group
            .call(vis.xAxis);
        // Add the Y Axis
        vis.yAxis_group
            .call(vis.yAxis);
    }

    onSliderChanged(val) {
        let vis = this;
        let splitVal = val.split(":");
        vis.guessData[splitVal[0]] = parseFloat(splitVal[1]);
        console.log(vis.guessData)
        vis.wrangleData()
    }
}