import React from 'react';
import ViewLists from './ViewLists';

const Modal = ({ show, onClose, listData }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-black rounded-lg shadow-lg p-8 max-w-lg h-80 w-full relative"> 

                <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">×</button>
                <div className="mb-4">
                    <ViewLists lists={listData.lists} title={listData.title} listType={listData.listType} />
                </div>
                <button className="px-5 py-2 bg-purple-500 text-white rounded-lg" onClick={onClose}>
                    Add to list
                </button>
            </div>
        </div>
    );
};

export default Modal;
