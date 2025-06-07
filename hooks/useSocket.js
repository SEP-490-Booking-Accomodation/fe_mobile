import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'react-native';
import SocketService from '../services/socketService';

export const useSocket = (options = {}) => {
  const { 
    autoConnect = true, 
    onNotification,
    enableLogging = true 
  } = options;
  
  const userId = useSelector((state) => state.auth?.userId);
  const isAuthenticated = useSelector((state) => state.auth?.isAuth);
  const appState = useRef(AppState.currentState);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Set());

  // Log function
  const log = useCallback((message, ...args) => {
    if (enableLogging) {
    }
  }, [enableLogging]);

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    const connected = SocketService.isSocketConnected();
    setIsConnected(connected);
    log('Connection status updated:', connected);
  }, [log]);

  // Clean up socket listeners
  const cleanupListeners = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('connect', updateConnectionStatus);
      socketRef.current.off('disconnect', updateConnectionStatus);
      socketRef.current.off('reconnect', updateConnectionStatus);
      
      if (onNotification) {
        socketRef.current.off('notification', onNotification);
      }
      
      log('Socket listeners cleaned up');
    }
    listenersRef.current.clear();
  }, [updateConnectionStatus, onNotification, log]);

  // Setup socket listeners
  const setupListeners = useCallback((socket) => {
    if (!socket) return;

    // Clean up existing listeners first
    cleanupListeners();

    // Connection status listeners
    socket.on('connect', updateConnectionStatus);
    socket.on('disconnect', updateConnectionStatus);
    socket.on('reconnect', updateConnectionStatus);

    // Notification listener
    if (onNotification && typeof onNotification === 'function') {
      socket.on('notification', onNotification);
      log('Notification listener attached');
    }

    // Track listeners
    listenersRef.current.add('connect');
    listenersRef.current.add('disconnect');
    listenersRef.current.add('reconnect');
    if (onNotification) {
      listenersRef.current.add('notification');
    }

    socketRef.current = socket;
    updateConnectionStatus();
  }, [cleanupListeners, updateConnectionStatus, onNotification, log]);

  // Connect socket
  const connect = useCallback((userIdParam) => {
    const targetUserId = userIdParam || userId;
    
    if (!isAuthenticated || !targetUserId) {
      log('Cannot connect: not authenticated or no userId');
      return null;
    }

    log('Connecting socket for user:', targetUserId);
    
    try {
      const socket = SocketService.connect(targetUserId);
      setupListeners(socket);
      return socket;
    } catch (error) {
      log('Error connecting socket:', error);
      return null;
    }
  }, [userId, isAuthenticated, setupListeners, log]);

  // Disconnect socket
  const disconnect = useCallback(() => {
    log('Disconnecting socket');
    cleanupListeners();
    SocketService.disconnect();
    setIsConnected(false);
    socketRef.current = null;
  }, [cleanupListeners, log]);

  // Main connection effect
  useEffect(() => {
    if (!autoConnect) return;

    if (isAuthenticated && userId) {
      log('Auto-connecting socket for authenticated user:', userId);
      connect(userId);
    } else {
      log('Disconnecting socket: not authenticated or no userId');
      disconnect();
    }

    return () => {
      if (autoConnect) {
        cleanupListeners();
      }
    };
  }, [isAuthenticated, userId, autoConnect, connect, disconnect, cleanupListeners, log]);

  // App state change effect
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      log('App state changed:', appState.current, '->', nextAppState);
      
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isAuthenticated &&
        userId
      ) {
        log('App became active, reconnecting socket');
        connect(userId);
      }
      
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAuthenticated, userId, connect, log]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      log('Hook unmounting, cleaning up');
      cleanupListeners();
    };
  }, [cleanupListeners, log]);

  return {
    isConnected,
    socket: socketRef.current,
    connect,
    disconnect,
    userId,
    isAuthenticated
  };
};