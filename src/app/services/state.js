import Vue from 'vue';

const state = new Vue({
	data: () => {
		return {
			tasks: [
				{ id: 1, name: 'Hehe', done: false, children: [
					{ id: 2, name: 'Huehue', done: true, children: [] }
				] }
			]
		}
	}
});

export default state;
