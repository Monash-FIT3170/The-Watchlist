// src/components/VisibilityDropdown.jsx

import React from 'react';
import { FaGlobe, FaUsers, FaLock } from 'react-icons/fa';
import DropdownMenu from './DropdownMenu';
import PropTypes from 'prop-types';

const VisibilityDropdown = ({ list, setVisibility, listId, currentVisibility }) => {
    const iconSize = 24; // Adjust as needed to match other icons

    // Determine the icon based on current visibility
    const getCurrentIcon = () => {
        switch (currentVisibility) {
            case 'PUBLIC':
                return <FaGlobe size={iconSize} />;
            case 'FOLLOWERS':
                return <FaUsers size={iconSize} />;
            case 'ONLY_ME':
                return <FaLock size={iconSize} />;
            default:
                return <FaGlobe size={iconSize} />;
        }
    };

    const visibilityOptions = [
        {
            id: 'public',
            label: (
                <span className="flex items-center">
                    <FaGlobe className="mr-2" />
                    Public
                </span>
            ),
            value: 'PUBLIC',
        },
        {
            id: 'followers',
            label: (
                <span className="flex items-center">
                    <FaUsers className="mr-2" />
                    Followers
                </span>
            ),
            value: 'FOLLOWERS',
        },
        {
            id: 'only_me',
            label: (
                <span className="flex items-center">
                    <FaLock className="mr-2" />
                    Only Me
                </span>
            ),
            value: 'ONLY_ME',
        },
    ];

    const handleVisibilitySelect = (item) => {
        Meteor.call(
            'list.setVisibility',
            {
                listId: listId,
                visibleType: item.value,
            },
            (err) => {
                if (err) {
                    console.error('Set visibility error:', err);
                } else {
                    setVisibility(item.value);
                }
            }
        );
    };

    return (
        list.userId === Meteor.userId() && (
            <DropdownMenu
                defaultText={null} // We won't use the default text
                items={visibilityOptions}
                onSelect={handleVisibilitySelect}
                selectedValue={currentVisibility}
                allText={null} // Do not include "All" option
                customTrigger={
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold rounded-full flex items-center justify-center"
                        style={{ width: 44, height: 44 }}
                        title="Change Visibility"
                    >
                        {getCurrentIcon()}
                    </button>
                }
            />
        )
    );
};

// Define PropTypes for type checking
VisibilityDropdown.propTypes = {
    list: PropTypes.object.isRequired,
    setVisibility: PropTypes.func.isRequired,
    listId: PropTypes.string.isRequired,
    currentVisibility: PropTypes.string.isRequired,
};

export default VisibilityDropdown;
