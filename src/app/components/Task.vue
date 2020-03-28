<template>
	<div>
		<input type="checkbox" v-model="task.done">
		<label>{{ task.name }}</label>
	</div>
</template>

<script>
export default {
	name: 'Task',
  props: ['task']
};
</script>

<style>
</style>
