import React from 'react';
import * as d3 from 'd3';

const Component = React.Component;

function D3blackbox(D3render) {
    return class Blackbox extends Component {
        componentDidMount() { D3render.call(this); }
        componentDidUpdate() { D3render.call(this) }

        render() {
            const { x, y } = this.props;
            return <g transform={`translate(${x}, ${y})`} ref="anchor" />;
        }
    }
}

const Axis = D3blackbox(function () {
    const scale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, 200]);
    const axis = d3.axisBottom(scale);

    d3.select('svg')
        .append('g')
        .attr('transform', 'translate(10, 30)')
        .call(axis);
});

export default Axis;
