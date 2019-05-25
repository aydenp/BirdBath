import Vuex from "vuex";
import VuexPersist from 'vuex-persist';

const persist = new VuexPersist({
    key: 'birdbath-state'
});

export const AppState = new Vuex.Store({
    plugins: [persist.plugin],
    state: {
        toDelete: [],
        accountID: null,
        tweetID: null
    },
    getters: {
        accountID: (state) => state.accountID,
        deletionQueue: (state) => state.toDelete,
        deletionQueueCount: (state, getters) => getters.deletionQueue.length,
        lastLoadedTweetID: (state) => state.tweetID
    },
    mutations: {
        provisionForAccountID(state, id) {
            state.accountID = id;
            state.tweetID = null;
            state.toDelete = [];
        },
        recordView(state, id) {
            state.tweetID = id;
        },
        queue(state, id) {
            if (state.toDelete.indexOf(id) >= 0) return;
            state.toDelete.push(id);
        },
        dequeue(state, id) {
            var index = state.toDelete.indexOf(id);
            if (index < 0) return;
            state.toDelete.splice(index, 1);
        }
    },
    actions: {
        setupWithAccount(context, details) {
            if (context.getters.accountID == details.id) return;
            context.commit("provisionForAccountID", details.id);
        }
    }
});