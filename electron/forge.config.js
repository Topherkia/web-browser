module.exports = {
  packagerConfig: {
    asar: true,
    ignore: [
      /^\/\.github/,
      /^\/\.vscode/,
      /^\/scripts/,
      /^\/docs/,
      /^\/config/,
      /^\/database/,
      /^\/\.env/,
      /^\/\.gitignore/,
      /^\/README\.md/
    ],
    icon: 'build/icon',
    win32metadata: {
      CompanyName: 'Web Browser Rating System',
      FileDescription: 'Web Browser with Integrated Rating System',
      ProductName: 'Web Browser Rating System'
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'web_browser_rating_system',
        authors: 'Web Browser Team',
        exe: 'web-browser-rating-system.exe',
        noMsi: false,
        setupExe: 'WebBrowserRatingSystemSetup.exe',
        setupIcon: 'build/icon.ico'
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ]
};