import Vue from "vue";
import moment from "moment";

import Root from "./components/Root.vue";
import { DataManager } from "./util/DataManager";

Vue.filter('date', (value, format) => moment(value, "YYYY-MM-DD HH:mm:ss Z").format(format));

DataManager.loadData();

new Vue({
    el: "#app",
    render: h => h(Root)
});