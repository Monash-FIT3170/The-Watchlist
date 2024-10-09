import React, {useState, useEffect, useMemo} from 'react';
import {Meteor} from 'meteor/meteor';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import ContentItemDisplay from '../components/contentItems/ContentItemDisplay';
import LoadingNoAnimation from './LoadingNoAnimation';

const TopRated = ({currentUser}) => {
    const [isMovie, setIsMovie] = useState(true);   
    const [topRatedContent, setTopRatedContent] = useState([]);
    const [globalRatings, setGlobalRatings] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      Meteor.call('ratings.getGlobalAverages', (error, result) => {
        if (!error) {
          console.log('Global Ratings:', result);
          setGlobalRatings(result);
        } else {
          console.error("Error fetching global ratings:", error);
        }
      });
    }, []);


    const handleTypeChange = (isItMovie) => {
      setLoading(true);
      setIsMovie(isItMovie);
      

      setTimeout(() => {
        if (!loading) {
          setLoading(false);
        }
      }, 2000);
    };


    //if user is not logged in, redirect to login page.
    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    //get the top rated content for the user.
    useEffect(() => {
      // Fetch based on the is movie type
      setLoading(true);
      const contentType = isMovie ? 'Movie' : 'TV Show';
      Meteor.call('ratings.getTopRated', contentType, (error, result) => {
          if (error) {
              console.error(`Error fetching top rated ${contentType.toLowerCase()}:`, error.reason);
          } else {
              setTopRatedContent(result); 
              console.log(result); 
          }
          setLoading(false);
      });
  }, [isMovie]);


  if (loading) {
    return(
      <>
    <div className="flex flex-col justify-end items-start w-full h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md mb-4">
      <div className="absolute top-4 right-6">
        <ProfileDropdown user={currentUser} />
      </div>
      <h1 className="text-7xl text-white font-bold mb-8">Top Rated Content</h1>
      <div className="flex gap-4 mb-4">
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${isMovie  ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'}`}
        >
          Movies
        </button>
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${isMovie === false  ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'} border-transparent border`}
        >
          TV Shows
        </button>
      </div>
    </div>
     <LoadingNoAnimation pageName="The Watchlist" pageDesc="Switching your Top Rated Content..." upperScreen={true}/>);
     </>
    );
  }


    return(
      <>
        <div className="flex flex-col justify-end items-start w-full h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md mb-4">
      <div className="absolute top-4 right-6">
        <ProfileDropdown user={currentUser} />
      </div>
      <h1 className="text-7xl text-white font-bold mb-8">Top Rated Content</h1>
      <div className="flex gap-4 mb-4">
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${isMovie  ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'}`}
          onClick={() => handleTypeChange(true)}
        >
          Movies
        </button>
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${isMovie === false  ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'} border-transparent border`}
          onClick={() => handleTypeChange(false)}
        >
          TV Shows
        </button>
      </div>
    </div>

    <ContentItemDisplay
             contentItems={topRatedContent.map((item, index) => ({
              ...item.contentDetails, 
              title: `${index + 1}. ${item.contentDetails.title} (${item.count})` 
            }))} 
              contentType= {isMovie  ? 'Movie' : "TV Show"}
              globalRatings={globalRatings}
              setGlobalRatings={setGlobalRatings}
            />
    </>
    );   
};


export default TopRated;