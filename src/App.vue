<template>
  <router-view />
  <q-dialog persistent v-model="updateState">
    <q-card style="width: 50%; padding: 20px 10px">
      <q-linear-progress
        rounded
        size="25px"
        :value="updateProgress"
        stripe
        color="secondary"
        class="q-mt-sm"
      >
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="progressLabel" />
        </div>
      </q-linear-progress>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";
let _this = this;

export default defineComponent({
  name: "App",
  data() {
    return {
      timeOut: null,
      updateState: false,
      updateProgress: 0,
      progressLabel: 0,
      interval: null,
    };
  },
  mounted() {
    let that = this;
    //接收主进程版本更新消息
    ipcRenderer.on("message", (event, arg) => {
        // that.updateState = true;

      console.log("message-更新信息", arg)
      if ("update-update" == arg.cmd) {
        //显示升级对话框
        that.updateState = true;
      } else if ("download-progress" == arg.cmd) {
        //更新升级进度
        that.updateProgress = arg.message.percent / 100;
        that.progressLabel = arg.message.percent.toFixed(2) + "%";
      } else if ("error" == arg.cmd) {
        that.updateState = false;
        this.$q.notify({
          type: "warning",
          message: "更新失败",
          position: "top",
        });
      }
      // }
    });
    //5秒后开始检测新版本
    this.timeOut = window.setTimeout(() => {
      ipcRenderer.send("checkForUpdate");
    }, 5000);
    //间隔1小时检测一次
    this.interval = window.setInterval(() => {
      ipcRenderer.send("checkForUpdate");
    }, 3600000);
  },
  unmounted() {
    window.clearInterval(this.interval);
    window.clearInterval(this.timeOut);
  },
  methods: {},
});
</script>
