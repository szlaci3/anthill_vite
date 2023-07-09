import React, { useCallback, useEffect, useState } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { history, useModel } from 'umi';
import { connect } from 'dva';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { logout } from '@/services/login';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

export const goToLoginTriage = () => {
  if (process.env.NODE_ENV === "development") {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: history.location.pathname,
      }),
    });
  } else {
    window.location = `${SERVERIP}/home.html`;
  }
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await logout();
  const { query = {} } = history.location;
  const { redirect } = query;
  if (!window.location.hash.includes('#/user/login') && !redirect) {
    goToLoginTriage();
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        // setInitialState({ ...initialState, currentUser: undefined });
        // loginOut();
        history.push(`/user`);
        return;
      }
      if (key === 'settings') {
        history.push(`/company-setup`);
        return;
      }
      history.push(`/account/${key}`);
    },
    [initialState, setInitialState],
  );

  const loading = <div></div>;

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={`${styles.menu} guide1-hi guide1-alpha`} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="settings">
        <SettingOutlined />
        Settings
      </Menu.Item>

      <Menu.Item key="logout">
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return <>
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} user-name anticon`}>HI，{currentUser.name}</span>
        <span className="triangle-down"/>
      </span>
    </HeaderDropdown>
  </>
};

export default AvatarDropdown;