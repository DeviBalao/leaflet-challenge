// Store our geojson link as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
//let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  //console.log(data.features);
  // Pass the features to a createMap() function:
  createMap(data.features);

});

function createMap(featuresData){

    //Get the coordinates of first element to set the center point
    let centerPoint = [featuresData[0].geometry.coordinates[1],featuresData[0].geometry.coordinates[0]];    
    let myMap = L.map("map", {
        center: centerPoint,
        zoom: 3
      });
      
    // Add a tile layer.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Define the array of colors 
    let colors = ["green","lightgreen","yellow","orange","red","darkred"]
    //Define the array of limits
    let limits = [-10,10,30,50,70,90]

    // Function to return color based on the depth (in KM) of earthquake
    function markerColor (depthValue){
        //Depth greater than 90
        if( depthValue > limits[5]) {return colors[5]}
        //Depth 70-90 
        else if(depthValue > limits[4] && depthValue <= limits[5]){ return colors[4] }
        //Depth 50-70
        else if (depthValue > limits[3] && depthValue <= limits[4]){ return colors[3] }
        //Depth 30-50
        else if (depthValue > limits[2] && depthValue <= limits[3]){ return colors[2] }
        //Depth 10-30
        else if (depthValue > limits[1] && depthValue <= limits[2]){ return colors[1] }
        //Depth -10-10
        else if (depthValue > limits[0] && depthValue <= limits[1]){ return colors[0] }
        //Depth less than -10
        else {return "gray"}
    }
    //Add the markers
    featuresData.forEach(element => {
        let lon = element.geometry.coordinates[0];
        let lat = element.geometry.coordinates[1];
        let depth = element.geometry.coordinates[2];        

        L.circle([lat,lon],
        {
            radius: element.properties.mag *30000,
            color: "black",
            weight:0.2,
            fillColor:markerColor(depth) ,
            fillOpacity: 0.5,            
        }
        ).bindPopup(`<h4>${element.properties.title} at depth ${depth} KM</h4>`)
        .addTo(myMap)
    });

        // Set up the legend
        let legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
            let div = L.DomUtil.create("div", "info legend");
            let legendLimits = limits;
            let legendColors = colors;
            let labels = [];            

            // Add the minimum and maximum.
             let legendInfo = "<h3>Earthquake Depth in KM</h3>"; //+ <div id =\" divsize\" >";
             div.innerHTML = legendInfo;

            legendLimits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + legendColors[index] + "\">" + "<b>"+  limit + " + </b></li>");
            });

            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };

    // Adding the legend to the map
    legend.addTo(myMap);

}