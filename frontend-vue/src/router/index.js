import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/SwapView.vue"),
    },
    {
      path: "/swap",
      component: () => import("../views/SwapView.vue"),
    },
    {
      path: "/activity",
      component: () => import("../views/ActivityView.vue"),
    },
    {
      path: "/bridge",
      component: () => import("../views/BridgeView.vue"),
    },
    {
      path: "/faucet",
      component: () => import("../views/FaucetView.vue"),
    },
    {
      path: "/musicfund/detail/:id",
      name: 'fundDetail',
      component: () => import("../views/MusicFundDetail.vue"),
    },
    {
      path: "/nft/detail/:contract",
      name: 'nftDetail',
      component: () => import("../views/NftDetail.vue"),
    }
  ],
});

export default router