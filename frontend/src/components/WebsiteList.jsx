import React, { useEffect, useState, useMemo } from 'react';
import { Spin, Alert, Button, Modal, Form, Input, Switch, Card, Row, Col, notification,Typography} from 'antd';

const WebsiteList = ({ onLogout }) => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [currentWebsite, setCurrentWebsite] = useState(null);
  const [form] = Form.useForm();

  const token = useMemo(() => localStorage.getItem('token'), []);

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

      const sortedWebsites = data.sort((a, b) => a.id - b.id);

      setWebsites(sortedWebsites);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchWebsites();
  }, [token]);

  const handleAddWebsite = async (values) => {
    try {
      const response = await fetch('http://localhost:8080/websites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add website (Status: ${response.status})`);
      }
  
      await fetchWebsites();
  
      setIsModalVisible(false);
      form.resetFields();
      notification.success({
        message: 'Website added',
        description: 'The website was added successfully!',
      });
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleUpdateWebsite = async (values) => {
    try {
      const response = await fetch(`http://localhost:8080/websites/${currentWebsite.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to update website (Status: ${response.status})`);
      }

      const updatedWebsite = await response.json();

      await fetchWebsites();

      setIsModalVisible(false);
      form.resetFields();
      notification.success({
        message: 'Website updated',
        description: 'The website was updated successfully!',
      });
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteWebsite = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/websites/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete website (Status: ${response.status})`);
      }

      await fetchWebsites();

      notification.success({
        message: 'Website deleted',
        description: 'The website was deleted successfully!',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = (website) => {
    setIsEditMode(true); 
    setCurrentWebsite(website);
    form.setFieldsValue({
      name: website.name,
      url: website.url,
      is_active: website.is_active,
      tags: website.tags ? website.tags.join(', ') : '',
      description: website.description || '',
      category: website.category || '', 
      image_url: website.image_url || '', 
    });
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setIsEditMode(false); 
    form.resetFields(); 
    setIsModalVisible(true);
  };

  if (loading) return <Spin size="large" tip="Loading websites..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <>
      <div>
        <Typography.Title level={2} style={{ margin: 0 }}>Website List</Typography.Title>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={handleCreate}
            style={{ marginBottom: 16 }}
          >
            Add Website
          </Button>
        </div>

        <Row gutter={16}>
          {websites.map((website) => (
            <Col span={8} key={website.id} style={{ marginBottom: 16 }}>
              <Card
                hoverable
                cover={
                  <img
                    alt={website.name}
                    src={website.image_url && website.image_url !== '' ? website.image_url : 'https://placehold.co/150x150'}
                    style={{
                      padding:"10px",
                      width: 'auto',
                      height: '150px',
                      objectFit: 'contain',
                      margin: '0 auto',
                    }}
                  />
                }
                actions={[
                  <Button type="link" onClick={() => handleUpdate(website)}>
                    Edit
                  </Button>,
                  <Button type="link" onClick={() => handleDeleteWebsite(website.id)} danger>
                    Delete
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={<a href={website.url} target="_blank" rel="noopener noreferrer">{website.name}</a>}
                  description={
                    <>
                      <div>
                        <span style={{ color: website.is_active ? 'green' : 'red' }}>
                          {website.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        {website.tags && website.tags.length > 0 && (
                          <span>{'{' + website.tags.join(' ').toUpperCase() + '}'}</span>
                        )}
                      </div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Add/Edit Website Modal */}
      <Modal
        title={isEditMode ? "Edit Website" : "Add New Website"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={isEditMode ? handleUpdateWebsite : handleAddWebsite}
          layout="vertical"
        >
          <Form.Item
            label="Website Name"
            name="name"
            rules={[{ required: true, message: 'Please input the website name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Website URL"
            name="url"
            rules={[{ required: true, message: 'Please input the website URL!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ message: 'Please input the website description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ message: 'Please input the website category!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="image_url"
          >
            <Input placeholder="Optional: Add image URL" />
          </Form.Item>
          <Form.Item
            label="Active"
            name="is_active"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item
            label="Tags"
            name="tags"
            rules={[{  message: 'Please select tags!' }]}
          >
            <Input placeholder="e.g. Tech, Finance" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update Website" : "Add Website"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </>
  );
};

export default WebsiteList;
