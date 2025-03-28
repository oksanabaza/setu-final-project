import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveAreaBump } from '@nivo/bump'

// const mockData = [
//   { country: 'USA', sales: 130, profit: 50 },
//   { country: 'Canada', sales: 90, profit: 40 },
//   { country: 'Germany', sales: 140, profit: 70 },
//   { country: 'France', sales: 100, profit: 30 },
//   { country: 'UK', sales: 120, profit: 60 },
// ];
const data = [
  {
    "id": "JavaScript",
    "data": [
      {
        "x": 2000,
        "y": 14
      },
      {
        "x": 2001,
        "y": 11
      },
      {
        "x": 2002,
        "y": 10
      },
      {
        "x": 2003,
        "y": 29
      },
      {
        "x": 2004,
        "y": 11
      },
      {
        "x": 2005,
        "y": 26
      }
    ]
  },
  {
    "id": "ReasonML",
    "data": [
      {
        "x": 2000,
        "y": 11
      },
      {
        "x": 2001,
        "y": 11
      },
      {
        "x": 2002,
        "y": 21
      },
      {
        "x": 2003,
        "y": 22
      },
      {
        "x": 2004,
        "y": 27
      },
      {
        "x": 2005,
        "y": 16
      }
    ]
  },
  {
    "id": "TypeScript",
    "data": [
      {
        "x": 2000,
        "y": 13
      },
      {
        "x": 2001,
        "y": 21
      },
      {
        "x": 2002,
        "y": 22
      },
      {
        "x": 2003,
        "y": 28
      },
      {
        "x": 2004,
        "y": 11
      },
      {
        "x": 2005,
        "y": 27
      }
    ]
  },
  {
    "id": "Elm",
    "data": [
      {
        "x": 2000,
        "y": 11
      },
      {
        "x": 2001,
        "y": 21
      },
      {
        "x": 2002,
        "y": 15
      },
      {
        "x": 2003,
        "y": 22
      },
      {
        "x": 2004,
        "y": 24
      },
      {
        "x": 2005,
        "y": 16
      }
    ]
  },
  {
    "id": "CoffeeScript",
    "data": [
      {
        "x": 2000,
        "y": 10
      },
      {
        "x": 2001,
        "y": 22
      },
      {
        "x": 2002,
        "y": 27
      },
      {
        "x": 2003,
        "y": 13
      },
      {
        "x": 2004,
        "y": 28
      },
      {
        "x": 2005,
        "y": 27
      }
    ]
  }
]
const NivoCharts = () => {
  return (
    <div style={{ height: 400 }}>
      {/* <ResponsiveBar
        data={mockData}
        keys={['sales', 'profit']}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'set2' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Country', legendPosition: 'middle', legendOffset: 32 }}
        axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Sales & Profit', legendPosition: 'middle', legendOffset: -40 }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 20,
            itemDirection: 'left-to-right'
          }
        ]}
      /> */}
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