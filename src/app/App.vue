<template>
	<div>
		<TaskList :tasks="tasks"></TaskList>
		<pre>{{tasks}}</pre>
	</div>
</template>

<script>
import state from './services/state';
import TaskList from './components/TaskList';
export default {
	name: 'App',
  computed: {
		tasks: () => state.tasks
	},
	components: { TaskList }
};
</script>

<style>
</style>
