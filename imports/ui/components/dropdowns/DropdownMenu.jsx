// imports/ui/components/dropdowns/DropdownMenu.jsx

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const DropdownMenu = ({
  defaultText,
  allText,
  items,
  onSelect,
  selectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setIsOpen(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  // Determine the button text based on selectedValue
  const selectedItem = items.find(item => item.value === selectedValue);
  const buttonText = selectedValue ? selectedItem?.label : allText;

  // Prepare items with "All" option
  const allOption = { id: 'all', label: allText, value: '' }; // Use empty string for "All"
  const dropdownItems = [allOption, ...items];

  // Tailwind classes for dark mode
  const buttonClasses = 'inline-flex w-full justify-center gap-x-1.5 rounded-md bg-dark px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700';

  const menuClasses = 'absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none';

  const itemClasses = 'block px-4 py-2 text-sm text-white hover:bg-gray-700';

  const checkmark = (
    <svg
      className="w-4 h-4 ml-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
        stroke="#7B1450"
      />
    </svg>
  );  

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={buttonClasses}
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleMenu}
        >
          {buttonText}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className={menuClasses}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {dropdownItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`${itemClasses} w-full text-left flex items-center`}
                role="menuitem"
                tabIndex="-1"
              >
                <span>{item.label}</span>
                {item.value === selectedValue && checkmark}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking
DropdownMenu.propTypes = {
  defaultText: PropTypes.string.isRequired, // Text when no item is selected
  allText: PropTypes.string, // Text for the "All" option
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Unique identifier
      label: PropTypes.string.isRequired, // Display text
      value: PropTypes.any, // Value associated with the item
    })
  ).isRequired,
  onSelect: PropTypes.func, // Callback when an item is selected
  selectedValue: PropTypes.any, // Currently selected value
};

// Default props
DropdownMenu.defaultProps = {
  allText: 'All',
  onSelect: null,
  selectedValue: '',
};

export default DropdownMenu;
