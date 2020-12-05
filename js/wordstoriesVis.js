/* * * * * * * * * * * * * *
*          Word Cloud Vis          *
* * * * * * * * * * * * * */
class Story {

    // constructor method to initialize Timeline object
    constructor(parentElement, surveyData) {
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
        // Get random row and respondent, extract story string
        let randomRow = d3.randomInt(vis.surveyData.length)();
        vis.respondent = vis.surveyData[randomRow]
        vis.storyString = vis.surveyData[randomRow][vis.selectedCategory]

        // Get Special Strings to be highlighted
        let allStrings = SPECIALSTRINGS.concat(["mental", "health"])

        // Highlight Special Strings
        let specialStrings;
        for (specialStrings of allStrings) {
            // Check if special string appears in response and replace with regex match
            if (vis.storyString.toLowerCase().includes(specialStrings)) {
                let newstr = '<b style=\"color: lightblue\">' + specialStrings + '</b>'
                let regex = new RegExp("\\b" + specialStrings+ "\\b", "g")
                vis.storyString = vis.storyString.toLowerCase().replaceAll(regex, newstr)
            }


        }

        // Since we lower cased the string for matching, we need to reformat
        let re = /(^|[.!?]\s+)([a-z])/g;
        vis.storyString = vis.storyString.replace(re, (m, $1, $2) => $1 + $2.toUpperCase());
        let regex = /\bi\b/
        vis.storyString = vis.storyString.replace(regex, "I");

        // Fixes bug if user presses button multiple time very quickly
        if (vis.firstRun == false){
            vis.instance.destroy()
        }

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        // Create String to be shown and initialize p tag
        let str_final = 'Respondent ' + vis.respondent['X1'] + ': ' +vis.storyString
        $("#stories-p").html("")

        // Write instance
        vis.instance = new TypeIt("#stories-p", {
            strings: str_final,
            speed: 10,
            waitUntilVisible: false,

        }).go();
        vis.firstRun = false

    }

}