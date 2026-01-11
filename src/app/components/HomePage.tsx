import { Globe, TrendingUp, Clock, Bookmark } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface HomePageProps {
  onNavigate: (url: string) => void;
}

const quickLinks = [
  { name: 'Wikipedia', url: 'https://wikipedia.org', color: 'from-gray-700 to-gray-900' },
  { name: 'GitHub', url: 'https://github.com', color: 'from-gray-800 to-black' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: 'from-orange-500 to-orange-700' },
  { name: 'YouTube', url: 'https://youtube.com', color: 'from-red-500 to-red-700' },
  { name: 'Reddit', url: 'https://reddit.com', color: 'from-orange-600 to-red-600' },
  { name: 'Twitter', url: 'https://twitter.com', color: 'from-blue-400 to-blue-600' },
  { name: 'Medium', url: 'https://medium.com', color: 'from-green-600 to-green-800' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', color: 'from-blue-600 to-purple-600' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center mb-12 pt-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Globe className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl mb-2">Welcome to WebExplorer</h1>
          <p className="text-gray-600">
            Browse the web, rate websites, and share your thoughts
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl">Quick Links</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <button
                key={link.url}
                onClick={() => onNavigate(link.url)}
                className="group p-4 border rounded-lg hover:shadow-md transition-all hover:scale-105"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-lg mb-2 mx-auto flex items-center justify-center text-white text-xl`}
                >
                  {link.name.charAt(0)}
                </div>
                <p className="text-sm group-hover:text-blue-600">{link.name}</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl">Recent Activity</h2>
            </div>
            <p className="text-gray-600">
              Your browsing history and recent ratings will appear here
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="h-5 w-5 text-green-600" />
              <h2 className="text-xl">Bookmarks</h2>
            </div>
            <p className="text-gray-600">
              Save your favorite websites for quick access
            </p>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Search for anything or enter a URL in the address bar to get started</p>
        </div>
      </div>
    </div>
  );
}
