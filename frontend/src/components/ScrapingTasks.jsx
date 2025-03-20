import React, { useEffect, useState, useMemo } from 'react';
import { Table, Spin, Alert, Tag } from 'antd';
import { Link } from 'react-router-dom';
import BaseLayout from './BaseLayout';

const TemplateList = ({ onLogout }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:8080/scraping-tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch templates (Status: ${response.status})`);
        }

        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [token]);

  if (loading) return <Spin size="large" tip="Loading templates..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link to={`/scraping-task/${record.task_id}`}>{text}</Link> 
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    //   render: (isActive) => (
    //     <span style={{ color: isActive ? 'green' : 'red' }}>
    //       {isActive ? 'Active' : 'Inactive'}
    //     </span>
    //   ),
    },
    {
      title: 'category',
      dataIndex: 'category',
      key: 'category',
    },
  ];

  return (
    <BaseLayout
      onLogout={onLogout}
      breadcrumbs={[
        { title: 'Home' },
        { title: 'Dashboard' },
        { title: 'Templates' },
      ]}
    >
      <div>
        <h2>Scraper Tasks List</h2>
        <Table
          columns={columns}
          dataSource={templates}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </BaseLayout>
  );
};

export default TemplateList;
