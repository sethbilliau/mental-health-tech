/* * * * * * * * * * * * * *
*          Word Cloud Vis          *
* * * * * * * * * * * * * */

class Story {

    // constructor method to initialize Timeline object
    constructor(parentElement, surveyData, _n) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.wrangleData();

    }

    wrangleData(){
        let vis = this;

        vis.selectedCategory = $('#wordSelector').val();
        // check out the data
        let randomRow = d3.randomInt(vis.surveyData.length)();

        vis.respondent = vis.surveyData[randomRow]

        vis.storyString = vis.surveyData[randomRow][vis.selectedCategory]

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        document.getElementById(vis.parentElement).innerHTML = '<p>Respondent ' + vis.respondent['X1'] + ': ' +vis.storyString +  '</p>';

    }

}