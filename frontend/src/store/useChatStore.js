import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            // Check if image size is too large
            if (messageData.image) {
                const base64Size = messageData.image.length * 0.75; // Approximate size in bytes
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (base64Size > maxSize) {
                    throw new Error('Image size should be less than 5MB');
                }
            }

            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error(error.message || 'Failed to send message');
            }
            throw error; // Re-throw to handle in the component
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Remove any existing listeners to prevent duplicates
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const isMessageRelevant = newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id;
            if(!isMessageRelevant) return;
            
            const messages = get().messages;
            const messageExists = messages.some(msg => msg._id === newMessage._id);
            
            if (!messageExists) {
                set({
                    messages: [...messages, newMessage],
                });
            }
        });
    },

    unsubscribeFromMessages: () => {
            const socket = useAuthStore.getState().socket;
            if (!socket) return;
            socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))