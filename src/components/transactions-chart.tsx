import { useQuery } from '@tanstack/react-query';
import { getBlock } from '@wagmi/core';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { config } from '~/config';
import { formatRelativeTime } from '~/lib/utils';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TransactionsChart = () => {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  const txHistory = useQuery({
    queryKey: ['txHistory'],
    queryFn: async (): Promise<{ block: number; tx: number; timestamp: number }[]> => {
      const txHistory = [];
      const latestBlock = await getBlock(config);
      txHistory.push({
        block: Number(latestBlock.number),
        tx: latestBlock.transactions.length,
        timestamp: Number(latestBlock.timestamp),
      });

      for (let i = 20; i >= 0; i--) {
        const currentBlock = await getBlock(config, {
          blockNumber: BigInt(Number(latestBlock.number) - i * 1000),
        });
        txHistory.push({
          block: Number(currentBlock.number),
          tx: currentBlock.transactions.length,
          timestamp: Number(currentBlock.timestamp),
        });

        await sleep(100);
      }

      return txHistory;
    },
  });

  useEffect(() => {
    const handleResize = () => {
      if (graphRef.current) {
        setChartWidth(graphRef.current.offsetWidth);
      }
    };

    // Set initial width
    if (graphRef.current) {
      setChartWidth(graphRef.current.offsetWidth);
    }

    // Add event listener to handle resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const data = txHistory.data;

    if (!data || data.length === 0) return;

    const margin = { top: 10, right: 20, bottom: 11, left: 20 };
    const width = chartWidth - margin.left - margin.right;
    const height = 90 - margin.top - margin.bottom;

    // Clear previous graph
    d3.select(graphRef.current).select('svg').remove();

    // Create an SVG container
    const svg = d3
      .select(graphRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse and scale the data
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp * 1000)) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.tx) ?? 0])
      .range([height, 0]);

    // Add the X-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues([
            new Date(d3.min(data, d => d.timestamp * 1000) ?? 0),
            new Date(data[data.length - 1].timestamp * 1000),
          ])
          .tickFormat(d => formatRelativeTime((d as Date).getTime() / 1000))
          .tickSize(0)
      )
      .selectAll('text')
      .each(function (_, i) {
        if (i === 0) {
          d3.select(this).attr('transform', 'translate(30, 0)');
        }

        if (i === 1) {
          d3.select(this).attr('transform', 'translate(-20, 0)');
        }
      });

    // Add the Y-axis
    svg.append('g').call(
      d3
        .axisLeft(yScale)
        .tickValues([0, d3.max(data, d => d.tx) ?? 0])
        .tickSize(0)
    );

    // Remove axis lines
    svg.selectAll('path').remove();

    // Add a line connecting the points
    const line = d3
      .line<{ block: number; tx: number; timestamp: number }>()
      .x(d => xScale(new Date(d.timestamp * 1000)))
      .y(d => yScale(d.tx))
      .curve(d3.curveMonotoneX);

    const modifiedData = data.slice(1, data.length);

    svg
      .append('path')
      .datum(modifiedData)
      .attr('fill', 'none')
      .attr('stroke', '#68686A')
      .attr('d', line);
  }, [txHistory, chartWidth]);

  return (
    <section className="-mr-5 mt-3 w-full py-2 lg:mt-0 lg:w-2/3 lg:px-5">
      <p className="text-xs uppercase text-stone-500">Transactions history in 2 days</p>
      <div className="w-full" ref={graphRef}></div>
    </section>
  );
};

export default TransactionsChart;
