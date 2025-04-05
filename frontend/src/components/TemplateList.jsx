import React, { useEffect, useState, useMemo } from 'react';
import { Table, Spin, Alert, Button, Popconfirm } from 'antd';
import { Link, useNavigate } from 'react-router-dom';  
import { DeleteOutlined } from '@ant-design/icons';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useMemo(() => localStorage.getItem('token'), []);
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:8080/templates', {
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
      const response = await fetch(`http://localhost:8080/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete template (Status: ${response.status})`);
      }

      setTemplates(templates.filter((template) => template.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/templates/edit/${id}`); 
  };

  if (loading) return <Spin size="large" tip="Loading templates..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link to={`/templates/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Popconfirm
            title="Are you sure you want to delete this template?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
      <div>
        <h2>Template List</h2>
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
