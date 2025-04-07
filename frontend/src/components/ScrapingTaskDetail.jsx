import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Spin, Alert, Input, Button, Upload, message, Form, Select, Row, Col, Descriptions, Typography, Divider, Space
} from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ScrapingTaskDetails = ({ onLogout }) => {
  const { id } = useParams();
  const [scrapingTask, setScrapingTask] = useState(null);
  const [template, setTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [links, setLinks] = useState([]);
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scrapingTaskResponse = await fetch(`http://localhost:8080/scraping-task/${id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!scrapingTaskResponse.ok) throw new Error('Failed to fetch scraping task details.');
        const scrapingTaskData = await scrapingTaskResponse.json();
        setScrapingTask(scrapingTaskData);
        setLinks(scrapingTaskData.index_urls ? scrapingTaskData.index_urls.split(',') : []);

        const templateResponse = await fetch(`http://localhost:8080/templates/${scrapingTaskData.template_id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!templateResponse.ok) throw new Error('Failed to fetch template details.');
        const templateData = await templateResponse.json();
        setTemplate(templateData);

        const allTemplatesResponse = await fetch('http://localhost:8080/templates', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (!allTemplatesResponse.ok) throw new Error('Failed to fetch templates.');
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
      const linksFromFile = e.target.result.split('\n').map(link => link.trim()).filter(Boolean);
      setLinks(linksFromFile);
      message.success('Links successfully loaded from file!');
    };
    reader.readAsText(file);
    return false;
  };

  const handleSave = async () => {
    try {
      const updatedTask = {
        ...scrapingTask,
        ...form.getFieldsValue(),
        index_urls: links.join(','),
      };

      const response = await fetch(`http://localhost:8080/scraping-task/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update scraping task.');

      message.success('Scraping task updated successfully!');
      setEditing(false);
      setScrapingTask(updatedTask);
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
  };

  if (loading) return <Spin size="large" tip="Loading..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <Card
      title={<Title level={4}>{scrapingTask.name}</Title>}
      extra={!editing && (
        <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
          Edit
        </Button>
      )}
    >
      {editing ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: scrapingTask.name,
            category: scrapingTask.category,
            priority: scrapingTask.priority,
            schedule_cron: scrapingTask.schedule_cron,
            last_error: scrapingTask.last_error,
            template_id: scrapingTask.template_id,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Task Name" name="name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Category" name="category">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Priority" name="priority">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Schedule Cron" name="schedule_cron">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Last Error" name="last_error">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Template" name="template_id">
                <Select
                  value={scrapingTask.template_id}
                  onChange={(value) => {
                    setTemplate(templates.find((t) => t.id === value));
                  }}
                >
                  {templates.map((t) => (
                    <Select.Option key={t.id} value={t.id}>
                      {t.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Wrapper">
            <Input value={template?.wrapper?.String || ''} disabled />
          </Form.Item>

          <Divider orientation="left">Links</Divider>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Upload
              showUploadList={false}
              beforeUpload={handleFileUpload}
              accept=".txt"
            >
              <Button icon={<UploadOutlined />}>Upload .txt</Button>
            </Upload>

            <Input.TextArea
              rows={6}
              value={links.join('\n')}
              onChange={(e) => setLinks(e.target.value.split('\n'))}
              placeholder="Paste or edit links here..."
            />
          </Space>

          <Row justify="end" gutter={12} style={{ marginTop: 24 }}>
            <Col>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={handleSave}>Save</Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <>
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Task ID">{scrapingTask.task_id}</Descriptions.Item>
            <Descriptions.Item label="Status">{scrapingTask.status}</Descriptions.Item>
            <Descriptions.Item label="Category">{scrapingTask.category}</Descriptions.Item>
            <Descriptions.Item label="Priority">{scrapingTask.priority}</Descriptions.Item>
            <Descriptions.Item label="Schedule Cron">{scrapingTask.schedule_cron}</Descriptions.Item>
            <Descriptions.Item label="Last Error">{scrapingTask.last_error}</Descriptions.Item>
            <Descriptions.Item label="Wrapper">{scrapingTask.wrapper?.String || '-'}</Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Links</Divider>
          <ul style={{ paddingLeft: '1.2em' }}>
            {links.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
};

export default ScrapingTaskDetails;
