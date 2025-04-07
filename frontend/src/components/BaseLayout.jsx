import React, { useState } from 'react';
import { Layout, Space, Button, Tooltip, Drawer, Typography, Badge, Breadcrumb, Card, ConfigProvider, Collapse, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import SubNav from './SubNav';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { theme } from 'antd';
import PageInfoCard from './PageInfoCard'

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Panel } = Collapse;

const BaseLayout = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_id');
  const { darkAlgorithm, defaultAlgorithm } = theme;

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
    '/charts': 'Charts',
    '/notifications': 'Notifications',
    'profile':"Profile",
    'settings':"Settings",
  };

  const getBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbs = [];
    let fullPath = '';
  
    // Add Home breadcrumb explicitly
    breadcrumbs.push({ title: 'Home', path: '/dashboard' });
  
    for (let i = 0; i < pathSnippets.length; i++) {
      fullPath += `/${pathSnippets[i]}`;
  
      let name = null;
  
      // Match static routes
      if (breadcrumbNameMap[fullPath]) {
        name = breadcrumbNameMap[fullPath];
      } else {
        // Match dynamic routes like /scraping-task/:id or /get-results/:task_id
        Object.keys(breadcrumbNameMap).forEach((route) => {
          const routeRegex = new RegExp('^' + route.replace(/:\w+/g, '([\\w-]+)') + '$');
          if (routeRegex.test(fullPath)) {
            name = breadcrumbNameMap[route];
  
            if (route === '/scraping-task/:id') {
              const matches = fullPath.match(routeRegex);
              if (matches && matches[1]) {
                name = `Scraping Task Detail (${matches[1]})`; 
              }
            }
            
            if (route === '/get-results/:task_id') {
              const matches = fullPath.match(routeRegex);
              if (matches && matches[1]) {
                name = `Recent Task Details (${matches[1]})`; 
              }
            }
          }
        });
      }
  
      if (name) {
        breadcrumbs.push({
          path: fullPath,
          title: name,
        });
      }
    }
  
    if (pathSnippets[0] === 'scraping-task' && !breadcrumbs.some(b => b.title === 'Scraping Tasks')) {
      breadcrumbs.splice(1, 0, { title: 'Scraping Tasks', path: '/scraping-tasks' });
    }
  
    return breadcrumbs;
  };
  

  const handleClick = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm, 
      }}
    >
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
          <Title level={1} className='caveat-font' style={{ color: '#ffc76f', margin: 0 }}>
            ScrapeTrack
          </Title>

          <Space style={{ marginLeft: 'auto' }}>
            {/* Theme Toggle Button */}
            <div onClick={handleClick} style={{ cursor: "pointer" }}>
              {isDarkMode ? (
                <SunOutlined style={{ fontSize: "24px", color: "#ffc76f" }} />
              ) : (
                <MoonOutlined style={{ fontSize: "24px", color: "#ffc76f" }} />
              )}
            </div>

            <Tooltip title="User Information">
              <Badge count={5} style={{ backgroundColor: '#ffc76f', color: '#001529', borderColor: '#001529' }}>
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

    
            {/* <PageInfoCard/> */}

            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: isDarkMode ? "#1d1d1d" : "#fff", 
                borderRadius: 8,
                marginTop: 30,
              }}
            >
              <Outlet /> {/* Render the child routes here */}
            </Content>
          </Layout>
        </Layout>

        {/* Drawer for User Info */}
        <Drawer title="User Information" onClose={onClose} open={open} width={300}>
          <p><strong>Username:</strong> {userName || 'Not Available'}</p>
          <p>tasks</p>
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
};

export default BaseLayout;
