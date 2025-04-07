import React from 'react';
import BaseLayout from './BaseLayout';
import NivoCharts from './NivoCharts';
import MyResponsiveSunburst from './SunburstCharts';
import { Typography } from 'antd';

const Charts = ({ onLogout }) => {
  return (
    <>
  <Typography.Title level={2} style={{ marginBottom: 48 }}>Statistics</Typography.Title>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <NivoCharts />
        </div>
        <div style={{ width: '48%' }}>
          <MyResponsiveSunburst />
        </div>
      </div>
      </>
  );
};

export default Charts;
