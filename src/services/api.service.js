import axios from 'axios';
import api_instance from "../utils/api";
import { API_BOOKING_ROOM_ITEM, API_BOOKING_SEARCH, API_BOOKING_SERVICE_ROOM, API_CREATE_NEW_CONTACT, API_ROOMS, API_ROOM_SERVICE_BOOKING_STATUS, API_UPDATE_CONTACT } from "../utils/constants";

class ApiService {

    getBookingServiceRoom(path, body) {
        return api_instance.get(path, body);
    }

    updateBookingServieRoom(body) {
        return api_instance.post(API_BOOKING_SERVICE_ROOM, body);
    }

    insertBookingServiceRoom(body) {
        return api_instance.put(API_BOOKING_SERVICE_ROOM, body);
    }

    deleteBookingServiceRoomByBookingId(bookingId) {
        return api_instance.delete(`${API_BOOKING_SERVICE_ROOM}?booking_id=${bookingId}`);
    }

    getRooms() {
        return api_instance.get(API_ROOMS);
    }

    getBookingRoomItems(bookingId) {
        return api_instance.get(`${API_BOOKING_ROOM_ITEM}?booking_id=${bookingId}`);
    }

    // Contact
    createNewContact(body) {
        return api_instance.post(API_CREATE_NEW_CONTACT, body);
    }
    updateContact(body) {
        return api_instance.post(API_UPDATE_CONTACT, body);
    }

    // ReservationReport
    getRoomServiceBookingStatus(fromDate, toDate) {
        return api_instance.get(API_ROOM_SERVICE_BOOKING_STATUS, {
            params: {
                from_date: fromDate,
                to_date: toDate
            }
        });
    }

    getRoomPlanData(usingDate) {
        const apiArr = [
            api_instance.get(`${API_BOOKING_SERVICE_ROOM}?using_date=${usingDate}`),
            api_instance.get(`${API_BOOKING_SERVICE_ROOM}?checkout_date=${usingDate}`)
        ];
        return axios.all(apiArr);
    }

    getBookingSearch(searchType, searchValue) {
        return api_instance.get(`${API_BOOKING_SEARCH}?search_type=${searchType}&search_value=${searchValue}`);
    }
}

export default new ApiService();