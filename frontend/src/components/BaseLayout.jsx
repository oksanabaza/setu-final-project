import React, { useState, useEffect } from 'react';
import { Layout, Space, Button, Tooltip, Drawer, Typography, Badge, Breadcrumb, Card } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import SubNav from './SubNav';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const BaseLayout = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const userName = localStorage.getItem('user_id');  

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // Define breadcrumb paths
  const breadcrumbNameMap = {
    '/dashboard': 'Dashboard',
    '/websites': 'Websites',
    '/templates': 'Templates',
    '/templates/:id': 'Template Detail',
    '/websites/create': 'Add Website',
    '/scraping-tasks': 'Scraping Tasks',
    '/scraping-task/:id': 'Scraping Task Detail',
    '/templates/edit/:id': 'Edit Template',
    '/get-results': 'Recent Tasks',
    '/get-results/:task_id': 'Recent Task Details',
  };

  // Function to generate breadcrumbs dynamically
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = pathnames.map((_, index) => {
      const currentPath = '/' + pathnames.slice(0, index + 1).join('/');

      let breadcrumbName = breadcrumbNameMap[currentPath] || currentPath;

      Object.keys(breadcrumbNameMap).forEach(route => {
        const regex = new RegExp(route.replace(/:\w+/g, '([\\w-]+)'));
        const match = currentPath.match(regex);
        if (match) {
          breadcrumbName = breadcrumbNameMap[route].replace(/:\w+/g, match[1]);
        }
      });

      return { title: breadcrumbName, path: currentPath };
    });

    return [{ title: 'Home', path: '/' }, ...breadcrumbs];
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
        <Title level={1} className='caveat-font' style={{ color: '#ffc76f', margin: 0 }}>ScrapeTrack</Title>

        <Space style={{ marginLeft: 'auto' }}>
          <Tooltip title="User Information">
            <Badge count={5} style={{ backgroundColor: '#ffc76f', color:"#001529", borderColor:'#001529' }}>
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
          <Breadcrumb style={{ margin: '16px 0' }}>
            {getBreadcrumbs().map((breadcrumb, index) => (
              <Breadcrumb.Item key={index}>
                <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Card style={{ marginTop: 30 }}>Content</Card>
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
            <Outlet /> {/* Render the child routes here */}
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
        <p>tasks</p>
      </Drawer>
    </Layout>
  );
};

export default BaseLayout;
