import { createRoot } from 'react-dom/client';

import '~/static/styles/scrollbar.css';
import '~/static/styles/themes.css';
import '~/static/styles/global.css';

import { App } from './App';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
