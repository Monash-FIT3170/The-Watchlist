import React, {useState, useEffect, useMemo} from 'react';
import {Meteor} from 'meteor/meteor';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import ContentItemDisplay from '../components/contentItems/ContentItemDisplay';

const TopRated = ({currentUser}) => {
    const [isMovie, setIsMovie] = useState(true);   
    const [topRatedContent, setTopRatedContent] = useState([]);
    const [globalRatings, setGlobalRatings] = useState({});


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


    //if user is not logged in, redirect to login page.
    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    //get the top rated content for the user.
    useEffect(() => {
      // Fetch based on the is movie type
      const contentType = isMovie ? 'Movie' : 'TV Show';
      Meteor.call('ratings.getTopRated', contentType, (error, result) => {
          if (error) {
              console.error(`Error fetching top rated ${contentType.toLowerCase()}:`, error.reason);
          } else {
              setTopRatedContent(result); 
              console.log(result); 
          }
      });

  }, [isMovie]);


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
          onClick={() => setIsMovie(true)}
        >
          Movies
        </button>
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${isMovie === false  ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'} border-transparent border`}
          onClick={() => setIsMovie(false)}
        >
          TV Shows
        </button>
      </div>
    </div>

    <ContentItemDisplay
             contentItems={topRatedContent.map((item, index) => ({
              ...item.contentDetails, 
              title: `${index + 1}. ${item.contentDetails.title}` 
            }))} 
              contentType= {isMovie  ? 'Movie' : "TV Show"}
              globalRatings={globalRatings}
              setGlobalRatings={setGlobalRatings}
            />
    </>



    );   

    

};


export default TopRated;