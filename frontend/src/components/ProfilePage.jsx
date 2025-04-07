import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSaveProfile = async (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Typography.Title level={2} style={{ marginBottom: 48 }}>Profile</Typography.Title>
      <Card>
        <Form form={form} onFinish={handleSaveProfile} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Invalid email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
          >
            Save Profile
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default ProfilePage;
