<template>
  <div id="app">
    <img src="./assets/logo.png">
    <upload/>
  </div>
</template>

<script>
import upload from './components/Upload'

export default {
  name: 'App',
  components: {
    upload
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
