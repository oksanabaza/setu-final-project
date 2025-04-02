import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Spin, Alert, Card, Descriptions } from 'antd';
import BaseLayout from './BaseLayout'; 

const EditTemplate = () => {
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [scrapingType, setScrapingType] = useState(''); 
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(0);  
  const [websiteId, setWebsiteId] = useState(0);  
  const [settings, setSettings] = useState({});  
  const token = localStorage.getItem('token');  

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!token) {
        setError('Authorization token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/templates/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch template (Status: ${response.status})`);
        }

        const data = await response.json();
        setTemplate(data);
        setName(data.name);
        setScrapingType(data.scraping_type);  
        setDescription(data.description);
        setUserId(data.user_id);  
        setWebsiteId(data.website_id);  
        setSettings(data.settings || {}); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, token]);

  const handleSubmit = async () => {
    if (!token) {
      setError('Authorization token is missing.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  
        },
        body: JSON.stringify({
          name,
          scraping_type: scrapingType,  
          user_id: userId,  
          website_id: websiteId, 
          settings,  
        }),
      });
  
      console.log('Response Status:', response.status); 
      console.log('Response Body:', await response.text()); 
  
      if (!response.ok) {
        throw new Error(`Failed to update template (Status: ${response.status})`);
      }
  
      navigate('/templates');
    } catch (err) {
      setError(err.message);
    }
  };
  

  if (loading) return <Spin size="large" tip="Loading template..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
  <>
      <h2>Edit Template</h2>
      <Card title="Template Details" style={{ marginBottom: '20px' }}>
        <Descriptions bordered>
          <Descriptions.Item label="ID">{template.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{template.name}</Descriptions.Item>
          <Descriptions.Item label="Scraping Type">{template.scraping_type}</Descriptions.Item>
          <Descriptions.Item label="Created At">{template.created_at}</Descriptions.Item>
          <Descriptions.Item label="User ID">{template.user_id}</Descriptions.Item>
          <Descriptions.Item label="Website ID">{template.website_id}</Descriptions.Item>
          <Descriptions.Item label="Wrapper">{JSON.stringify(template.wrapper)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template Name"
          style={{ marginBottom: '10px' }}
        />
        <Input
          value={scrapingType}
          onChange={(e) => setScrapingType(e.target.value)}
          placeholder="Scraping Type"
          style={{ marginBottom: '10px' }}
        />
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Template Description"
          rows={4}
          style={{ marginBottom: '10px' }}
        />
        <Button type="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default EditTemplate;
