import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '~/App';
import '~/static/styles/scrollbar.css';
import '~/static/styles/themes.css';
import '~/static/styles/global.css';

import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
