import axios from "axios";

class _TwitterAPI {
    public async getTwitterUserID() {
        const { data } = await axios.get("/auth");
        return data.id || null;
    }

    public async signOut() {
        try {
            const { data } = await axios.delete("/auth");
            return data.success === true;
        } catch (e) {
            return false;
        }
    }

    public async deleteTweet(id: string) {
        try {
            const { data } = await axios.delete("/tweets/" + id);
            return data.success === true;
        } catch (e) {
            return false;
        }
    }
}

export const TwitterAPI = new _TwitterAPI();