import { apiClient } from './Common';

export default {
    getUsers() {
        return apiClient.get(`/users`, { withCredentials: true});
    },
    updateUser(payload: any) {
        return apiClient.patch(`/users/admin/updateUser`, payload, { withCredentials: true});
    },
    // TO DO: delete user
    dateUser(userId: string) {
        return apiClient.delete(`/users/admin/deleteUser/${userId}`, { withCredentials: true});
    }
};