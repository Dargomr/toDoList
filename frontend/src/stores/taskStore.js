import { ref } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTasks() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/api/tasks`)

      if (!response.ok) {
        throw new Error(`Ошибка:  ${response.status}`)
      }
      tasks.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('FetchTasks error:', err)
    } finally {
      loading.value = false
    }
  }

  async function addTask(actionText) {
    try {
      const formData = new FormData()
      formData.append('inputField', actionText)
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'ошибка при добавлении таска')
      }

      const data = await response.json()
      const newTask = {
        uuid: data.uuid,
        action: actionText,
        checked: false,
        done: false,
        createdAt: new Date(),
      }

      tasks.value = [newTask, ...tasks.value]

      return true
    } catch (err) {
      error.value = err.message
      console.error('AddTask error:', err)
      return false
    }
  }

  async function toggleDone(task) {
    const newDoneStatus = !task.done
    try {
      const response = await fetch(`${API_URL}/done`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          done: newDoneStatus,
          uuid: task.uuid,
        }),
      })
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`)
      }

      task.done = newDoneStatus
    } catch (err) {
      error.value = err.message
      console.error('toggleDone error:', err)
    }
  }

  async function toggleCheck(task, newCheckedValue) {
    task.checked = newCheckedValue
    try {
      const response = await fetch(`${API_URL}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checked: task.checked,
          uuid: task.uuid,
        }),
      })
      if (!response.ok) {
        console.log('Ошибка: ' + response.status)
      }
    } catch (err) {
      console.error('toggleCheck error:', err)
    }
  }

  async function deleteTask(uuid) {
    try {
      const response = await fetch(`${API_URL}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: uuid,
        }),
      })
      if (!response.ok) {
        throw new Error('Ошибка: ' + response.status)
      }
      tasks.value = tasks.value.filter((task) => task.uuid !== uuid)
    } catch (err) {
      error.value = err.message
      console.error('DeleteTask error:', err)
    }
  }

  function sayHello() {
    console.log('Store работает!')
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleDone,
    toggleCheck,
    deleteTask,
    sayHello,
  }
})
