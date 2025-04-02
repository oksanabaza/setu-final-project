import React from 'react';
import BaseLayout from './BaseLayout';
import NivoCharts from './NivoCharts';
import MyResponsiveSunburst from './SunburstCharts';

const App = ({ onLogout }) => {
  return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <NivoCharts />
        </div>
        <div style={{ width: '48%' }}>
          <MyResponsiveSunburst />
        </div>
      </div>
  );
};

export default App;
