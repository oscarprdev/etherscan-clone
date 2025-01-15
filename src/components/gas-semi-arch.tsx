import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const GasSemiArch = () => {
  const semiArchRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 400;
    const height = 400;
    const radius = 150;

    // Select the SVG element
    const svg = d3.select(semiArchRef.current).attr('width', width).attr('height', height);

    // Clear any existing content in the SVG
    svg.selectAll('*').remove();

    // Create an arc generator
    const arc = d3
      .arc()
      .innerRadius(100) // Inner radius of the semi-arch
      .outerRadius(radius) // Outer radius of the semi-arch
      .startAngle(0) // Start angle (0 radians)
      .endAngle(Math.PI); // End angle (π radians)

    // Append the arc path to the SVG
    svg
      .append('path')
      .attr('d', arc({ innerRadius: 100, outerRadius: radius, startAngle: 0, endAngle: Math.PI })) // Path data from the arc generator
      .attr('transform', `translate(${width / 2}, ${height / 2})`) // Center the arc
      .attr('fill', 'steelblue'); // Fill color
  }, []);

  return <svg ref={semiArchRef}></svg>;
};

export default GasSemiArch;
