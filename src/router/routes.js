
const routes = [
  {
    path: '/',
    name:'page1',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/page2',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/page2/page2-1',
    name:'page2',
    children: [
      { path: 'page2-1', component: () => import('pages/page2/page2-1.vue') },
      { path: 'page2-2', component: () => import('pages/page2/page2-2.vue') }

    ]
  },
  {
    path: '/page3',
    name:'page3',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path:'page3',component:() => import('pages/page3.vue')}
    ]
  },
  // Always leave this as last one,
  // but you can also remove it

  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
