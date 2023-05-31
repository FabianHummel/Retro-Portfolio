/* @refresh reload */
import './style.css';
import './markdown.css'
import { render } from 'solid-js/web';
import { hashIntegration, Router } from '@solidjs/router';
import App from './App';

render(
	() => (
		<Router source={hashIntegration()} >
			<App />
		</Router>
	),
	document.getElementById('root')
);