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
      path: "/nft",
      component: () => import("../views/NftView.vue"),
    },
    {
      path: "/crosschain",
      component: () => import("../views/CrosschainView.vue"),
    },
    {
      path: "/faucet",
      component: () => import("../views/FaucetView.vue"),
    }
  ],
});

export default router