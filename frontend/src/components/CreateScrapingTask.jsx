import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateScrapingTask = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [websites, setWebsites] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('No token found');
        return;
      }

      try {
        const response = await fetch('https://setu-final-project.onrender.com/templates', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setTemplates(data); 
        } else {
          throw new Error('Failed to fetch templates');
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    const fetchWebsites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('No token found');
        return;
      }

      try {
        const response = await fetch('https://setu-final-project.onrender.com/websites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setWebsites(data); 
        } else {
          throw new Error('Failed to fetch websites');
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchTemplates();
    fetchWebsites();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id'); 

    if (!userId) {
      message.error('No user ID found');
      setLoading(false);
      return;
    }

    const taskData = {
      ...values,
      user_id: parseInt(userId, 10),
      priority: parseInt(values.priority, 10),
      schedule_cron: formatCron(values.schedule_cron), 
    };

    try {
      const response = await fetch('https://setu-final-project.onrender.com/scraping-tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      message.success('Task created successfully');
      navigate('/templates'); 
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCron = (datetime) => {
    const date = new Date(datetime);
    return `${date.getMinutes()} ${date.getHours()} * * *`; 
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create New Scraping Task</h2>
      <Form onFinish={onFinish}>
        <Form.Item label="Task Name" name="name" rules={[{ required: true, message: 'Please enter the task name' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please enter the category' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Website URL" name="url" rules={[{ required: true, message: 'Please enter the website URL' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Priority" name="priority" rules={[{ required: true, message: 'Please enter the priority' }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Schedule Cron" name="schedule_cron" rules={[{ required: true, message: 'Please specify a cron schedule' }]}>
          <Input type="datetime-local" />
        </Form.Item>

        <Form.Item label="Index URLs" name="index_urls">
          <Input />
        </Form.Item>

        <Form.Item label="Website" name="website_id" rules={[{ required: true, message: 'Please select a website' }]}>
          <Select placeholder="Select a website">
            {websites.map((website) => (
              <Select.Option key={website.id} value={website.id}>
                {website.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Template" name="template_id" rules={[{ required: true, message: 'Please select a template' }]}>
          <Select placeholder="Select a template">
            {templates.map((template) => (
              <Select.Option key={template.id} value={template.id}>
                {template.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Create Task
        </Button>
      </Form>
    </div>
  );
};

export default CreateScrapingTask;
