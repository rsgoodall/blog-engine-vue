import {createApp} from 'vue';
import {createBootstrap} from 'bootstrap-vue-next';
import {createPinia} from 'pinia';

// Add the necessary CSS
// import 'bootstrap/dist/css/bootstrap.css'
import './scss/bootstrap.scss';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import App from './App.vue';
import router from './router';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(createBootstrap()); // Important
app.mount('#app');