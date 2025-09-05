import { createRouter, createWebHashHistory } from "vue-router";
import DexView from '../views/DexView.vue'

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
    },
    {
      path: "/nft/detail",
      name: 'nftDetail',
      component: () => import("../views/NftDetail.vue"),
    }
  ],
});

export default router