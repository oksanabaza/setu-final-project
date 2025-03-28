import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import BaseLayout from './BaseLayout';

const TemplateDetails = ({ onLogout }) => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false); 
  const [links, setLinks] = useState([]);
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
        console.log('Fetched template data:', templateData);

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
        console.log('Fetched websites data:', websitesData);

        setTemplate(templateData);
        setWebsites(websitesData);
        setLinks(templateData.links || []); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const linksFromFile = e.target.result.split('\n').map(link => link.trim()).filter(link => link);
      setLinks(linksFromFile);
      // console.log('Links loaded from file:', linksFromFile); 
      message.success('Links successfully loaded from file!');
    };
    reader.readAsText(file);
    return false; 
  };
  
  const handleSave = async () => {
    try {
      // Convert links to a comma-separated string and update the index_urls field
      const updatedTemplate = { 
        ...template, 
        links, 
        index_urls: links.join(',')  // Update index_urls with the links state
      };
      console.log('Updated template before saving:', updatedTemplate);
  
      const response = await fetch(`http://localhost:8080/scraping-task/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTemplate),
      });
  
      const responseData = await response.json();
      console.log('Response from PUT request:', responseData);
  
      if (!response.ok) {
        throw new Error('Failed to update template.');
      }
  
      message.success('Template updated successfully!');
      setEditing(false); // Switch back to view mode
  
      // Re-fetch the data after save to confirm updated template
      const updatedResponse = await fetch(`http://localhost:8080/scraping-task/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated template data.');
      }
  
      const updatedTemplateData = await updatedResponse.json();
      setTemplate(updatedTemplateData);
      setLinks(updatedTemplateData.links || []);
      console.log('Fetched updated template data:', updatedTemplateData);
  
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
  };
  
  

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
        <p><strong>Started:</strong> {template.started_at?.time}</p>
        <p><strong>Completed:</strong> {template.completed_at?.time}</p>
        <p><strong>Category:</strong> {template.category}</p>
        <p><strong>Priority:</strong> {template.priority}</p>
        <p><strong>Attempts Count:</strong> {template.attempts_count}</p>
        <p><strong>Last Error:</strong> {template.last_error}</p>
        <p><strong>Schedule Cron:</strong> {template.schedule_cron}</p>

        {/* Editable fields for links */}
        {editing ? (
          <>
            <Upload
              showUploadList={false}
              beforeUpload={handleFileUpload}
              accept=".txt"
            >
              <Button icon={<UploadOutlined />}>Upload Links File (.txt)</Button>
            </Upload>
            <Input.TextArea
              value={links.join('\n')}
              onChange={(e) => setLinks(e.target.value.split('\n'))}
              rows={6}
              placeholder="Enter or edit links..."
            />
            <Button type="primary" onClick={handleSave} style={{ marginTop: 16 }}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <p><strong>Links:</strong></p>
            <ul>
              {links.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
            <Button onClick={() => setEditing(true)} type="primary">Edit</Button>
          </>
        )}
      </Card>
    </BaseLayout>
  );
};

export default TemplateDetails;
