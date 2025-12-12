// electron/main.js
// Main Electron process for desktop application

const { app, BrowserWindow, Menu, ipcMain, session } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            partition: 'persist:webbrowser-data'
        },
        icon: path.join(__dirname, '../assets/icon.ico'),
        title: 'Web Browser with Rating System'
    });

    // Load the React app
    const startUrl = process.env.ELECTRON_START_URL || 
        url.format({
            pathname: path.join(__dirname, '../frontend/build/index.html'),
            protocol: 'file:',
            slashes: true
        });
    
    mainWindow.loadURL('http://localhost:3000');

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Create application menu
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        createWindow();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Search Engines',
            submenu: [
                {
                    label: 'Google',
                    click: () => {
                        mainWindow.webContents.send('change-search-engine', 'google');
                    }
                },
                {
                    label: 'Bing',
                    click: () => {
                        mainWindow.webContents.send('change-search-engine', 'bing');
                    }
                },
                {
                    label: 'DuckDuckGo',
                    click: () => {
                        mainWindow.webContents.send('change-search-engine', 'duckduckgo');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC handlers
ipcMain.handle('get-user-data', async (event, ...args) => {
    // Handle user data requests
    return {};
});

ipcMain.handle('save-rating', async (event, ratingData) => {
    // Forward rating to backend
    console.log('Saving rating:', ratingData);
    return { success: true };
});

ipcMain.handle('save-comment', async (event, commentData) => {
    // Forward comment to backend
    console.log('Saving comment:', commentData);
    return { success: true };
});