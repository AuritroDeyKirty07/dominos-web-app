import axiosInstance from '../../../shared/api/axiosInstance';
import { useAuthStore } from '../../../shared/store/authStore';

export const logoutUser = async () => {
    try {

        await axiosInstance.get('/logout');
    } catch (error) {
        console.error("Error during backend logout:", error);
    } finally {
        useAuthStore.getState().logout();
        window.location.href = '/login';
    }
};
