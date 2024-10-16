import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Scrollbar from '../scrollbar/ScrollBar'; // Import the Scrollbar component

const DropdownMenu = ({
  defaultText = 'Select',
  allText = null,
  items,
  onSelect = null,
  selectedValue = '',
  customTrigger = null, // New optional prop
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  // Determine the button content based on selectedValue
  const selectedItem = items.find((item) => item.value === selectedValue);
  const buttonContent = selectedValue ? selectedItem?.label : defaultText;

  // Tailwind classes
  const defaultButtonClasses = 'inline-flex w-full justify-center gap-x-1.5 rounded-md bg-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700';

  const menuClasses =
    'absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none';

  const itemClasses = 'block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left flex items-center';

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
        {customTrigger ? (
          // Render custom trigger if provided
          <div onClick={toggleMenu}>{customTrigger}</div>
        ) : (
          // Default button
          <button
            type="button"
            className={defaultButtonClasses}
            id="menu-button"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={toggleMenu}
          >
            {buttonContent}
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
        )}
      </div>

      {isOpen && (
        <div
          className={menuClasses}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <Scrollbar className="max-h-80">
            <div className="py-1" role="none">
              {allText && (
                <button
                  type="button"
                  onClick={() => handleItemClick({ id: 'all', label: allText, value: '' })}
                  className={`${itemClasses} font-bold`}
                  role="menuitem"
                  tabIndex="-1"
                >
                  {allText}
                  {selectedValue === '' && checkmark}
                </button>
              )}
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={itemClasses}
                  role="menuitem"
                  tabIndex="-1"
                >
                  {item.label}
                  {item.value === selectedValue && checkmark}
                </button>
              ))}
            </div>
          </Scrollbar>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking
DropdownMenu.propTypes = {
  defaultText: PropTypes.node, // Changed to node to accept JSX
  allText: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  onSelect: PropTypes.func,
  selectedValue: PropTypes.any,
  customTrigger: PropTypes.node, // New prop
};

export default DropdownMenu;
