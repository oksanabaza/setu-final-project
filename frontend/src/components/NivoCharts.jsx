import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveAreaBump } from '@nivo/bump'

const data = [
  {
    "id": "E-commerce",
    "data": [
      { "x": 2020, "y": 12 },
      { "x": 2021, "y": 18 },
      { "x": 2022, "y": 20 },
      { "x": 2023, "y": 25 },
      { "x": 2024, "y": 30 }
    ]
  },
  {
    "id": "News Sites",
    "data": [
      { "x": 2020, "y": 10 },
      { "x": 2021, "y": 12 },
      { "x": 2022, "y": 15 },
      { "x": 2023, "y": 14 },
      { "x": 2024, "y": 19 }
    ]
  },
  {
    "id": "Job Boards",
    "data": [
      { "x": 2020, "y": 8 },
      { "x": 2021, "y": 10 },
      { "x": 2022, "y": 13 },
      { "x": 2023, "y": 17 },
      { "x": 2024, "y": 22 }
    ]
  },
  {
    "id": "Real Estate",
    "data": [
      { "x": 2020, "y": 7 },
      { "x": 2021, "y": 9 },
      { "x": 2022, "y": 12 },
      { "x": 2023, "y": 18 },
      { "x": 2024, "y": 21 }
    ]
  },
  {
    "id": "Travel Platforms",
    "data": [
      { "x": 2020, "y": 6 },
      { "x": 2021, "y": 8 },
      { "x": 2022, "y": 10 },
      { "x": 2023, "y": 13 },
      { "x": 2024, "y": 16 }
    ]
  }
];

const NivoCharts = () => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveAreaBump
        data={data}
        margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
        spacing={8}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'CoffeeScript'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'TypeScript'
                },
                id: 'lines'
            }
        ]}
        startLabel="id"
        endLabel="id"
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -36,
            truncateTickAt: 0
        }}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
    />
    </div>
  );
};

export default NivoCharts;