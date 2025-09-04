import { createRouter, createWebHashHistory } from "vue-router";
import DexView from '../views/DexView.vue'
// import NftView from '../views/NftView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/dex",
      component: DexView,
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
      path: "/musicfund/detail",
      name: 'fundDetail',
      component: () => import("../views/MusicFundDetail.vue"),
    }
  ],
});

export default router