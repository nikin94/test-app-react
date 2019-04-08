import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes';
import 'antd/dist/antd.css';
import './assets/scss/style.scss';

ReactDOM.render((<BrowserRouter>{Routes}</BrowserRouter>), document.getElementById('root'));