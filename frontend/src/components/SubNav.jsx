import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined ,BarChartOutlined,UnorderedListOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const SubNav = ({ currentTab, setCurrentTab }) => {

  const handleMenuClick = (e) => {
    setCurrentTab(e.key);  
  };

  return (
    <Menu
      mode="inline"
      onClick={handleMenuClick}
      selectedKeys={[currentTab]}
      style={{ height: '100%', borderRight: 0 , color:'#4c4b52'}}
    >
       <Menu.SubMenu key="sub2" icon={<LaptopOutlined />} title="Administration">
          <Menu.Item key="websites">
          <Link to="/websites">Websites</Link>
        </Menu.Item>
        <Menu.Item key="templates">
          <Link to="/templates">Templates</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="sub3" icon={<UnorderedListOutlined />} title="Tasks">
      <Menu.Item key="scraping-tasks">
          <Link to="/scraping-tasks">Tasks</Link>
        </Menu.Item>
        <Menu.Item key="output"><Link to="/get-results">Outputs</Link></Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="sub4" icon={<BarChartOutlined />} title="Statistics">
        <Menu.Item key="email-alerts">Charts</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="sub5" icon={<NotificationOutlined />} title="Notifications">
        <Menu.Item key="push-notifications">Push Notifications</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="User Menu">
        <Menu.Item key="profile">Profile</Menu.Item>
        <Menu.Item key="settings">Settings</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default SubNav;
