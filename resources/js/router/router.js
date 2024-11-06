import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import("../views/testhome.vue"),
    },
    {
        path: "/test",
        component: () => import("../views/testroute.vue"),
    },

    {
        path: "/yathzee", 
        component: () => import("../views/yathzee.vue"),
    },

    {
        path: "/mastermind", 
        component: () => import("../views/mastermind.vue"),
    },

    {
        path: "/blackjack", 
        component: () => import("../views/blackjack.vue"),
    },

    {}
];

export default createRouter({
    history: createWebHistory(),
    routes,
});