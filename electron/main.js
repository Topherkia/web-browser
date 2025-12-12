const { app, BrowserWindow, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false, // Disable webview since we're using iframe
            sandbox: true, // Enable sandbox for security
            enableRemoteModule: false,
            nativeWindowOpen: true
        }
    });

    // Only disable security in development
    if (process.env.NODE_ENV === 'development') {
        // This allows iframes to load external content in dev
        mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Content-Security-Policy': [
                        "default-src 'self' http://localhost:* https://localhost:*",
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                        "style-src 'self' 'unsafe-inline'",
                        "img-src 'self' data: blob: http: https:",
                        "font-src 'self' data:",
                        "connect-src 'self' http://localhost:* https://localhost:*",
                        "frame-src 'self' http: https:",
                        "media-src 'self'"
                    ].join('; ')
                }
            });
        });
    }

    // Load frontend
    mainWindow.loadURL('http://localhost:3000');
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
    
    console.log('App started successfully');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Set environment
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}