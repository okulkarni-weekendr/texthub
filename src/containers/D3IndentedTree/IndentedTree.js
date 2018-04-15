import React from 'react';
import * as d3 from 'd3';
import data from './data';
import PropTypes from 'prop-types';
import constants from '../../constants/EditorConstants';

// Draws an entire color scale
class IndentedTree extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            colors: d3.schemeCategory20,
            width: 50,
            data: props.data,
            nodesSort: []
        };

        this.update = this.update.bind(this);
        this.color = this.color.bind(this);
        this.click = this.click.bind(this);
        this.wrap = this.wrap.bind(this);
        this.printWordCount = this.printWordCount.bind(this);
    }

    update(source) {

        let margin = {top: 50, right: 20, bottom: 30, left: 20},
            barHeight = 65;

        const svg = d3.select(this.refs.anchor);

        svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let i = 0,
            duration = 400;

        let diagonal = d3.linkHorizontal()
            .x(function(d) { return d.y; })
            .y(function(d) { return d.x; });


        // Compute the flattened node list. TODO use d3.layout.hierarchy.
        let nodes = this.state.nodes; //returns a single node with the properties of d3.tree()
        let nodesSort = [];

        // returns all nodes and each descendant in pre-order traversal (sort)
        let nodeCount = 0;
        nodes.eachBefore(function (n) {
            nodeCount++;
            nodesSort.push(n);
        });


        //transition to make svg looks smoother & dynamic height rendering
        let height = Math.max(500, nodeCount * barHeight + margin.top + margin.bottom);
        d3.select("svg").transition()
            .duration(duration)
            .attr("height", height);

        // Compute the "layout".
        nodesSort.forEach(function (n,i) {
            n.x = i *barHeight;
        });


        // Update the nodes…
        let node = svg.selectAll("g.node")
            .data(nodesSort, function (d) {
                return d.id || (d.id = ++i);
            }); //assigning id for each node

        const nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .style("opacity", 1e-6);

        // Enter any new nodes at the parent's previous position.
        nodeEnter.append("rect")
            .attr("y", -constants.IndentedTree.BAR_HEIGHT_TITLE / 4)
            .attr("height", function(d){
                return d.data.name === undefined
                    ? constants.IndentedTree.BAR_HEIGHT_TITLE
                    : d.data.name.split('').length < 50
                        ? constants.IndentedTree.BAR_HEIGHT_TITLE
                        : constants.IndentedTree.BAR_WIDTH_TEXT;
            })
            .attr("width", function(d){
                return d.data.name === undefined
                    ? constants.IndentedTree.BAR_WIDTH_TITLE
                    : d.data.name.split('').length < 50
                        ? constants.IndentedTree.BAR_WIDTH_TITLE
                        : constants.IndentedTree.BAR_WIDTH_TEXT;
            })
            .style("fill", this.color)
            .on("click", this.click);

        nodeEnter.append("text")
            .attr("dy", 10)
            .attr("dx", 5.5)
            .attr("x", constants.IndentedTree.NODEENTER_TEXT_X)
            .style("font-size", function (d) {
                console.log(d.data.name)
                return d.data.name === undefined
                    ? "12px"
                    : d.data.name.split('').length < 50 ? "16px" : "12px" ; })
            .text(function (d) {
                return d.depth === 0 ? d.data.name : d.depth === 1 ? d.data.name : d.data.name ; })
            .call(function(d){
                return d.data.name.split('').length > 100
                    ?   this.wrap
                    :   null
            }, constants.IndentedTree.TEXT_WRAP_WIDTH)
            .call(this.printWordCount);

        // Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1);

        node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1)
            .select("rect")
            .style("fill", this.color);

        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .style("opacity", 1e-6)
            .remove();

        //links
        let link = svg.selectAll(".link")
            .data(this.state.root.links(), function(d) { return d.target.id; });

        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                let o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();


        nodes.eachBefore(function (d) {
            d.x0 = d.x;
            d.y0 = d.y
        });

    }

    click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update(d);
    }

    color(d) {
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "lightgreen";
    }

    componentDidMount() {

        let root = d3.hierarchy(this.state.data); // Constructs a root node from the specified hierarchical data.
        let tree = d3.tree().nodeSize([0, 30]); //Invokes tree
        if(data !== null){
            this.setState(
                {
                    root: root,
                    tree: tree,
                    nodes: tree(root)
                }, () => {
                    let root = this.state.root;
                    this.update(root);
                }
            );
        }
    }

    componentDidUpdate(prevProps, prevState){
        let root = d3.hierarchy(this.state.data); // Constructs a root node from the specified hierarchical data.
        this.update(root);
    }

    //whole tree is being re-rendered each time because we are passing same root to the tree.
    //this can be avoided with entering the new root..
    componentWillReceiveProps(nextProps) {
        let root = d3.hierarchy(nextProps.data); // Constructs a root node from the specified hierarchical data.
        let tree = d3.tree().nodeSize([0, 30]); //Invokes tree

        if(nextProps.data !== null){
            this.setState(
                {
                    data: nextProps.data,
                    root: root,
                    tree: tree,
                    nodes: tree(root)
                });
        }
    }

    wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineHeight = 1.2, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0,
                tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", 1.1 + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dx", x)
                        .attr("dy", lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
    }

    printWordCount(text){
        let length;
        text.each(function() {
            var text = d3.select(this);
            length = text.text().split('').length;
        })
        return length;
    }

    render() {
        if(!data){
            console.log('data doesnt exist');
            return null;
        }

        return (
            <g ref='anchor' />
        )
    }
}

IndentedTree.propTypes = {
    data: PropTypes.object.isRequired
}

export default IndentedTree;
