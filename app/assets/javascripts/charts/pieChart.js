function PieChart(element, containerId) {
    this.element = element;
    this.containerId = containerId;
    this.data = [];

    this.prepare = function() {
        var attrX = this.element.attrX, attrY = this.element.attrY;
        var i = 0;
        this.data = this.element.data
            .filter(function (item) {
                return item.hasOwnProperty(attrX) && item.hasOwnProperty(attrY);
            })
            .map(function (item) {
                return {
                    key: item[attrX],
                    count: item[attrY]
                };
            })
    }

    this.draw = function() {
        this.prepare();
        
        var self = this;

        var width = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 75;
        var legendRectSize = 18;
        var legendSpacing = 4;

        var color = d3.scale.category20();

        var svg = d3.select('#' + containerId)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

        var arc = d3.svg.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);

        var pie = d3.layout.pie()
            .value(function(d) {
                return d.count;
            })
            .sort(null);

        this.data.forEach(function(d) {
            d.count = +d.count;
            d.enabled = true;
        });

        var path = svg.selectAll('path')
            .data(pie(this.data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.label);
            })
            .each(function(d) {
                this._current = d;
            });
        
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {

                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color)
            .on('click', function(label) {
                var rect = d3.select(this);
                var enabled = true;
                var totalEnabled = d3.sum(self.data.map(function(d) {
                    return (d.enabled) ? 1 : 0;
                }));

                if (rect.attr('class') === 'disabled') {
                    rect.attr('class', '');
                }
                else {
                    if (totalEnabled < 2) return;

                    rect.attr('class', 'disabled');
                    enabled = false;
                }

                pie.value(function(d) {
                    if (d.label === label) d.enabled = enabled;
                    return (d.enabled) ? d.count : 0;
                });

                path = path.data(pie(self.data));

                path.transition()
                    .duration(750)
                    .attrTween('d', function(d) {

                        var interpolate = d3.interpolate(this._current, d);

                        this._current = interpolate(0);

                        return function(t) {
                            return arc(interpolate(t));
                        };
                    });
            });

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                return d;
            });

    }
}

$(function() {
    var element = {
        type: "pie",
        data: [{
            "label": "Monday",
            "count": 379130
        }, {
            "label": "Tuesday",
            "count": 424923
        }, {
            "label": "Wednesday",
            "count": 430728
        }, {
            "label": "Thursday",
            "count": 432138
        }, {
            "label": "Friday",
            "count": 428295
        }, {
            "label": "Saturday",
            "count": 368239
        }, {
            "label": "Sunday",
            "count": 282701
        }]
    };
    
    var pieChart = cf.create(element, "piechart");
    pieChart.draw();
    
})

/**
 * data format:
 * 
 * {
 *  "key" : "string",
 *  "count" : "value"
 * }
 * 
 * Labels displayed on the chart: key attribute of data object
 * 
 */