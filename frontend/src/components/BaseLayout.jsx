import React, { useState } from 'react';
import { Layout, Space, Button, Tooltip, Drawer, Typography, Badge, Card } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import SubNav from './SubNav';
import { Outlet } from 'react-router-dom';

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
        {/* <img src="/icon3.png" alt="Logo" style={{ height: '40px', marginRight: '10px', transform: 'rotate(10deg)' }} /> */}
        <Title level={1} class='caveat-font' style={{ color: '#ffc76f', margin: 0 }}>ScrapeTrack</Title>

        <Space style={{ marginLeft: 'auto' }}>
          <Tooltip title="User Information">
            <Badge count={5} style={{ backgroundColor: '#ffc76f', color:"#001529" , borderColor:'#001529'}}>
              <Button
                type="text"
                icon={<UserOutlined style={{ fontSize: '20px', color: '#ffc76f' }} />}
                onClick={showDrawer} 
              />
            </Badge>
          </Tooltip>
          <Tooltip title="Logout">
            <Button type="text" icon={<LogoutOutlined style={{ fontSize: '20px', color: '#ffc76f' }} />} onClick={onLogout} />
          </Tooltip>
        </Space>
      </Header>

      {/* Layout with Sidebar & Content */}
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <SubNav />
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          {/* <div>test</div> */}
          <Card style={{marginTop:30}}>Conetnt</Card>
          {/* <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbs} /> */}
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
              marginTop: 30,
            }}
          >
            {/* {children} */}
            <Outlet /> 
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
