import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <div className="ant-result ant-result-404">
    <div className="ant-result-icon ant-result-image">
      <img src={require("@/img/planet.png")} alt="" />
    </div>
    <div className="ant-result-title">404</div>
    <div className="ant-result-subtitle">Page not found.</div>
    <div className="ant-result-extra">
      <Button type="primary" onClick={() => history.push('/')}>
        Back
      </Button>
    </div>
  </div>
);

export default NoFoundPage;
