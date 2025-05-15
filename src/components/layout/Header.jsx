import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useState } from 'react';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const { handleSearch } = useSearch();

  const onSubmit = (event) => {
    event.preventDefault();
    if (searchInput.trim()) {
      handleSearch(searchInput);
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <header className="text-center bg-success text-white">
      <div className="container-fluid header-container">
        <div className="logo-container">
          <Link to="/" className="text-white text-decoration-none d-flex align-items-center">
            <img 
              src="/images/mainZubr.webp" 
              alt="Зубр" 
              className="site-logo rounded-circle me-2"
            />
            <span className="fs-4">Сайт про зубрів</span>
          </Link>
        </div>

        <nav className="main-nav">
          <Link to="/" className={`nav-link text-white ${location.pathname === '/' ? 'active' : ''}`}>
            Головна
          </Link>
          <Link to="/morphology" className={`nav-link text-white ${location.pathname === '/morphology' ? 'active' : ''}`}>
            Зовнішній вигляд зубрів
          </Link>
          <Link to="/nutrition" className={`nav-link text-white ${location.pathname === '/nutrition' ? 'active' : ''}`}>
            Харчування зубрів
          </Link>
          <Link to="/population" className={`nav-link text-white ${location.pathname === '/population' ? 'active' : ''}`}>
            Ареал зубрів
          </Link>
          <Link to="/photo" className={`nav-link text-white ${location.pathname === '/photo' ? 'active' : ''}`}>
            Фотографії зубрів
          </Link>
          <Link to="/rehabilitation" className={`nav-link text-white ${location.pathname === '/rehabilitation' ? 'active' : ''}`}>
            Реабілітація
          </Link>
        </nav>

        <div className="search-container">
          <form onSubmit={onSubmit} className="d-flex">
            <input
              type="search"
              className="form-control me-2"
              placeholder="Пошук на сайті..."
              value={searchInput}
              onChange={(inputEvent) => setSearchInput(inputEvent.target.value)}
            />
            <button type="submit" className="btn btn-light">
              Пошук
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

export default Header;