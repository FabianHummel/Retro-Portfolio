/* @refresh reload */
import './style.css';
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import App from './App';

render(
	() => (
		<Router  >
			<App />
		</Router>
	),
	document.getElementById('root')
);