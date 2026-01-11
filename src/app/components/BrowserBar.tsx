import { ArrowLeft, ArrowRight, RefreshCw, Search, Home, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useState } from 'react';

interface BrowserBarProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onToggleReviews: () => void;
  showReviews: boolean;
}

export function BrowserBar({
  currentUrl,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onHome,
  canGoBack,
  canGoForward,
  onToggleReviews,
  showReviews,
}: BrowserBarProps) {
  const [urlInput, setUrlInput] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(urlInput);
  };

  const handleSearch = () => {
    if (urlInput && !urlInput.startsWith('http')) {
      onNavigate(`search:${urlInput}`);
    } else {
      onNavigate(urlInput);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        disabled={!canGoBack}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onForward}
        disabled={!canGoForward}
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRefresh}>
        <RefreshCw className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onHome}>
        <Home className="h-5 w-5" />
      </Button>

      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search or enter website URL..."
            className="w-full pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Button
        variant={showReviews ? "default" : "outline"}
        size="icon"
        onClick={onToggleReviews}
        title="Toggle ratings and comments"
      >
        <Star className="h-5 w-5" />
      </Button>
    </div>
  );
}
