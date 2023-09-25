// Store our geojson link as queryUrl.
//let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
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

    // Function to return color based on the depth of earthquake
    function markerColor (depthValue){
        if( depthValue > 90) {return "darkred"}
        else if(depthValue > 70 && depthValue <= 90){ return "red" }
        else if (depthValue > 50 && depthValue <= 70){ return "orange" }
        else if (depthValue > 30 && depthValue <= 50){ return "yellow" }
        else if (depthValue > 10 && depthValue <= 30){ return "lightgreen" }
        else return "green"
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



}