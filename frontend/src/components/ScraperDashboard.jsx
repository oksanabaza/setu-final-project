import React from 'react';
import BaseLayout from './BaseLayout';
import { ResponsiveCalendar, ResponsiveTimeRange } from '@nivo/calendar';
import { Table, Tag, Typography } from 'antd';

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

  const tasksData = [
    {
      key: '1',
      task: 'Scrape Website A',
      date: '2025-05-16',
      status: 'In Progress',
    },
    {
      key: '2',
      task: 'Scrape Website B',
      date: '2025-04-23',
      status: 'Completed',
    },
    {
      key: '3',
      task: 'Scrape Website C',
      date: '2025-09-13',
      status: 'Pending',
    },
    {
      key: '4',
      task: 'Scrape Website D',
      date: '2025-11-29',
      status: 'Failed',
    },
    {
      key: '5',
      task: 'Scrape Website E',
      date: '2025-03-20',
      status: 'In Progress',
    },
  ];

  const taskStatus = {
    'In Progress': 'processing',
    'Completed': 'success',
    'Pending': 'default',
    'Failed': 'error',
  };

  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={taskStatus[status]}>
          {status}
        </Tag>
      ),
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
      <Typography.Title level={2} style={{ margin: 0 }}>Latest Scraping</Typography.Title>
      <div style={{ height: '200px' }}>
        <MyResponsiveCalendarComponent data={calendarData} />
      </div>

      {/* Mock Table for Recent Tasks */}
      <div style={{ marginTop: '30px', padding: '0 20px' }}>
        <Table
          columns={columns}
          dataSource={tasksData}
          pagination={false}
          bordered
        />
      </div>
    </div>
  );
};

export default Dashboard;
