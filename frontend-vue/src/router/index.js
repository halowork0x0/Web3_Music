import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/FundView.vue"),
    },
    {
      path: "/fund",
      component: () => import("../views/FundView.vue"),
    },
    {
      path: "/nft",
      component: () => import("../views/NftView.vue"),
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
      path: "/musicfund/detail/:contract",
      name: 'fundDetail',
      component: () => import("../views/MusicFundDetail.vue"),
    },
    {
      path: "/nft/detail/:contract",
      name: 'nftDetail',
      component: () => import("../views/NftDetail.vue"),
    },
    {
      path: "/profile",
      name: 'profile',
      component: () => import("../views/ProfileView.vue"),
    }
  ],
});

export default router