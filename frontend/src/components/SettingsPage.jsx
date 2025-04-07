import React, { useState } from 'react';
import { Card, Form, Switch, Button, Select, message, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSaveSettings = async (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Settings saved successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Typography.Title level={2} style={{ marginBottom: 48 }}>Settings</Typography.Title>
      <Card>
        <Form form={form} onFinish={handleSaveSettings} layout="vertical">
          {/* Notification Settings */}
          <Form.Item name="notificationsEnabled" label="Enable Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="notificationFrequency"
            label="Notification Frequency"
            rules={[{ required: true, message: 'Please select notification frequency!' }]}
          >
            <Select placeholder="Select notification frequency">
              <Select.Option value="instant">Instant</Select.Option>
              <Select.Option value="daily">Daily</Select.Option>
              <Select.Option value="weekly">Weekly</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dataStorage"
            label="Data Storage Location"
            rules={[{ required: true, message: 'Please select data storage location!' }]}
          >
            <Select placeholder="Select storage location">
              <Select.Option value="local">Local Storage</Select.Option>
              <Select.Option value="cloud">Cloud Storage</Select.Option>
            </Select>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
          >
            Save Settings
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default SettingsPage;
