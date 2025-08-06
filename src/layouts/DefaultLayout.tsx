import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Header, Content, Footer } = Layout;

const menuItems = [{ key: 'news', label: <Link to="/">News</Link> }];

const DefaultLayout: React.FC = () => {
  const maxX = window.innerWidth - 60;

  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
          height: 64,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
          animate={{
            x: [-10, maxX, -10],
          }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            times: [0, 0.5, 1],
          }}
        >
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['news']} items={menuItems} />
        </motion.div>
      </Header>

      <Content style={{ padding: '20px 50px' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        My News Feed App ©{new Date().getFullYear()} Created by Kiyanitsa Maxim
      </Footer>
    </Layout>
  );
};

export default DefaultLayout;
