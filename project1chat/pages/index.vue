<template>
  <section class="container">
  	<h2>채팅 웹 어플 </h2>

    <input type="text" v-model="username">
    <button type="button" v-on:click="enter"> 입장 </button>
    
  </section>
</template>

<script>
import socket from '~/plugins/socket.io.js'
export default {
  data () {
    return {
      username : ''
    }
  },
  methods : {
    enter (event) {
      if (this.username) {
        socket.emit('enter', this.username)  
      } else {
        alert(`유저이름이 비었소.`)
      }
    }
  },
  beforeMount () {
    socket.on('enter', (result) => {
      if (result) {
        this.$nuxt.$router.replace({ path : '/chat' })
      } else {
        alert(`해당 유저이름이 존재함. 다른이름으로 참가혀`)
      }
      
    })
  }
}

</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

