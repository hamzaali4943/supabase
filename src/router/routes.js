const routes = [
  {
    path: "/",
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'loginDefault', component: () => import('pages/Auth.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Auth.vue') },
      { path: 'resetdb', name: 'resetdb', component: () => import('pages/ResetDb.vue') },
    ]
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: 'index', name: "index", component: () => import('pages/Index.vue') },
      { path: 'order', name: 'order', component: () => import('pages/order.vue') },
      { path: 'display', name: 'displayOrder', component: () => import('pages/displayOrders.vue') },
      { path: 'matchfas', name: 'MatchFas', component: () => import('pages/MatchFas.vue') },
      { path: 'orderfas', name: 'OrderFas', component: () => import('pages/orderFas.vue') },
      { path: 'fas', name: 'Fas', component: () => import('pages/fas.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
