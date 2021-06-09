<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated class="text-black">
      <q-toolbar  style="backdrop-filter: blur(7px);background-color: rgba(0,0,0,.1);position: fixed;">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title style="-webkit-app-region: drag;">
          僵尸大战
        </q-toolbar-title>
        <q-avatar  size="28px" style="margin:0 10px">
          <img src="https://cdn.quasar.dev/img/avatar.png" alt="头像">
          <q-badge color="orange" floating transparent>
            6
          </q-badge>
        </q-avatar>
<!--        窗口最大化最小化，关闭-->
        <div class="text-black" style="-webkit-app-region:no-drag">
          <q-btn flat icon="mdi-minus" size="sm" @click="minWindow"/>
          <q-btn flat icon="mdi-window-maximize" v-if="!isMaxWinState" size="sm" @click="maxWindow"/>
          <q-btn flat icon="mdi-window-restore" v-if="isMaxWinState" size="sm" @click="maxWindow"/>
          <q-btn flat icon="mdi-close" size="sm" @click="closeWindow"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
      style="padding-top: 50px;overflow-y: hidden"
    >

      <q-scroll-area class="full-height" style="overflow-y: hidden">
            <side-bar-item></side-bar-item>
      </q-scroll-area>
    </q-drawer>

    <q-page-container  class="full-height">
      <router-view style="padding-top: 50px"/>
    </q-page-container>

  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import SideBarItem from 'components/SideBarItem.vue'
import {ipcRenderer} from 'electron' //渲染进程api
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  data() {
    return {
      isMaxWinState: false, //窗口状态
    }
  },
  components: {
    EssentialLink,SideBarItem
  },

  mounted() {
    console.log('aaa',ipcRenderer)
    // 接收主进程回应
    ipcRenderer.on('window_state',(event,args) =>{
      console.log(args,"主进程回应")
    })
  },
  methods: {
    minWindow(){
      // send异步 发送消息给主进程 ipcMain
      ipcRenderer.send("window-min",'min')
    },
    maxWindow() {

      if(this.isMaxWinState){
        ipcRenderer.send('window-unmax','max')
      } else {
        ipcRenderer.send('window-max','max')
      }
      this.isMaxWinState = !this.isMaxWinState

    },
    closeWindow() {
      ipcRenderer.send('window-close','close')
    },
  },
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
