import { create } from 'zustand';

export const useToastStore = create((set) => ({
    toasts: [],

    addToast: (message, type = 'success') => {
        const id = Date.now();
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }],
        }));

        // Auto remove after 3 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((toast) => toast.id !== id),
            }));
        }, 3000);
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
    },
}));

// Custom hook for toast
export const useToast = () => {
    const addToast = useToastStore((state) => state.addToast);

    return {
        showSuccess: (message) => addToast(message, 'success'),
        showError: (message) => addToast(message, 'error'),
        showInfo: (message) => addToast(message, 'info'),
    };
};
