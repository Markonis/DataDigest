function SeriesChart(element, containerId){
    this.element = element;
    this.containerId = containerId;
    this.data = [];
    
    this.prepare = function(){
        var attrX = this.element.attrX, attrY = this.element.attrY;
        var i = 0;
        this.data = this.element.data
            .filter(function (item) {
                return item.hasOwnProperty(attrX) && item.hasOwnProperty(attrY);
            })
            .map(function (item) {
                return {
                    attrX: item[attrX],
                    attrY: item[attrY],
                    key: attrX
                };
            })
            .sort(function (a, b) {
                return a.attrX - b.attrX;
            });
    }
    
    this.draw = function(){
      this.prepare();   
      
      var dataGroup = d3.nest()
        .key(function(d) {return d.key;})
        .entries(this.data);
        
        var color = d3.scale.category10();
        var vis = d3.select("#" + this.containerId),
            WIDTH = 750,
            HEIGHT = 350,
            MARGINS = {
                top: 50,
                right: 20,
                bottom: 50,
                left: 60
            },
            lSpace = WIDTH/dataGroup.length,
            xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(this.data, function(d) {
                return d.attrX;
            }), d3.max(this.data, function(d) {
                return d.attrX;
            })]),
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(this.data, function(d) {
                return d.attrY;
            }), d3.max(this.data, function(d) {
                return d.attrY;
            })]),
            xAxis = d3.svg.axis()
            .scale(xScale),
            yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");
            
        var drawing = vis.append("svg").attr("width", WIDTH).attr("height", HEIGHT);
        
        drawing.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);
        drawing.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);
            
        var lineGen = d3.svg.line()
            .x(function(d) {
                return xScale(d.attrX);
            })
            .y(function(d) {
                return yScale(d.attrY);
            })
            .interpolate("basis");
        dataGroup.forEach(function(d,i) {
            drawing.append('svg:path')
            .attr('d', lineGen(d.values))
            .attr('stroke', color(d.key))
            .attr('stroke-width', 2)
            .attr('id', 'line_'+d.key)
            .attr('fill', 'none');
            drawing.append("text")
                .attr("x", (lSpace/2)+i*lSpace)
                .attr("y", HEIGHT - 5)
                .style("fill", color(d.key))
                .attr("class", "active-legend")
                .on('click',function(){
                    var active   = d.active ? false : true;
                    var opacity = active ? 0 : 1;
                    d3.select("#line_" + d.key).style("opacity", opacity);
                    d.active = active;
                })
                .text(d.key);
        });
    }
    
}

/**
 * data format:
 * 
 * {
 *  "key" : "string",
 *  "attrY" : "value"
 *  "attrX" : "value"
 * }
 * 
 * Labels displayed on the chart: key attribute of data object
 * 
 */