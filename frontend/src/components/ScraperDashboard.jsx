import React from 'react';
import BaseLayout from './BaseLayout';
import { ResponsiveCalendar, ResponsiveTimeRange } from '@nivo/calendar';

const Dashboard = ({ onLogout }) => {
  const calendarData = [
    {
      "value": 188,
      "day": "2025-05-16"
    },
    {
      "value": 148,
      "day": "2025-04-23"
    },
    {
      "value": 123,
      "day": "2025-09-13"
    },
    {
      "value": 384,
      "day": "2025-11-29"
    },
    {
      "value": 30,
      "day": "2025-03-20"
    },
    {
      "value": 2,
      "day": "2025-08-09"
    },
  ];

  const MyResponsiveCalendarComponent = ({ data }) => (
    <ResponsiveTimeRange
      data={data}
      from="2025-01-01"  
      to="2025-12-31"   
      emptyColor="#eeeeee"
      colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={40}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'row',
          translateY: 36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          itemDirection: 'right-to-left',
        },
      ]}
    />
  );

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ height: '400px' }}>
        <MyResponsiveCalendarComponent data={calendarData} />
      </div>
    </div>
  );
};

export default Dashboard;
