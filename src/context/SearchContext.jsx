import { createContext, useContext, useState } from 'react';
import Home from '../pages/Home';
import Morphology from '../pages/Morphology';
import Nutrition from '../pages/Nutrition';
import Population from '../pages/Population';
import Photo from '../pages/Photo';

const SearchContext = createContext();

const PAGES = [
  {
    path: '/',
    title: 'Головна',
    component: Home
  },
  {
    path: '/morphology',
    title: 'Зовнішній вигляд зубрів',
    component: Morphology
  },
  {
    path: '/nutrition',
    title: 'Харчування зубрів',
    component: Nutrition
  },
  {
    path: '/population',
    title: 'Ареал зубрів',
    component: Population
  },
  {
    path: '/photo',
    title: 'Фотографії зубрів',
    component: Photo
  }
];

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const extractTextContent = (element) => {
    if (!element) return '';
    if (typeof element === 'string') return element;
    if (Array.isArray(element)) {
      return element.map(extractTextContent).join(' ');
    }
    if (typeof element === 'object') {
      if (element.props) {
        if (element.props.children) {
          return extractTextContent(element.props.children);
        }
        return '';
      }
      return '';
    }
    return '';
  };

  const getPageContent = (Component) => {
    try {
      const rendered = Component();
      return extractTextContent(rendered);
    } catch (e) {
      console.error('Error extracting content from component:', e);
      return '';
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchTerm('');
      return;
    }

    setSearchTerm(term);

    const results = PAGES.filter(page => {
      const searchTermLower = term.toLowerCase();
      const pageContent = getPageContent(page.component);
      return (
        page.title.toLowerCase().includes(searchTermLower) ||
        pageContent.toLowerCase().includes(searchTermLower)
      );
    }).map(page => ({
      title: page.title,
      path: page.path,
      excerpt: getPageContent(page.component).substring(0, 150) + '...',
    }));

    setSearchResults(results);
  };

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    handleSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}