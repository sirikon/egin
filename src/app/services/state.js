import Vue from 'vue';

const state = new Vue({
	data: () => {
		return {
			tasks: [
				{ id: 1, name: 'Hehe', done: false }
			]
		}
	}
});

export default state;
