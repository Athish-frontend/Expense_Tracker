import { MdSearch, MdClear } from 'react-icons/md';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search transactions by description, category, method...'
}) => {
  return (
    <div className="search-input-wrapper">
      <MdSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search transactions"
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <MdClear size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
