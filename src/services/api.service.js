import api_instance from "../utils/api";
import { CREATE_NEW_CONTACT_URL, API_BOOKING_SERVICE_ROOM } from "../utils/constants";

class ApiService {
    createNewContact(body) {
        return api_instance.post(CREATE_NEW_CONTACT_URL, body);
    }

    getBookingServiceRoom(path, body) {
        return api_instance.get(API_BOOKING_SERVICE_ROOM, body);
    }
}

export default new ApiService();