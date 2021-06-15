<template>
  <q-page>
    <!--    class="flex flex-center"-->
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >

    <div style="height: 100px">
      <img src="~assets/001.gif" v-show="isshow" alt="浇水">
    </div>
    <q-btn @click="water">浇水</q-btn>
    {{ number }}
    <div>请求用户信息：{{user}}</div>
    <q-footer>
      <q-toolbar class="bg-grey-3 text-black row">
        <q-btn round flat icon="insert_emoticon" class="q-mr-sm"/>
        <q-input rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="message"
                 placeholder="Type a message"/>
        <q-btn round flat icon="mic"/>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue';
import axios from 'axios'
export default defineComponent({
  name: 'PageIndex',
  data() {
    return {
      isshow: true,
      number: 0,
      message: '',
      user:{},
    }
  },
  setup() {
    // let isshow = ref(false)
    // function water() {
    //   console.log('浇水')
    //   isshow = !isshow
    // }
    // return {isshow, water }
  },
  mounted() {
    this.toLogin()
  },
  methods: {
    water() {
      console.log('浇水')
      this.isshow = !this.isshow
      this.number++
      console.log('number', this.number);
    },
   toLogin() {
      axios.post('http://localhost:4567/user_login',{user_name:'admin',user_password:'123456'}).then(res =>{
        this.user = res.data
        console.log(this.user,'user')
      })
    }
  }
})
</script>
