# More Than Just Code. Mental Health in Tech Industry

### Seth Billiau, Sarah Hong, Austin Hwang

## Abstract

In our project, we examine the culture surrounding of mental health in the tech industry according to survey data from the nonprofit Open Sourcing Mental Illness (OSMI) from 2016 to 2020. Our motivation for doing this project is that many of our peers (including ourselves) are considering going into a career in tech after graduation, and we think it would be meaningful to see the current state of mental health within the tech industry. 

## Data sources
The main datasets we used are from https://osmihelp.org/research -- every year this organization collects survey responses from professionals within the tech industry, and asks them a series of questions about their employers' attitude on mental health, their demographic information, and their current mental health state.

## Deliverables

### Code

The `data` folder contains the data that we used for our visualizations, programmatic data cleaning (`cleaning` folder), and manual cleaning (`manuallycleaned` folder). The `fonts` folder contains necessary files for the Font-Awesome library to function correctly. The `img` folder contains some of the images that we display on our website. The `css` folder contains *CSS* files for styling. In the main directory, `index.html` contains our main *HTML* file. 

The `libraries` folder contains libraries that we used for some aesthetic aspects of the website like Font-Awesome for access to special fonts and TypeIt to type out certain titles for emphasis. 

Finally, the `js` folder contains the most of our work. `animate`, `scroll`, `sankey`, `dots`, and `d3.layout.cloud` are all files from libraries. `line.js` contains the code to create the timeline visualization for the tech industry. `bubble.js` and `bubbleBar.js` contain the code to create the dots visualization. `doubleBarchart.js` and `survey.js` contain the code to create the survey and corresponding double barchart visualization. `sankeyVis.js` contains the code to create the sankey visualizations. `wordcloudVis.js`, `wordbarVis.js`, and `wordstoriesVis.js` contain the code to create the word cloud, barchart, and word stories visualization. Finally, `main.js` initializes each visualization and contains several functions to link the visualizations together.

`helpers.js` and `mapVis.js` includes the code to create a map chart that was omitted in the final version of our site. 

### Screencast
- URL: [YouTube](TODO)

### Website

- URL: [Mental Health in the Tech Industry](https://austin-hwang.github.io/mental-health-tech/)
- Website features:

  - **Tech Industry Timeline**
    - Hover over dots to see the important dates that they represent. 

  - **Survey**
    - Check radio buttons based on your demographic group. 
    - Use the sliders to predict what percentage of tech professionals in each group have a mental health disorder.

  - **Bubbles Visualization**
    - Each person in a bubble represents ten people who took the OSMI survey. They are colored red if they struggle with a mental health issue or disorder. 
    - Scroll to see how mental health issues are distributed across different demographic groups.
    - Hover to see what mental health disorders they are struggling with.

  - **Sankey**
    - Steps through some key relationships between co-workers and workplace culture
    - Use drop downs to choose survey questions to comparer to one another
    - Hover nodes to see highlighted paths

  - **Stories**
    - This visualization shows participants' most frequently used words in response to prompts about employer behavior regarding mental health. 
    - Use the dropdown below to toggle between prompts.  
    - Use the response generator below the word cloud to read participants' full responses.    
    - Hover over words on the barchart to highlight them in the word cloud.

### Process Book

- URL: [Process Book](https://docs.google.com/document/d/1aOAqhj8ZtW3qWSxTRvcyOC-Ik3bKi29Fpku4HXvhh24/edit?usp=sharing)

### Helpful Sources Used
- Sankey: https://bl.ocks.org/vasturiano/b0b14f2e58fdeb0da61e62d51c649908
- Force layout: https://www.d3indepth.com/force-layout/
- Line graph: http://bl.ocks.org/markmarkoh/8700606
- Double barchart: https://medium.com/@vaibhavkumar_19430/how-to-create-a-grouped-bar-chart-in-d3-js-232c54f85894
- WHO study on workplace mental health: https://www.who.int/teams/mental-health-and-substance-use/mental-health-in-the-workplace
