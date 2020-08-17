import api_instance from "../utils/api";
import { CREATE_NEW_CONTACT_URL } from "../utils/constants";

class ApiService {
    createNewContact(body) {
        return api_instance.post(CREATE_NEW_CONTACT_URL, body);
    }
}

export default new ApiService();