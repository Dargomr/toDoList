<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-header">Пет-проект</div>
      <div class="nav-links">
        <router-link to="/">Все задачи</router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTaskStore } from './stores/taskStore.js'

const taskStore = useTaskStore()
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  font-family: sans-serif;
  background: deeppink;
  min-height: 100vh;
  margin: 0; /* Добавьте */
  padding: 0; /* Добавьте */
}

#app {
  min-height: 100vh;
}

.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
}

.nav-header {
  padding: 5px 10px;
  color: aliceblue;
  font-size: 1.5rem;
  font-weight: bold;
  background: deeppink;
  display: inline-block;
}

.nav-links {
  margin-top: 10px;
}

.nav-links a {
  text-decoration: none;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.nav-links a.router-link-active {
  background: deeppink;
  color: white;
}

.main-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
