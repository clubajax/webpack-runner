import React from 'vendors';

import '../styles/LazyTwo.scss';

const a = ['Mike', 'Madhu', '(was) Adam', 'No one else'];

const names = a.map(n => n).join(' ');

export default function LazyTwo () {
	return (
		<div className="lazy-two">
			<div>Lazy Two Component</div>
			<div>{names}</div>
		</div>
	);
}