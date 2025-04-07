import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Select, DatePicker, Table, Tag, Spin, message, Tabs, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const PushNotificationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          title: 'Scraping Task Scheduled!',
          message: 'Your scraping task for https://example.com has been scheduled.',
          date: '2025-04-04 10:30:00',
          status: 'Scheduled',
        },
        {
          id: 2,
          title: 'Scraping Task Completed!',
          message: 'The scraping task for https://example.com is complete, and the data has been successfully collected.',
          date: '2025-04-03 12:15:00',
          status: 'Completed',
        },
        {
          id: 3,
          title: 'Scraping Task Failed!',
          message: 'The scraping task for https://example.com failed due to an error.',
          date: '2025-04-03 14:00:00',
          status: 'Failed',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendNotification = async (values) => {
    setSendLoading(true);
    setTimeout(() => {
      const taskStatus = 'Scheduled'; 
      const newNotification = {
        id: notifications.length + 1,
        title: `Scraping Task ${taskStatus}!`,
        message: `Your scraping task for ${values.url} has been ${taskStatus.toLowerCase()}.`,
        date: new Date().toISOString(),
        status: taskStatus,
      };
      setNotifications([newNotification, ...notifications]); 
      message.success('Scraping task scheduled successfully!');
      form.resetFields();
      setSendLoading(false);
    }, 1500);
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Message', dataIndex: 'message', key: 'message' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Completed' ? 'green' : status === 'Scheduled' ? 'blue' : 'red'}>{status}</Tag> },
  ];

  return (
    <>
      <Typography.Title level={2} style={{ marginBottom: 48 }}>Scraping Task Notifications</Typography.Title>
      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="Send Notification" key="1">
          <Card>
            <Form form={form} onFinish={handleSendNotification} layout="vertical">
              <Form.Item
                name="url"
                label="Task"
                rules={[{ required: true, message: 'Please enter the task!' }]}
              >
                <Input placeholder="Enter the message" />
              </Form.Item>

              <Form.Item
                name="schedule_time"
                label="Schedule Time"
                rules={[{ required: true, message: 'Please select the schedule time!' }]}
              >
                <DatePicker showTime placeholder="Select schedule time" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={sendLoading}
              >
                Schedule Task
              </Button>
            </Form>
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Sent Notifications" key="2">
          <Card>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                columns={columns}
                dataSource={notifications}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            )}
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Settings" key="3">
          <Card>
            <p>Configure scraping task notification settings, like frequency, channels, etc.</p>
            <Button type="primary">Configure Settings</Button>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default PushNotificationsPage;
