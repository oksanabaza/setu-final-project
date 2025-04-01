import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Input, Button, Upload, message, Form, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import BaseLayout from './BaseLayout';

const ScrapingTaskDetails = ({ onLogout }) => {
  const { id } = useParams();
  const [scrapingTask, setScrapingTask] = useState(null);
  const [template, setTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [links, setLinks] = useState([]);
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scrapingTaskResponse = await fetch(`http://localhost:8080/scraping-task/${id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        
        if (!scrapingTaskResponse.ok) {
          throw new Error('Failed to fetch scraping task details.');
        }
        const scrapingTaskData = await scrapingTaskResponse.json();
        setScrapingTask(scrapingTaskData);
        setLinks(scrapingTaskData.index_urls ? scrapingTaskData.index_urls.split(',') : []);

        const templateResponse = await fetch(`http://localhost:8080/templates/${scrapingTaskData.template_id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        
        if (!templateResponse.ok) {
          throw new Error('Failed to fetch template details.');
        }
        const templateData = await templateResponse.json();
        setTemplate(templateData);

        const allTemplatesResponse = await fetch('http://localhost:8080/templates', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!allTemplatesResponse.ok) {
          throw new Error('Failed to fetch templates.');
        }
        const allTemplatesData = await allTemplatesResponse.json();
        setTemplates(allTemplatesData);

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
      message.success('Links successfully loaded from file!');
    };
    reader.readAsText(file);
    return false;
  };
console.log(scrapingTask,'scrapingTask')
  const handleSave = async () => {
    try {
      const updatedTask = { 
        ...scrapingTask,
        ...form.getFieldsValue(), 
        index_urls: links.join(',') 
      };

      const response = await fetch(`http://localhost:8080/scraping-task/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update scraping task.');
      }

      message.success('Scraping task updated successfully!');
      setEditing(false);
      setScrapingTask(updatedTask);
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
  };

  const handleStartScraping = async () => {
    try {
      if (!template) {
        throw new Error('Template data not loaded.');
      }

      const payload = {
        elements: {
          description: template.settings.elements?.description || template.settings.description,
          price: template.settings.elements?.price || template.settings.price,
          title: template.settings.elements?.title || template.settings.title
        }, 
        links,
        type: template.scraping_type,
        is_xpath: template.is_xpath || true,
        wrapper: template.wrapper.String,
      };
      
      const response = await fetch('http://localhost:8080/scrape', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to start scraping.');
      }

      const scrapedData = await response.json();

      const saveDataResponse = await fetch('http://localhost:8080/post-results', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          TaskID: scrapingTask.task_id,  
          Result: JSON.stringify(scrapedData), 
        }),
      });
      

      if (!saveDataResponse.ok) {
        throw new Error('Failed to save extracted data.');
      }

      message.success('Scraping started and data extracted successfully!');
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
  };

  if (loading) return <Spin size="large" tip="Loading..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  const websiteName = websites.find((site) => site.id === scrapingTask.website_id)?.name || 'Unknown';

  return (
    <BaseLayout
      onLogout={onLogout}
      breadcrumbs={[
        { title: 'Home' },
        { title: 'Dashboard' },
        { title: 'Tasks', path: '/scraping-tasks' },
        { title: scrapingTask.name },
      ]}
    >
      <Card title={scrapingTask.name}>
        {editing ? (
          <Form
            form={form}
            initialValues={{
              name: scrapingTask.name,
              website: websiteName,
              category: scrapingTask.category,
              priority: scrapingTask.priority,
              schedule_cron: scrapingTask.schedule_cron,
              last_error: scrapingTask.last_error,
              template_id: scrapingTask.template_id,  
            }}
          >
            <Form.Item label="Task Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Website" name="website" disabled>
              <Input />
            </Form.Item>
            <Form.Item label="Category" name="category">
              <Input />
            </Form.Item>
            <Form.Item label="Priority" name="priority">
              <Input />
            </Form.Item>
            <Form.Item label="Schedule Cron" name="schedule_cron">
              <Input />
            </Form.Item>
            <Form.Item label="Last Error" name="last_error">
              <Input />
            </Form.Item>
            <Form.Item label="Template" name="template_id">
              <Select
                value={scrapingTask.template_id}
                onChange={(value) => {
                  setTemplate(templates.find(template => template.id === value));
                }}
              >
                {templates.map((template) => (
                  <Select.Option key={template.id} value={template.id}>
                    {template.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            {/* Wrapper field, populated based on selected template */}
            <Form.Item label="Wrapper" name="wrapper">
              <Input value={template ? template.wrapper.String : ''} disabled />
            </Form.Item>

            {/* Editable fields for links */}
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
          </Form>
        ) : (
          <>
            <p><strong>ID:</strong> {scrapingTask.task_id}</p>
            <p><strong>Website:</strong> {websiteName}</p>
            <p><strong>Status:</strong> {scrapingTask.status}</p>
            <p><strong>Category:</strong> {scrapingTask.category}</p>
            <p><strong>Priority:</strong> {scrapingTask.priority}</p>
            <p><strong>Schedule Cron:</strong> {scrapingTask.schedule_cron}</p>
            <p><strong>Last Error:</strong> {scrapingTask.last_error}</p>
            <p><strong>Wrapper:</strong> {scrapingTask.wrapper?.String}</p>
            <p><strong>Links:</strong></p>
            <ul>
              {links.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
            <Button onClick={() => setEditing(true)} type="primary">
              Edit
            </Button>
          </>
        )}

        <Button onClick={handleStartScraping} type="primary" style={{ marginTop: 16 }}>
          Start Scraping
        </Button>
      </Card>
    </BaseLayout>
  );
};

export default ScrapingTaskDetails;
