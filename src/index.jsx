import React from 'react';
import {createRoot} from "react-dom/client";
import App from "./App";

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
container.style.height = '100%';
const root = createRoot(container);

root.render(<App />);
