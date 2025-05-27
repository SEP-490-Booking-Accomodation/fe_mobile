import io from 'socket.io-client';
import store from '../redux/store';
import { notificationApi } from '../api/notificationApi';
import Toast from 'react-native-toast-message';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.navigationRef = null;
        this.reconnectAttempts = 0;
    }

    getSocket() {
        return this.socket;
    }

    setNavigationRef(navigationRef) {
        this.navigationRef = navigationRef;
    }

    connect(userId) {
        if (this.socket && this.isConnected) {
            console.log('Socket already connected');
            return this.socket;
        }

        const SOCKET_URL = 'http://192.168.2.5:5000';

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            timeout: 20000,
            forceNew: true,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.isConnected = true;
            this.reconnectAttempts = 0; // Reset reconnect attempts

            if (userId) {
                this.socket.emit('join', userId.toString());
                console.log(`Joined room for user: ${userId}`);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.isConnected = false;
        });

        // Xử lý notification - Đây là phần quan trọng nhất
        this.socket.on('notification', (notification) => {
            console.log('New notification received:', notification);
            
            // Hiển thị Toast ngay lập tức trên bất kỳ màn hình nào
            this.showGlobalNotification(notification);
            
            // Invalidate cache để refresh danh sách notification
            store.dispatch(
                notificationApi.util.invalidateTags([
                    { type: 'Notification', id: 'LIST' }
                ])
            );
        });

        this.socket.on('reconnect_attempt', () => {
            this.reconnectAttempts++;
            console.log(`Reconnect attempt: ${this.reconnectAttempts}`);
            if (this.reconnectAttempts <= 3 && userId) {
                this.socket.emit('join', userId.toString());
            }
        });

        this.socket.on('reconnect', () => {
            console.log('Socket reconnected');
            this.isConnected = true;
            if (userId) {
                this.socket.emit('join', userId.toString());
            }
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.reconnectAttempts = 0;
            console.log('Socket manually disconnected');
        }
    }

    joinRoom(userId) {
        if (this.socket && this.isConnected && userId) {
            this.socket.emit('join', userId.toString());
            console.log(`Joined room for user: ${userId}`);
        }
    }

    leaveRoom(userId) {
        if (this.socket && this.isConnected && userId) {
            this.socket.emit('leave', userId.toString());
            console.log(`Left room for user: ${userId}`);
        }
    }

    // Hiển thị notification toàn cục
    showGlobalNotification(notification) {
        // Hiển thị Toast trên bất kỳ màn hình nào
        Toast.show({
            type: 'info',
            text1: notification.title || 'Thông báo mới',
            text2: notification.content || notification.body || 'Bạn có thông báo mới',
            visibilityTime: 5000, // Hiển thị trong 5 giây
            autoHide: true,
            topOffset: 50,
            onPress: () => {
                // Điều hướng đến màn hình notification khi nhấn vào toast
                this.navigateToNotification();
                Toast.hide();
            },
            props: {
                onPress: () => {
                    this.navigateToNotification();
                    Toast.hide();
                }
            }
        });

        // Log để debug
        console.log('Global notification displayed:', {
            title: notification.title,
            content: notification.content || notification.body
        });
    }

    // Điều hướng đến màn hình notification
    navigateToNotification() {
        if (this.navigationRef?.current) {
            try {
                // Kiểm tra xem có thể navigate không
                const currentState = this.navigationRef.current.getRootState();
                if (currentState) {
                    // Navigate đến NotificationScreen
                    this.navigationRef.current.navigate('Home', {
                        screen: 'NotificationScreen'
                    });
                    console.log('Navigated to NotificationScreen');
                }
            } catch (error) {
                console.error('Error navigating to notification screen:', error);
                // Fallback: thử navigate trực tiếp
                try {
                    this.navigationRef.current.navigate('NotificationScreen');
                } catch (fallbackError) {
                    console.error('Fallback navigation also failed:', fallbackError);
                }
            }
        } else {
            console.warn('Navigation ref not available');
        }
    }

    isSocketConnected() {
        return this.isConnected && this.socket?.connected;
    }

    // Method để test notification (có thể dùng cho debug)
    testNotification() {
        this.showGlobalNotification({
            title: 'Test Notification',
            content: 'This is a test notification'
        });
    }
}

export default new SocketService();