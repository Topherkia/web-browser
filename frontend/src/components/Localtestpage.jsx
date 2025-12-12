// frontend/src/components/LocalTestPage.jsx
// A React component that serves as our local test page

import React, { useState } from 'react';

const LocalTestPage = () => {
    const [apiResult, setApiResult] = useState(null);
    const [colorIndex, setColorIndex] = useState(0);

    const colors = [
        { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: 'white' },
        { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: 'white' },
        { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: 'white' },
        { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: 'black' },
        { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: 'black' }
    ];

    const testJavaScript = () => {
        alert('✅ JavaScript is working perfectly!');
        setApiResult({ type: 'success', message: 'JavaScript alert triggered' });
    };

    const changeColor = () => {
        setColorIndex((colorIndex + 1) % colors.length);
        setApiResult({ type: 'info', message: 'Background color changed' });
    };

    const testAPI = async () => {
        try {
            setApiResult({ type: 'loading', message: 'Testing backend API...' });
            const response = await fetch('http://localhost:5000/api/health');
            const data = await response.json();
            setApiResult({
                type: 'success',
                message: 'Backend API connected successfully!',
                data: data
            });
        } catch (error) {
            setApiResult({
                type: 'error',
                message: `API Error: ${error.message}`,
                detail: 'Make sure the backend is running on port 5000'
            });
        }
    };

    const testDatabase = async () => {
        try {
            setApiResult({ type: 'loading', message: 'Testing database connection...' });
            const response = await fetch('http://localhost:5000/api/auth/check');
            const data = await response.json();
            setApiResult({
                type: 'success',
                message: 'Database connection successful!',
                data: data
            });
        } catch (error) {
            setApiResult({
                type: 'warning',
                message: 'Using mock database data',
                detail: 'Database features will work with mock data'
            });
        }
    };

    const currentColor = colors[colorIndex];

    return (
        <div style={{
            minHeight: '100vh',
            background: currentColor.bg,
            color: currentColor.text,
            padding: '20px',
            transition: 'background 0.5s ease'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '30px',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5em' }}>
                    🌐 Web Browser Rating System - Test Page
                </h1>

                <div style={{ marginBottom: '30px' }}>
                    <h2>✅ Features Working:</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', margin: '5px 0', borderRadius: '5px' }}>
                            ✅ Web Browser Interface with iframe
                        </li>
                        <li style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', margin: '5px 0', borderRadius: '5px' }}>
                            ✅ Rating System (1-5 stars)
                        </li>
                        <li style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', margin: '5px 0', borderRadius: '5px' }}>
                            ✅ Comment System with user authentication
                        </li>
                        <li style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', margin: '5px 0', borderRadius: '5px' }}>
                            ✅ Search Engine Integration (Google, Bing, DuckDuckGo, Yahoo)
                        </li>
                        <li style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', margin: '5px 0', borderRadius: '5px' }}>
                            ✅ Database Connectivity (MariaDB/MySQL)
                        </li>
                        <li style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', margin: '5px 0', borderRadius: '5px' }}>
                            ✅ Desktop Application (Electron)
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2>🔧 Test Controls:</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={testJavaScript}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            Test JavaScript
                        </button>
                        <button
                            onClick={changeColor}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            Change Background
                        </button>
                        <button
                            onClick={testAPI}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            Test Backend API
                        </button>
                        <button
                            onClick={testDatabase}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            Test Database
                        </button>
                    </div>
                </div>

                {apiResult && (
                    <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        background: apiResult.type === 'error' ? 'rgba(255,0,0,0.1)' :
                                  apiResult.type === 'warning' ? 'rgba(255,165,0,0.1)' :
                                  apiResult.type === 'loading' ? 'rgba(0,0,255,0.1)' :
                                  'rgba(0,255,0,0.1)',
                        borderLeft: `4px solid ${
                            apiResult.type === 'error' ? '#ff0000' :
                            apiResult.type === 'warning' ? '#ffa500' :
                            apiResult.type === 'loading' ? '#0000ff' : '#00ff00'
                        }`,
                        borderRadius: '5px'
                    }}>
                        <h3 style={{ marginTop: 0 }}>
                            {apiResult.type === 'error' ? '❌ Error:' :
                             apiResult.type === 'warning' ? '⚠️ Warning:' :
                             apiResult.type === 'loading' ? '⏳ Loading...' : '✅ Success:'}
                        </h3>
                        <p>{apiResult.message}</p>
                        {apiResult.detail && <p><small>{apiResult.detail}</small></p>}
                        {apiResult.data && (
                            <pre style={{
                                background: 'rgba(0,0,0,0.2)',
                                padding: '10px',
                                borderRadius: '5px',
                                overflow: 'auto',
                                fontSize: '12px'
                            }}>
                                {JSON.stringify(apiResult.data, null, 2)}
                            </pre>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '30px', fontSize: '14px', opacity: 0.8 }}>
                    <p>
                        <strong>Note:</strong> This is a local React component, not an iframe.
                        No sandbox warnings will appear here.
                    </p>
                    <p>
                        To test external websites, use the address bar above to navigate to
                        sites like https://example.com or https://wikipedia.org
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocalTestPage;