import axios from "axios";

class _TwitterAPI {
    public async deleteTweet(id: string) {
        try {
            const { body } = await axios.delete("/tweets/" + id);
            return body.success === true;
        } catch (e) {
            return false;
        }
    }
}

export const TwitterAPI = new _TwitterAPI();