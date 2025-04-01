import React, { useState } from 'react';
import { Layout, Space, Button, Tooltip, Drawer, Typography, Badge } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import SubNav from './SubNav';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const BaseLayout = ({ children, breadcrumbs, onLogout }) => {
  const [open, setOpen] = useState(false);
  const userName = localStorage.getItem('user_id');  

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 20px',
        }}
      >
        <img src="/icon.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <Title level={3} style={{ color: 'white', margin: 0 }}>ScrapeTrack</Title>

        <Space style={{ marginLeft: 'auto' }}>
          <Tooltip title="User Information">
            <Badge count={5} style={{ backgroundColor: '#52c41a' }}>
              <Button
                type="text"
                icon={<UserOutlined style={{ fontSize: '20px', color: 'white' }} />}
                onClick={showDrawer} 
              />
            </Badge>
          </Tooltip>
          <Tooltip title="Logout">
            <Button type="text" icon={<LogoutOutlined style={{ fontSize: '20px', color: 'white' }} />} onClick={onLogout} />
          </Tooltip>
        </Space>
      </Header>

      {/* Layout with Sidebar & Content */}
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <SubNav />
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbs} /> */}
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>

      {/* Drawer for User Info */}
      <Drawer
        title="User Information"
        onClose={onClose}
        open={open}
        width={300}
      >
        <p><strong>Username:</strong> {userName || 'Not Available'}</p>
        <p>tasks </p>
      </Drawer>
    </Layout>
  );
};

export default BaseLayout;
