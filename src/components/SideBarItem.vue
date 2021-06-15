<template>
  <q-list padding class="rounded-borders" v-for="(routeItem,index) in routes" :key="index">
    <!-- 多子页面-->
    <div v-if="routeItem.children">
      <q-expansion-item
        expand-separator
        icon="mail"
        :label="routeItem.name"
        caption="5 unread emails"
        v-if="routeItem.children.length > 1"
      >

        <q-item v-for="(childroute,index2) in routeItem.children" clickable v-ripple style="padding-left: 50px" :key="index2"
                @click="routerPath(routeItem.path + '/' +childroute.path )">
          <q-item-section avatar>
            <q-icon name="drafts"/>
          </q-item-section>

          <q-item-section>
            {{ childroute.path === '/' ? 'page1' : childroute.path }}
            <!--多页面-->
          </q-item-section>
        </q-item>
      </q-expansion-item>

      <!-- 单页路由-->
      <q-item v-else @click="routerPath(routeItem.path  + routeItem.path)" clickable>
        <q-item-section avatar>
          <q-icon name="drafts"/>
        </q-item-section>
        <q-item-section>
          <!--{{routeItem.path=== '/' ? 'page1' : routeItem.path.substring(routeItem.path.indexOf('/')+1, routeItem.path.length ) }}-->
          {{ routeItem.name }}
        </q-item-section>
      </q-item>

    </div>


  </q-list>
</template>

<script>
export default {
  name: "SideBarItem",
  data() {
    return {
      routes: [],
      page3: '/page3',
    }
  },
  created() {
    this.routes = this.$router.options.routes
  },
  methods: {
    routerPath(route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>
.menu-list .q-item {
  border-radius: 0 32px 32px 0;
  color: #0d6efd;
}
</style>
