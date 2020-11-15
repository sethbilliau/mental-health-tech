let lineGraphVis;

// let promises = [
//     d3.csv("data/sp.csv")
// ]

// Promise.all(promises)
// .then(function (data) {
//     initMainPage(data)
// })
// .catch(function (err) {
//     console.log(err);
// });
d3.csv('data/sp.csv', function(data) {
    initMainPage(data);
})

function initMainPage(data) {
    lineGraphVis = new LineGraph("lineGraphDiv", data);
}