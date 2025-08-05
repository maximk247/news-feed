import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const DefaultLayout: React.FC = () => {
  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: 0 }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, minWidth: 0, width: '100%' }}
          defaultSelectedKeys={['news']}
          items={[{ key: 'news', label: <Link to="/">News</Link> }]}
        />
      </Header>

      <Content
        style={{
          padding: '20px 50px',
        }}
      >
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        My App ©{new Date().getFullYear()} Created by Kiyanitsa Maxim
      </Footer>
    </Layout>
  );
};

export default DefaultLayout;
