import React from 'react';
import ReactDOM from 'react-dom/client';
import { BranchViewer } from './components/BranchViewer';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('rc-branch-viewer') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BranchViewer />
  </React.StrictMode>
); 