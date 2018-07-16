import { React, ReactDom } from 'vendors';
import Display from './components/Display';
import './styles/main.scss';
// import 'ui-shared/ui/icons/trash';

const renderApp = (Component) => {
	ReactDom.render(
		<div><span>Wilcox</span><Display /></div>, document.getElementById('container')
	);
};

renderApp();

if (module.hot) {
	module.hot.accept((err) => {
		console.log('HOT');
		if (err) {
			console.error('Cannot apply HMR update.', err);
		}
	});
}