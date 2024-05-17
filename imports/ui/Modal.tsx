import React from 'react';

const Modal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-black text-xl">×</button>
                <button className="px-5 py-2 bg-purple-500 text-white rounded-lg" onClick={onClose}>
                    Add to list
                </button>
            </div>
        </div>
    );
};

export default Modal;
