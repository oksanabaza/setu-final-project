import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
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
      style={{ height: '100%', borderRight: 0 }}
    >
      <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="User Menu">
        <Menu.Item key="websites">
          <Link to="/websites">Websites</Link>
        </Menu.Item>
        <Menu.Item key="templates">
          <Link to="/templates">Templates</Link>
        </Menu.Item>
        <Menu.Item key="scraping-tasks">
          <Link to="/scraping-tasks">scraping tasks</Link>
        </Menu.Item>
        <Menu.Item key="profile">Profile</Menu.Item>
        <Menu.Item key="settings">Settings</Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="sub2" icon={<LaptopOutlined />} title="Devices">
        <Menu.Item key="laptops">Laptops</Menu.Item>
        <Menu.Item key="tablets">Tablets</Menu.Item>
        <Menu.Item key="phones">Phones</Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="sub3" icon={<NotificationOutlined />} title="Notifications">
        <Menu.Item key="email-alerts">Email Alerts</Menu.Item>
        <Menu.Item key="push-notifications">Push Notifications</Menu.Item>
        <Menu.Item key="sms-alerts">SMS Alerts</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default SubNav;
