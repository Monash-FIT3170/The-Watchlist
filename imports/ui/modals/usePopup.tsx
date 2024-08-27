import {useState} from 'react';

const usePopup = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(null);


    const handleItemClick = (list) => {
        setSelectedList(list);
        setIsPopupOpen(true);   
    };


    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedList(null);
    };
   

    return {
        isPopupOpen,
        selectedList,
        handleItemClick,
        handleClosePopup
    };

}

export default usePopup;