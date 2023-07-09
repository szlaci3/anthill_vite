import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useState, useMemo, useRef } from 'react';
import { Link, history } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
// import RightContent from '@/components/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import { stringify } from 'querystring';
import { toArrayIfPossible } from '@/utils/utils';
// import ChargingNotice from '@/components/ChargingNotice';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export type BasicLayoutProps = {
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;
/** Use Authorized check all menu item */


const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const initialState = {};
  const { currentUser, menu } = initialState;
  const [displayChargingNotice, setDisplayChargingNotice] = useState(false);
  
  const {
    children,
    location = {
      pathname: '/',
    },
  } = props;

  const [collapsed, setCollapsed] = useState(false);
  const [menuAvailable, setMenuAvailable] = useState();
  const menuDataRef = useRef<MenuDataItem[]>([]);
  /** Init variables */

  if (!menuAvailable) {
    if (!menu) {
      setMenuAvailable([]);
    } else {
      let menuTitles = toArrayIfPossible(menu);
      menuTitles = menuTitles.map(item => item.name);
      setMenuAvailable(menuTitles);
    }
  }
  
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => 
    !currentUser || currentUser.authStatus != 1 ?
      null
    :
      menuList
        .filter(item => menuAvailable.includes(item.name))
        .map(item => {
          const localItem = {
            ...item,
            icon: <div className={`iconfont icon-${item.iconClass}`}/>,
            children: item.children ? menuDataRender(item.children) : undefined,
          };
          return localItem as MenuDataItem;
          // return Authorized.check(item.authority, localItem, null) as MenuDataItem;
        });

  if (!menuAvailable) {
    return <></>
  }

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    window.setTimeout(() => {
      let grid = document.getElementsByClassName("virtual-grid")[0];
      if (grid) {
        document.getElementsByClassName("virtual-grid")[0].scrollLeft = grid.scrollLeft === 0 ? 1 : grid.scrollLeft - 1;
      }
    }, 500);
  }

  return (
    <>
      {/* <ChargingNotice
        visible={displayChargingNotice}
        onCancel={() => setDisplayChargingNotice(false)}
      /> */}

      <ProLayout
        logo="./src/img/blue.jpg"
        {...props}
        title={false}
        collapsed={collapsed}
        onCollapse={handleCollapse}
        collapsedButtonRender={false}
        siderWidth={250}
        headerHeight={73}
        headerContentRender={() => {
          return (
            <div
              onClick={handleCollapse}
              className='collapse-btn'
            >
              {collapsed ? <div><MenuUnfoldOutlined />Expand</div> : <div><MenuFoldOutlined />Collapse</div>}
            </div>
          );
        }}
        menuRender={(menuProps, defaultDom) => (<>
          {defaultDom}
        </>)}
        menuDataRender={menuDataRender}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path
          ) {
            return defaultDom;
          }

          if (location.pathname === menuItemProps.path) {
            return defaultDom;
          } else if (menuItemProps.isForCharge && currentUser && currentUser.vip != 1) {
            return <div onClick={() => {setDisplayChargingNotice(true)}}>{defaultDom}</div>
          } else {
            return <Link to={menuItemProps.path}>{defaultDom}</Link>
          }
        }}
        footerRender={false}
        rightContentRender={() => <div />}
        navTheme='light'
      >
        <div>
          Oh hi
          {/* {children} */}
        </div>
      </ProLayout>
    </>
  );
};

export default BasicLayout;