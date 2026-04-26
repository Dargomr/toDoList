<template>
  <div class="tasks-view">
    <h1 class="header">To-Do List</h1>
    <div class="to-do">
      <div class="upper">
        <button class="delete-all-checked">delete all checked</button>
        <button class="complete-all-checked">complete all checked</button>
      </div>
      <form class="input-add" id ='inputAdd' name ='inputAdd' @submit.prevent="addNewTask">
        <input class="input-field" type="text" name="inputField" v-model="newTaskText"/>
        <button class="add-li-button" type="submit">Add</button>
      </form>

      <p v-if="errorMsg" class="error-msg_active">{{errorMsg}}</p>
      <p v-if="taskStore.loading" class="loading">Loading</p>

      <ul v-else class="to-do__ul">
        <TaskItem v-for="task in taskStore.tasks" :key="task.uuid" :task="task"/>
      </ul>
      <p v-if="taskStore.tasks.length === 0 && !taskStore.loading">add first task!</p>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'

import { useTaskStore } from '../stores/taskStore.js'
import TaskItem from '../components/TaskItem.vue'

const taskStore = useTaskStore()
const newTaskText = ref('')
const errorMsg = ref('')

onMounted(() => {
  taskStore.fetchTasks()
})

async function addNewTask() {
  if (!newTaskText.value.trim()) {
    errorMsg.value = 'Введите задачу';
    setTimeout(() => {
      errorMsg.value = ''
    }, 2000)
    return
  }

  const result = await taskStore.addTask(newTaskText.value)

  if (result) {
    newTaskText.value = ''
    errorMsg.value = ''
  } else {
    errorMsg.value = taskStore.error
    setTimeout(() => {
      errorMsg.value = ''
    }, 2000)
  }
}

</script>


<style scoped>

.tasks-view {
  min-width: 80%;
  margin: 0 auto;
  padding: 20px;
 }

.header {
  text-align: center;
}

.to-do {
  background-color: rgba(221, 149, 149, 0.692);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: auto;
}

button {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
}

.upper {
  width: 100%;
  display: flex;
  justify-content: end;
  margin: 20px;
}

.upper .complete-all-checked {
  margin: 0 10px;
}

.input-add {
  width: 100%;
  display: flex;
  justify-content: center;
}

.input-field {
  width: 60%;
}

.error-msg_active {
  color: red;
  margin-bottom: 10px;
  text-align: center;
}

.to-do__ul {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.to-do__ul li {
  width: 100%;
  display: flex;
  box-sizing: border-box;

}
</style>
