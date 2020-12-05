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
        // check out the data
        let randomRow = d3.randomInt(vis.surveyData.length)();

        vis.respondent = vis.surveyData[randomRow]

        vis.storyString = vis.surveyData[randomRow][vis.selectedCategory]
        // vis.storyString = "Mental Seth Billiau"

        // let specialStrings = "Seth"
        let allStrings = SPECIALSTRINGS.concat(["mental", "health"])

        // console.log(allStrings)
        let specialStrings;
        for (specialStrings of allStrings) {
            // console.log(vis.storyString.toLowerCase())

            // console.log(vis.storyString.toLowerCase().includes(specialStrings))
            if (vis.storyString.toLowerCase().includes(specialStrings)) {
                // console.log('Seth is here')

                // console.log(specialStrings)
                let newstr = '<b style=\"color:#8be9fd\">' + specialStrings + '</b>'
                // console.log(newstr)
                // let regex = "(\\s|^)" + specialStrings+ "(?=\\s|$)"
                vis.storyString = vis.storyString.toLowerCase().replaceAll(specialStrings, newstr)
                // console.log(vis.storyString)
            }


        }


        let re = /(^|[.!?]\s+)([a-z])/g;
        vis.storyString = vis.storyString.replace(re, (m, $1, $2) => $1 + $2.toUpperCase());
        let regex = /\bi\b/
        vis.storyString = vis.storyString.replace(regex, "I");




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
            waitUntilVisible: false,
            afterComplete: async (step, instance) => {
            }
        }).go();
        vis.firstRun = false


        // document.getElementById(vis.parentElement).innerHTML = '<p>Respondent ' + vis.respondent['X1'] + ': ' +vis.storyString +  '</p>';

    }

}