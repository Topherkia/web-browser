const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Load a simple browser interface
    mainWindow.loadURL(`data:text/html;charset=utf-8,
        <!DOCTYPE html>
        <html>
        <head>
            <title>Web Browser with Rating System</title>
            <style>
                body { margin: 0; font-family: Arial; }
                #controls { background: #2c3e50; padding: 10px; color: white; }
                #urlBar { width: 70%; padding: 5px; margin-right: 10px; }
                button { padding: 5px 15px; background: #3498db; color: white; border: none; cursor: pointer; }
                webview { width: 100%; height: calc(100vh - 60px); }
                #ratingPanel { position: fixed; right: 0; top: 50px; width: 300px; background: white; border-left: 1px solid #ccc; padding: 20px; }
            </style>
        </head>
        <body>
            <div id="controls">
                <button onclick="goBack()">←</button>
                <button onclick="goForward()">→</button>
                <button onclick="refresh()">↻</button>
                <input id="urlBar" type="text" value="https://google.com">
                <button onclick="goToUrl()">Go</button>
                <button onclick="showRating()">Rate Page</button>
            </div>
            
            <webview id="browser" src="https://google.com"></webview>
            
            <div id="ratingPanel" style="display:none;">
                <h3>Page Rating</h3>
                <div id="stars">
                    ${'★'.repeat(5).split('').map((star, i) => 
                        `<span style="font-size:30px;cursor:pointer;color:#ccc" 
                              onclick="rate(${i+1})" 
                              onmouseover="highlightStars(${i+1})" 
                              onmouseout="resetStars()">★</span>`
                    ).join('')}
                </div>
                <textarea id="comment" placeholder="Add a comment..." rows="3" style="width:100%;margin:10px 0;"></textarea>
                <button onclick="submitRating()">Submit</button>
                <button onclick="hideRating()">Close</button>
            </div>
            
            <script>
                const webview = document.getElementById('browser');
                const urlBar = document.getElementById('urlBar');
                
                webview.addEventListener('did-navigate', (e) => {
                    urlBar.value = e.url;
                });
                
                function goToUrl() {
                    let url = urlBar.value;
                    if (!url.startsWith('http')) url = 'https://' + url;
                    webview.src = url;
                }
                
                function goBack() { webview.goBack(); }
                function goForward() { webview.goForward(); }
                function refresh() { webview.reload(); }
                
                let currentRating = 0;
                function rate(stars) {
                    currentRating = stars;
                    const starElements = document.querySelectorAll('#stars span');
                    starElements.forEach((star, i) => {
                        star.style.color = i < stars ? '#f39c12' : '#ccc';
                    });
                }
                
                function highlightStars(count) {
                    const starElements = document.querySelectorAll('#stars span');
                    starElements.forEach((star, i) => {
                        star.style.color = i < count ? '#f39c12' : '#ccc';
                    });
                }
                
                function resetStars() {
                    const starElements = document.querySelectorAll('#stars span');
                    starElements.forEach((star, i) => {
                        star.style.color = i < currentRating ? '#f39c12' : '#ccc';
                    });
                }
                
                function showRating() {
                    document.getElementById('ratingPanel').style.display = 'block';
                }
                
                function hideRating() {
                    document.getElementById('ratingPanel').style.display = 'none';
                }
                
                function submitRating() {
                    const comment = document.getElementById('comment').value;
                    alert('Rating submitted!\\nStars: ' + currentRating + '\\nComment: ' + comment);
                    hideRating();
                }
                
                urlBar.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') goToUrl();
                });
            </script>
        </body>
        </html>
    `);

    mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});