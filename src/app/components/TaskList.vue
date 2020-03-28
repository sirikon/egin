<template>
  <div>
		<div v-for="task in tasks" :key="task.id">
			<Task :task="task"></Task>
			<div style="margin-left: 1em">
				<TaskList :tasks="task.children"></TaskList>
			</div>
		</div>
  </div>
</template>

<script>
import state from "../services/state";
import Task from "./Task";
export default {
	name: "TaskList",
	props: ['tasks'],
  components: { Task }
};
</script>

<style>
</style>
