import Vue from "vue";
import moment from "moment";

import Root from "./components/Root.vue";

Vue.filter('date', (value, format) => moment(value, "YYYY-MM-DD HH:mm:ss Z").format(format));

new Vue({
    el: "#app",
    render: h => h(Root)
});