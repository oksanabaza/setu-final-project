import React, { useEffect, useState, useMemo } from 'react';
import BaseLayout from './BaseLayout';
import { ResponsiveTimeRange } from '@nivo/calendar';
import { DatePicker, Table, Tag, Typography, Spin, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const Dashboard = ({ onLogout }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const token = useMemo(() => localStorage.getItem('token'), []);

  const taskStatus = {
    'In Progress': 'processing',
    'Completed': 'success',
    'Pending': 'default',
    'Failed': 'error',
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Space direction="vertical" style={{ width: 200 }}>
          <DatePicker
            value={selectedKeys[0] ? moment(selectedKeys[0]) : null}
            onChange={(date) => {
              setSelectedKeys(date ? [date.format('YYYY-MM-DD')] : []);
            }}
            allowClear
            style={{ width: '100%' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
              }}
            >
             
            </Button>
          </Space>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return moment(record[dataIndex]).format('YYYY-MM-DD') === value;
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
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
      ...getColumnSearchProps('date'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Failed', value: 'Failed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color={taskStatus[status]}>{status}</Tag>,
    },
  ];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('https://setu-final-project.onrender.com/get-results', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch results (Status: ${response.status})`);
        }

        const data = await response.json();
        const results = data.Results;

        if (!Array.isArray(results)) {
          throw new Error('Unexpected API response format: expected an array');
        }

        const counts = {};
        const tasksTableData = [];

        results.forEach((result) => {
          const date = result.created_at.split('T')[0];
          counts[date] = (counts[date] || 0) + 1;

          tasksTableData.push({
            key: result.id,
            task: `Scrape Task #${result.TaskID}`,
            date,
            status: 'Completed',
          });
        });

        setCalendarData(Object.entries(counts).map(([day, value]) => ({ day, value })));
        setTasksData(tasksTableData);
      } catch (err) {
        console.error('Error fetching results:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

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
    <div style={{ height: '100vh', padding: '20px' }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        Latest Scraping
      </Typography.Title>

      {loading ? (
        <Spin size="large" style={{ marginTop: '50px' }} />
      ) : (
        <>
          <div style={{ height: '200px' }}>
            <MyResponsiveCalendarComponent data={calendarData} />
          </div>

          <div style={{ marginTop: '30px' }}>
            <Table
              columns={columns}
              dataSource={tasksData}
              pagination={{ pageSize: 5, showSizeChanger: false }}
              size="small"
              bordered
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
