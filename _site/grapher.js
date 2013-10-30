var data, min;

var graphFacility = function(facility) {

  $("#chart").empty();

  // Load JSON of time series data
  d3.json("data.json", function(error, json) {
    if (error) return console.warn(error);

    data = json;

    // scale graphs so that x labels don't overlap too much with the
    // bottom of the time series
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    for (i = 0; i < json[facility]['raw'].length; i++) {
      var min = Math.min(min, json[facility]['raw'][i].y);
      var max = Math.max(max, json[facility]['raw'][i].y);
    }

    var linscale = d3.scale.linear().domain([min-15, max + 10])

    // crate graph instance
    var graph = new Rickshaw.Graph( {
	   element: document.getElementById("chart"),
	   renderer: 'line',
	   height: 300,
	   width: 650,
	   series: [
		  {
			 data: json[facility]['raw'],
			 color: "dimgrey",
          name: "Raw NDMI",
          scale: linscale
		  }, {
			 data: json[facility]['ma'],
			 color: "#FF6600",
          name: "Index Value",
          scale: linscale
		  }
	   ]
    });

    // create x axis as a time-scaled axis
    new Rickshaw.Graph.Axis.Time({
      graph: graph,
      orientation: 'bottom'
    });

    // Hover detail customization
    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	   graph: graph,
	   formatter: function(series, x, y) {
		  var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
		  var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
		  var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
		  return content;
	   }
    });

    graph.render();
    
  });
};

// graphFacility('newark1')
graphFacility('balltimore7')
