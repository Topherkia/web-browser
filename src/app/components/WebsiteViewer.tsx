import { ExternalLink, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

interface WebsiteViewerProps {
  url: string;
}

export function WebsiteViewer({ url }: WebsiteViewerProps) {
  // Extract domain name for display
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Alert className="m-4 mb-0">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              This is a simulated browser. In a real implementation, websites would load here.
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline ml-4 whitespace-nowrap"
            >
              Open in new tab
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex-1 m-4 mt-4">
        <Card className="h-full p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl">
              {getDomain(url).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl mb-2">{getDomain(url)}</h2>
              <p className="text-sm text-gray-500 break-all">{url}</p>
            </div>
            <p className="text-gray-600 max-w-md">
              This is a placeholder for the actual website content. Click the "Open in new tab"
              button above to visit the real website.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
