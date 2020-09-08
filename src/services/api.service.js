import api_instance from "../utils/api";
import { API_ROOMS, CREATE_NEW_CONTACT_URL, API_BOOKING_SERVICE_ROOM, API_BOOKING_ROOM_ITEM } from "../utils/constants";

class ApiService {
    createNewContact(body) {
        return api_instance.post(CREATE_NEW_CONTACT_URL, body);
    }

    getBookingServiceRoom(path, body) {
        return api_instance.get(path, body);
    }

    updateBookingServieRoom(body) {
        return api_instance.post(API_BOOKING_SERVICE_ROOM, body);
    }

    insertBookingServiceRoom(body) {
        return api_instance.put(API_BOOKING_SERVICE_ROOM, body);
    }

    getRooms() {
        return api_instance.get(API_ROOMS); 
    }

    getBookingRoomItems(bookingId) {
        return api_instance.get(`${API_BOOKING_ROOM_ITEM}?booking_id=${bookingId}`);
    }
}

export default new ApiService();