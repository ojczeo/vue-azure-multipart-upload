<template>
  <div>
    <label for="baseUrl">
      <div>Provide upload url</div>
      <input type="text" placeholder="Azure upload url" v-model="baseUrl" id="baseUrl">
    </label>
    <br>
    <br>
    <label for="sasToken">
      <div>Provide sasToken</div>
      <input type="text" placeholder="Azure sasToken" id="sasToken" v-model="sasToken">
    </label>
    <br>
    <br>
    <label for="file">
      <div>Select file</div>
      <input id="file" type="file" @change="updateFile">
    </label>
    <br>
    <br>
    <button @click="startUpload">Start upload</button>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a, label {
    color: #42b983;
  }
</style>

<script>
import Axios from 'Axios'

export default {
  name: 'Upload',
  data () {
    return {
      file: null,
      sasToken: '',
      baseUrl: ''
    }
  },
  methods: {
    updateFile ($event) {
      this.file = $event.target.files[0]
      console.log(this.file)
    },
    onProgress (event) {
      console.log('progress: ', event)
    },
    onComplete (event) {
      window.alert('Upload done!', event)
    },
    error (event) {
      window.alert('Upload error!', event)
    },
    startUpload () {
      if (!this.file || !this.baseUrl) {
        window.alert('Provide proper data first!')
      } else {
        this.$azureUpload({
          baseUrl: this.baseUrl,
          sasToken: this.sasToken,
          file: this.file,
          progress: this.onProgress,
          complete: this.onComplete,
          error: this.onError
          // blockSize
        }, Axios.create({headers: {Authorization: 'Bearer 12345' }}))
      }
    }
  }
}
</script>
