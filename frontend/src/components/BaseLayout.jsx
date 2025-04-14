import React, { useState , useEffect} from 'react';
import { Layout, Space, Button, Tooltip, Drawer, Typography, Badge, Breadcrumb, Card, ConfigProvider, Collapse, Row, Col, Avatar,Descriptions } from 'antd';
import { UserOutlined, LogoutOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import SubNav from './SubNav';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { theme } from 'antd';
import PageInfoCard from './PageInfoCard'
import moment from 'moment'; 

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Panel } = Collapse;

const BaseLayout = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_id');
  const [userData, setUserData] = useState(null);
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const token = localStorage.getItem('token');

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/user/${userName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [token]);
  // Define breadcrumb paths
  const breadcrumbNameMap = {
    '/dashboard': 'Dashboard',
    '/websites': 'Websites',
    '/templates': 'Templates',
    '/templates/:id': 'Template Detail',
    '/websites/create': 'Add Website',
    '/scraping-tasks': 'Tasks',
    '/create-scraping-task':"New Scraping Task",
    '/scraping-task/:id': 'Scraping Task Detail',
    '/templates/edit/:id': 'Edit Template',
    '/get-results': 'Outputs',
    '/get-results/:task_id': 'Recent Task Details',
    '/charts': 'Charts',
    '/notifications': 'Notifications',
    'profile':"Profile",
    'settings':"Settings",
  };
  const randomAvatars = [
    "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
    "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
    "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  ];

  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * randomAvatars.length);
    return randomAvatars[randomIndex];
  };
  const getBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbs = [];
    let fullPath = '';
  
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
console.log(userData,'userData')
console.log(userData?.username); 

const formattedLoginDate = userData?.last_login?.String
  ? moment(userData?.last_login?.String).isValid()
    ? moment(userData?.last_login?.String).format('YYYY/MM/DD HH:mm:ss')
    : 'N/A'
  : 'N/A';

console.log(formattedLoginDate ,'formattedLoginDate ')
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
        <Drawer title="User Information" onClose={onClose} open={open} width={350}>
          {/* <Card> */}
            <Avatar
              size={64}
              src={userData?.profile_picture?.String || getRandomAvatar()}
              style={{ marginBottom: 16 }}
            />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Username">
                {userData?.username?.String ? JSON.parse(userData?.username?.String).String : 'Default Username'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userData?.email?.String || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {userData?.role || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Last login">
                {formattedLoginDate || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          {/* </Card> */}
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
};

export default BaseLayout;
