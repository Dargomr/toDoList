<template>
  <li
    :class="{ done: task.done }"
    @click="onLiClick"
  >
    <input
      type="checkbox"
      class="li-checkbox"
      :checked="task.checked"
      @change="onCheckboxChange"
    />
    <p class="task-text">{{ task.action }}</p>
    <button
      class="delete-button"
      @click="onDeleteClick"
    >
      удалить
    </button>
  </li>
</template>

<script setup>
  import { useTaskStore } from '../stores/taskStore.js'

  const taskStore = useTaskStore()

  const props = defineProps({
    task: {
      type: Object,
      required: true,
    },
  })

  function onLiClick(event) {
    if (!event.target.matches('.li-checkbox, .delete-button')) {
      taskStore.toggleDone(props.task)
    }
  }

  function onCheckboxChange(event) {
    if (event.target.matches('.li-checkbox')) {
      taskStore.toggleCheck(props.task, event.target.checked)
    }
  }

  function onDeleteClick(event) {
    if (event.target.matches('.delete-button')) {
      taskStore.deleteTask(props.task.uuid)
    }
  }
</script>

<style scoped>
  li {
    list-style-type: none;
    position: relative;
    margin: 5px 0;
    padding: 12px 12px 12px 25px;
    background: lightgrey;
    font-family: sans-serif;
    display: flex;
    align-items: center;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
  }

  li.done {
    background: #ccff99;
  }

  li.done::before {
    content: '';
    position: absolute;
    border-color: #009933;
    border-style: solid;
    border-width: 0 0.2em 0.25em 0;
    height: 1em;
    top: 46%;
    left: 0.8em;
    transform: translateY(-50%) rotate(45deg);
    width: 0.5em;
  }

  .li-checkbox {
    margin: 0 20px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  .delete-button {
    position: absolute;
    right: 5px;
    border-radius: 3px;
    cursor: pointer;
  }
</style>
