import { Search } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  favicon?: string;
}

interface SearchResultsProps {
  query: string;
  onNavigate: (url: string) => void;
}

// Mock search results - in a real app, this would call a search API
const getSearchResults = (query: string): SearchResult[] => {
  const mockResults: SearchResult[] = [
    {
      title: 'Wikipedia - The Free Encyclopedia',
      url: 'https://wikipedia.org',
      description: 'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world.',
    },
    {
      title: 'GitHub: Where the world builds software',
      url: 'https://github.com',
      description: 'GitHub is where over 100 million developers shape the future of software, together.',
    },
    {
      title: 'Stack Overflow - Where Developers Learn & Share',
      url: 'https://stackoverflow.com',
      description: 'Stack Overflow is the largest online community for programmers to learn and share their knowledge.',
    },
    {
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      description: 'Resources for developers, by developers. Documentation for web technologies including HTML, CSS, and JavaScript.',
    },
    {
      title: 'Reddit - Dive into anything',
      url: 'https://reddit.com',
      description: 'Reddit is a network of communities where people can dive into their interests, hobbies and passions.',
    },
    {
      title: 'Medium – Where good ideas find you',
      url: 'https://medium.com',
      description: 'Medium is an open platform where readers find dynamic thinking, and where expert and undiscovered voices can share their writing.',
    },
    {
      title: 'YouTube',
      url: 'https://youtube.com',
      description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world.',
    },
    {
      title: 'Twitter / X',
      url: 'https://twitter.com',
      description: "From breaking news and entertainment to sports and politics, get the full story with all the live commentary.",
    },
  ];

  // Filter results based on query
  if (!query) return mockResults;
  
  const lowerQuery = query.toLowerCase();
  return mockResults.filter(
    (result) =>
      result.title.toLowerCase().includes(lowerQuery) ||
      result.description.toLowerCase().includes(lowerQuery) ||
      result.url.toLowerCase().includes(lowerQuery)
  );
};

export function SearchResults({ query, onNavigate }: SearchResultsProps) {
  const results = getSearchResults(query);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Search results for</p>
          <h2 className="text-xl">{query}</h2>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <Card
            key={index}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onNavigate(result.url)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                {result.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-blue-600 hover:underline mb-1">
                  {result.title}
                </h3>
                <p className="text-sm text-green-700 mb-1">{result.url}</p>
                <p className="text-sm text-gray-600">{result.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
