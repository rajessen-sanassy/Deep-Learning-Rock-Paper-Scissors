import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.less';
import 'antd/dist/antd.less';
import RootLayout from './components/layout/RootLayout';
import { CoreProvider } from './components/Provider';

function App() {
  return (
    <div className="App">
      <CoreProvider>
        <BrowserRouter>
          <RootLayout/>
        </BrowserRouter>
      </CoreProvider>
    </div>
  );
}

export default App;
