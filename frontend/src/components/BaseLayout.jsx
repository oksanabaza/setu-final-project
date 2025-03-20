import React from 'react';
import { Layout, Breadcrumb, Typography, Button, Space, Tooltip } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import SubNav from './SubNav';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const BaseLayout = ({ children, breadcrumbs, onLogout }) => {
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
            <Button type="text" icon={<UserOutlined style={{ fontSize: '20px', color: 'white' }} />} />
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
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbs} />
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
    </Layout>
  );
};

export default BaseLayout;
