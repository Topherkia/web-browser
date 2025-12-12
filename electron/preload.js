// electron/preload.js
// Preload script for Electron security context

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electronAPI', {
        // Window controls
        minimizeWindow: () => ipcRenderer.send('window-minimize'),
        maximizeWindow: () => ipcRenderer.send('window-maximize'),
        closeWindow: () => ipcRenderer.send('window-close'),
        
        // Browser functionality
        navigateTo: (url) => ipcRenderer.send('navigate-to', url),
        goBack: () => ipcRenderer.send('browser-back'),
        goForward: () => ipcRenderer.send('browser-forward'),
        refreshPage: () => ipcRenderer.send('browser-refresh'),
        
        // Search engine
        changeSearchEngine: (engine) => ipcRenderer.send('change-search-engine', engine),
        
        // Ratings and comments
        saveRating: (ratingData) => ipcRenderer.invoke('save-rating', ratingData),
        saveComment: (commentData) => ipcRenderer.invoke('save-comment', commentData),
        getRatings: (url) => ipcRenderer.invoke('get-ratings', url),
        getComments: (url) => ipcRenderer.invoke('get-comments', url),
        
        // Database operations
        getUserData: () => ipcRenderer.invoke('get-user-data'),
        saveUserData: (userData) => ipcRenderer.invoke('save-user-data', userData),
        
        // Settings
        getSettings: () => ipcRenderer.invoke('get-settings'),
        saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
        
        // File system access (limited)
        readFile: (path) => ipcRenderer.invoke('read-file', path),
        writeFile: (path, data) => ipcRenderer.invoke('write-file', path, data),
        
        // Notifications
        showNotification: (title, body) => ipcRenderer.send('show-notification', title, body),
        
        // Listeners
        onUrlChange: (callback) => ipcRenderer.on('url-changed', (event, url) => callback(url)),
        onTitleChange: (callback) => ipcRenderer.on('title-changed', (event, title) => callback(title)),
        onLoadingState: (callback) => ipcRenderer.on('loading-state', (event, isLoading) => callback(isLoading)),
        
        // Remove listeners
        removeListeners: () => {
            ipcRenderer.removeAllListeners('url-changed');
            ipcRenderer.removeAllListeners('title-changed');
            ipcRenderer.removeAllListeners('loading-state');
        }
    }
);

// Expose Node.js modules that are safe for renderer process
contextBridge.exposeInMainWorld(
    'nodeAPI', {
        // Crypto functions
        generateHash: (data) => require('crypto').createHash('sha256').update(data).digest('hex'),
        
        // OS information
        platform: process.platform,
        arch: process.arch,
        
        // Environment
        isDev: process.env.NODE_ENV === 'development',
        appVersion: process.env.npm_package_version || '1.0.0'
    }
);

// Handle uncaught errors
window.addEventListener('error', (event) => {
    console.error('Renderer error:', event.error);
    ipcRenderer.send('renderer-error', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    ipcRenderer.send('unhandled-rejection', event.reason);
});