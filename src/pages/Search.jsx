import { useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Search() {
  const [searchParams] = useSearchParams();
  const { searchResults, handleSearch } = useSearch();
  const query = searchParams.get('query') || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      document.title = `Пошук: ${query} - Сайт про зубрів`;
      handleSearch(query);
    }
  }, [query, handleSearch]);

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={index} className="bg-warning">{part}</mark> : part
    );
  };

  return (
    <main className="container px-4 py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="h2 text-success mb-4">Результати пошуку</h2>
          {query && <p className="mb-4">Пошуковий запит: "{query}"</p>}
          
          {searchResults.length > 0 ? (
            <div className="row">
              {searchResults.map((result, index) => (
                <div key={index} className="col-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="h5 card-title text-success">
                        {highlightText(result.title, query)}
                      </h3>
                      <p className="card-text text-muted">
                        {highlightText(result.excerpt, query)}
                      </p>
                      <button 
                        onClick={() => navigate(result.path)}
                        className="btn btn-success"
                        aria-label={`Перейти до сторінки ${result.title}`}
                      >
                        Перейти на сторінку
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              {query ? 'За вашим запитом нічого не знайдено' : 'Введіть пошуковий запит у полі пошуку зверху'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Search;