/* * * * * * * * * * * * * *
*          Word Cloud Vis          *
* * * * * * * * * * * * * */
class Story {

    // constructor method to initialize Timeline object
    constructor(parentElement, surveyData, _n) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;

        this.firstRun = true;
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

        if (vis.firstRun == false){
            vis.instance.destroy()
        }

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        let str_final = 'Respondent ' + vis.respondent['X1'] + ': ' +vis.storyString


        $("#stories-p").html("")


        vis.instance = new TypeIt("#stories-p", {
            strings: str_final,
            speed: 10,
            waitUntilVisible: false
        }).go();
        vis.firstRun = false


        // document.getElementById(vis.parentElement).innerHTML = '<p>Respondent ' + vis.respondent['X1'] + ': ' +vis.storyString +  '</p>';

    }

}