"use strict";
require("./style.css");
let View = function (controller, svg, module) {
    window.model = module.env;
    
    // Update svg to refer to the d3 element
    svg = d3.select(svg);
    
    console.log(model.vars.get('clients'));
    // Create a group for each piece of data
    window.clients = svg.selectAll('g.client')
	    .data(model.vars.get('clients').items)
        .enter()
        .append('g')
        .attr('class','client');
    
    function clientXTransform(clientData, clientIndex){
        return 10 + clientIndex * 25;
    }
    
    function clientYTransform(clientData, clientIndex){
        return 30;
    }

    // For each client draw a circle, dictating x pos by index
    clients
	    .append('circle')   
	    .style('fill', '#aaaaaa')
        .attr('r', 10)
        .attr('cx', clientXTransform)
        .attr('cy', clientYTransform)
    
    // For each client create a text element and set the text to the value
    clients
	    .append('text')
        .attr('x', clientXTransform)
        .attr('y', clientYTransform)
        .style({
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': 12,
    })
        .text(function (d) { return d.requestId.value; });
    

    var maximumTimeout = 200000;
    // Function that returns an angle betwen 0 (timed out) and 2 PI (maximum timeout length) based on how long is left on the timer of a client
    function arcAngle(client){
        return (client.timeoutAt.value - controller.workspace.clock) / maximumTimeout * 2 * Math.PI;
    }

    // Arc function - arc starts at top and continues to an angle based on how long is left on timer
    // shrinking towards top as it gets closer to timing out
    var arc = d3.svg.arc()
    .innerRadius(10)
    .outerRadius(12)
    .startAngle(0)
    .endAngle(function (d) { return arcAngle(d) });
    
    // For each client add a path to represent timeout
    clients.append('path')
        .attr("transform", function (d, i) { return "translate(" + clientXTransform(d,i) + "," + clientYTransform(d,i) + ")"; })
        .style('stroke','#000')
        .attr('class', 'path')
        .attr('d', arc);
    
    return {
        update: function () {
            // On update set the text for each client to its new value
            clients.selectAll('text').text(function (d) { return d.requestId.value; });

            // For each client, update the timeout arc
            clients.selectAll('path').transition()
                .attrTween("d", function(b) {
                    var i = d3.interpolate({ value: b }, b);
                    return function (t) {
                        return arc(i(t));
                    };
            });
        }
    };

}; // View

module.exports = View;
