import React from 'vendors';
import Loadable from 'react-loadable';

function Loading(props) {
	if (props.error) {
		console.error(props.error);
		return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
	} else {
		return <div>Loading...</div>;
	}
}

const LoadableOne = Loadable({
	loader: () => import('./LazyOne'),
	loading: Loading
});

const LoadableTwo = Loadable({
	loader: () => import('./LazyTwo'),
	loading: Loading
});

export default class Display extends React.Component {
	constructor () {
		super();
		loadCopiedFile();
	}
	render () {
		return (
			<div>
				<h3>Display 1</h3>
				<LoadableOne/>
				<LoadableTwo/>
			</div>
		);
	}
}



function loadCopiedFile () {
	const s = document.createElement('script');
	s.src = '/file-to-copy.js';
	document.documentElement.children[0].appendChild(s);
}