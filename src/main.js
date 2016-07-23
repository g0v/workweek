import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';

import Workweek from './components/Workweek';
import Faq from './components/Faq';

/* eslint-disable no-new */
Vue.use(VueRouter);

let router = new VueRouter();

router.map({
  '*': {
    name: 'workweek',
    component: Workweek
  },
  '/': {
    name: 'workweek',
    component: Workweek
  },
  '/faq': {
    name: 'faq',
    component: Faq
  }
});

router.start(App, 'app');
