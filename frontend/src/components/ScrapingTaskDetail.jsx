import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert } from 'antd';
import BaseLayout from './BaseLayout';

const TemplateDetails = ({ onLogout }) => {
  const { id } = useParams(); 
  const [template, setTemplate] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch template details
        const templateResponse = await fetch(`http://localhost:8080/scraping-task/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!templateResponse.ok) {
          throw new Error('Failed to fetch template details.');
        }
        const templateData = await templateResponse.json();

        // Fetch websites
        const websitesResponse = await fetch('http://localhost:8080/websites', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!websitesResponse.ok) {
          throw new Error('Failed to fetch websites.');
        }
        const websitesData = await websitesResponse.json();

        setTemplate(templateData);
        setWebsites(websitesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) return <Spin size="large" tip="Loading template details..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  // Find the website name by matching the website_id
  const websiteName = websites.find((site) => site.id === template.website_id)?.name || 'Unknown';

  return (
    <BaseLayout
      onLogout={onLogout}
      breadcrumbs={[
        { title: 'Home' },
        { title: 'Dashboard' },
        { title: 'Tasks', path: '/scraping-tasks' },
        { title: template.name },
      ]}
    >
      <Card title={template.name}>
        <p><strong>ID:</strong> {template.task_id}</p>
        <p><strong>Website:</strong> {websiteName}</p>
        <p><strong>Status:</strong> {template.status}</p>
        <p><strong>Started:</strong> {template.started_at.time}</p>
        <p><strong>Completed:</strong> {template.completed_at.time}</p>
        <p><strong>Category:</strong> {template.category}</p>
        <p><strong>Priority:</strong> {template.priority}</p>
        <p>{template.attempts_count}</p>
        <p>{template.last_error}</p>
        <p>{template.schedule_cron}</p>
      </Card>
    </BaseLayout>
  );
};

export default TemplateDetails;
