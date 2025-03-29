import React, { useEffect, useState, useMemo } from 'react';
import { Table, Spin, Alert, Tag, Button, Popconfirm } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';

const TemplateList = ({ onLogout }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useMemo(() => localStorage.getItem('token'), []);
  const navigate = useNavigate();

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
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/scraping-task/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the task');
      }

      setTemplates((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {/* <Button type="link" onClick={() => navigate(`/scraping-task/${record.task_id}`)}>Edit</Button> */}
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.task_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
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
