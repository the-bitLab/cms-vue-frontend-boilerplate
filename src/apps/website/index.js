import "@/scss/index.scss";
import "bootstrap";

import 'core-js';
import 'regenerator-runtime/runtime';

import swiperConfig from "@/config/swiper-config";
swiperConfig();

import vueConfig from '@/config/vue-config';
vueConfig();

import Vue from 'vue';
import HelloWorld from '@/components/hello-world.vue';

new Vue({
    el: '#app',
    components: {
        HelloWorld
    }
})