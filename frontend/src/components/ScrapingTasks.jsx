import React, { useEffect, useState, useMemo } from 'react';
import { Table, Spin, Alert, Tag, Button, Popconfirm,Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

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
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.task_id)}
            okText="Yes"
            cancelText="No"
          >
          <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
      <div>
        <Typography.Title level={2} style={{ marginBottom: 48 }}>Scraper Tasks List</Typography.Title>
        <Table
          columns={columns}
          dataSource={templates}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
  );
};

export default TemplateList;
