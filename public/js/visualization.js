// set up spinner
var spinnerVisible = false;

function showProgress() {
  if (!spinnerVisible) {
    $("div#spinner").fadeIn("fast");
    spinnerVisible = true;
  }
}

function hideProgress() {
  if (spinnerVisible) {
    var spinner = $("div#spinner");
spinner.fadeOut("medium");
    spinner.stop();
    spinner.hide();
    //
    spinnerVisible = false;
  }
}


var margin = {top: 20, right: 20, bottom: 100, left: 250};
var width = 1200 - margin.left - margin.right;
//var width = 820;
var height = 500 - margin.top - margin.bottom;




//define scale of x to be from 0 to width of SVG, with .1 padding in between
var x = d3.scale.ordinal() //ordianl() - because x axis are usernames, not numbers
  .rangeRoundBands([0, width], .1, 1); //bar padding .1

//define scale of y to be from the height of SVG to 0
var y = d3.scale.linear() 
  .range([height, 0]); //it's [height,0] so that the bar grows from the bottom of x-axis

//define axes
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y) //gets a number
  .orient("left");

  //create svg
var svg = d3.select("#content").append("svg")
  .attr("width", width + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

showProgress();

//get json object which contains media counts
d3.json('/igMediaCounts', function(error, data) {
    

  //set domain of x to be all the usernames contained in the data
  x.domain(data.users.map(function(d) { return d.username; }));
  //set domain of y to be from 0 to the maximum media count returned
  y.domain([0, d3.max(data.users, function(d) { return d.counts.media; })]);

  //set up x axis w/ labels
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
    .call(xAxis) //generates the visual representation 
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-7")
    .attr("dy", "0")
    .attr("transform", function(d) {
      return "rotate(-60)"; 
    });

  //set up y axis w/ labels
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6) //coordinate
    .attr("dy", ".5em")
    .style("text-anchor", "end")
    .text("Number of Posts");

  //set up bars in bar graph
  svg.selectAll(".bar")
    .data(data.users)
    .enter() //if there's no paragraph on the page before, there was no data on DOM before, a way to create a new placeholder.
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.username); }) //d as input
    .attr("width", x.rangeBand()) //width of the rectangle
    .attr("y", function(d) { return y(d.counts.media); })
    .attr("height", function(d) { return height - y(d.counts.media); })
    .on('mouseover', function(d) { showPop.call(this, d); })
    .on('mouseout', function(d) { removePop(); });


    hideProgress();

   d3.select("input").on("change", change);
   
  // var sortTimeout = setTimeout(function() {
  //  d3.select("input").property("checked", true).each(change);
 //  }, 50000); 

    function change() {
      //clearTimeout(sortTimeout);

      var x0 = x.domain(data.users.sort(this.checked
        ? function(a, b) { return a.counts.media - b.counts.media; }
        : function(a, b) { return d3.ascending(a.username, b.username); })
        .map(function(d) { return d.username; }))
        .copy();
    

    svg.selectAll(".bar")
      .sort(function(a, b) {return x0(a.username), x0(b.username); });

    var transition = svg.transition().duration(650),
        delay = function(d, i) {return i * 50; };

    transition.selectAll(".bar")
      .delay(delay)
      .attr("x", function(d) { return x0(d.username); });

      

    transition.select(".x.axis")
      .call(xAxis)
      .selectAll("g")
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("x", "0")
      .attr("y", "2")
      .delay();
    } 


    

    function removePop () {
      $('.popover').each(function() {
        $(this).remove();
      });
    }

    function showPop (d) {
      $(this).popover({
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html: true,
        content: function() {
             return "Media Count: " + d.counts.media;
        }
      });     
      $(this).popover('show')
    }




});








