import React, { useEffect, useState, useMemo } from 'react';
import { Table, Spin, Alert, Tag } from 'antd';
import BaseLayout from './BaseLayout';

const WebsiteList = ({ onLogout }) => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await fetch('http://localhost:8080/websites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch websites (Status: ${response.status})`);
        }

        const data = await response.json();

        const websitesWithTags = data.map((website) => ({
          ...website,
          tags: ['Tech', 'Finance', 'Health'],
        }));

        setWebsites(websitesWithTags);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [token]);

  if (loading) return <Spin size="large" tip="Loading websites..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;


  const getTagColor = (tag) => {
    if (tag === 'Tech') return 'blue';
    if (tag === 'Finance') return 'green';
    if (tag === 'Health') return 'red';
    return 'geekblue'; 
  };


  const columns = [
    {
      title: 'Website Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
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
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag, index) => {
            const color = getTagColor(tag);
            return (
              <Tag color={color} key={index}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
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
        { title: 'Websites' },
      ]}
    >
      <div>
        <h2>Website List</h2>
        <Table
          columns={columns}
          dataSource={websites}
          rowKey={(record) => record.website_id || record.url}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </BaseLayout>
  );
};

export default WebsiteList;
