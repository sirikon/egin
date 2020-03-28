<template>
	<div>
		<div>
			<Task v-for="task in tasks" :key="task.id" :task="task"></Task>
		</div>
		<pre>{{tasks}}</pre>
	</div>
</template>

<script>
import state from './services/state';
import Task from './components/Task';
export default {
	name: 'App',
  computed: {
		tasks: () => state.tasks
	},
	components: { Task }
};
</script>

<style>
</style>
