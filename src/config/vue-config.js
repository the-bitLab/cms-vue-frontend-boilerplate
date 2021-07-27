import Vue from 'vue';
import VueSvgSprite from 'vue-svg-sprite';
import VueTransitions from 'vue2-transitions';

export default function () {
    Vue.use(VueSvgSprite, { 
        url: process.env.NODE_ENV === 'production' 
            ? '/wp-content/themes/maxxima/assets/icons/icons.svg'
            : 'icons/icons.svg' 
    })

    Vue.use(VueTransitions)
}