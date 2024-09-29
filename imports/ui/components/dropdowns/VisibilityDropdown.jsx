// src/components/VisibilityDropdown.jsx

import React from 'react';
import { FaGlobe, FaUsers, FaLock } from 'react-icons/fa';
import DropdownMenu from './DropdownMenu';
import PropTypes from 'prop-types';

const VisibilityDropdown = ({ list, setVisibility, listId, currentVisibility }) => {

    const handleVisibilitySelect = (item) => {
        Meteor.call('list.setVisibility', {
            listId: listId, 
            visibleType: item.value
        }, (err) => {
            if (err) {
                console.error('Set visibility error:', err);
            } else { 
                setVisibility(item.value);
            }
        });
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
            value: 'PUBLIC'
        },
        {
            id: 'followers',
            label: (
                <span className="flex items-center">
                    <FaUsers className="mr-2" />
                    Followers
                </span>
            ),
            value: 'FOLLOWERS'
        },
        {
            id: 'only_me',
            label: (
                <span className="flex items-center">
                    <FaLock className="mr-2" />
                    Only Me
                </span>
            ),
            value: 'ONLY_ME'
        }
    ];

    return (
        // Conditionally render visibility settings
        list.userId === Meteor.userId() && (
            <DropdownMenu
                defaultText="Visibility"
                allText="" // Remove "All" option if not needed
                items={visibilityOptions}
                onSelect={handleVisibilitySelect}
                selectedValue={currentVisibility}
            />
        )
    );
};

// Define PropTypes for type checking
VisibilityDropdown.propTypes = {
    list: PropTypes.object.isRequired, // Ensure 'list' prop has 'userId'
    setVisibility: PropTypes.func.isRequired, // Function to update visibility state
    listId: PropTypes.string.isRequired, // ID of the list
    currentVisibility: PropTypes.string.isRequired, // Current visibility value
};

export default VisibilityDropdown;
