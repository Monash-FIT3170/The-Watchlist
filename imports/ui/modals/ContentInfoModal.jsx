import React, { useEffect, useState, forwardRef, useRef } from 'react';
import ClickableRatingStar from '../components/ratings/ClickableRatingStar';
import Modal from './Modal';
import Scrollbar from '../components/scrollbar/ScrollBar';
import { useTracker } from 'meteor/react-meteor-data';
import { RatingCollection } from '../../db/Rating';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the icons
import SingleStarRating from '../components/ratings/SingleStarRating';

const popcornUrl = "./images/popcorn-banner.png"; // Default image URL

const ContentInfoModal = forwardRef(({ isOpen, onClose, content, modalRef, onRatingUpdate, seasonId }, ref) => {

  const contentId = content.contentId || content.id;
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const scrollContainerRef = useRef(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
  const [showFullCast, setShowFullCast] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [seasonRating, setSeasonRating] = useState({});
  const [seasonAverageRating, setSeasonAverageRating] = useState(0);
  const [seasonTotalRatings, setSeasonTotalRatings] = useState(0);
  const [isEpisodeListVisible, setIsEpisodeListVisible] = useState(false);
  const [seasonRatings, setSeasonRatings] = useState({}); // Store ratings for each season

  // Use Meteor's reactive data system to fetch season ratings
  useTracker(() => {
    if (selectedSeason && contentId) {
      const handle = Meteor.subscribe('seasonRatings', contentId, selectedSeason);
      if (handle.ready()) {
        const ratingDoc = RatingCollection.findOne({ contentId, seasonId: selectedSeason });
        setSeasonRating(ratingDoc ? ratingDoc.rating : 0); // Update UI when the data is ready
      }
    }
  }, [selectedSeason, contentId]);

  const loadEpisodes = (seasonNumber) => {
    console.log("Loading episodes for season:", seasonNumber);
    if (!seasonNumber) {
      console.warn("Attempted to load episodes without a valid season number");
      return;
    }
    const selectedSeason = content.seasons.find(season => season.season_number === seasonNumber);
    if (selectedSeason) {
      setSelectedSeason(selectedSeason.season_number);
      setSelectedSeasonEpisodes(selectedSeason.episodes);
      setSeasonRating(null); // Reset season rating when switching seasons
      setShowEpisodes(true);
    }
  };

  const toggleEpisodeListVisibility = () => {
    setIsEpisodeListVisible(!isEpisodeListVisible); // Toggle the visibility
  };

  const handleBackClick = () => {
    setIsEpisodeListVisible(false);
    setSelectedSeason(null); // Reset the selected season when going back
  };

  useEffect(() => {
    if (0 < content.rating && content.rating < 6) {
      setValue(content.rating);
    }
  }, [content]);

  const handleRating = (newValue) => {
    content.rating = newValue;
  };

  const handleModalBackgroundClick = (event) => {
    event.stopPropagation();
  };

  const handleCloseClick = (event) => {
    event.stopPropagation();
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  }


  const handleToggleCast = () => {
    setShowFullCast(!showFullCast);
  };

  const renderActors = () => {
    if (!content.actors || content.actors.length === 0) {
      return null;
    }

    if (showFullCast || content.actors.length <= 5) {
      return content.actors.join(', ');
    }

    const firstFiveActors = content.actors.slice(0, 5).join(', ');
    return (
      <>
        {firstFiveActors}
        {content.actors.length > 5 && (
          <span style={{ cursor: 'pointer', color: 'white', fontStyle: 'italic' }} onClick={handleToggleCast}>
            {', more'}
          </span>
        )}
      </>
    );
  };

  useEffect(() => {
    console.log("Fetching data for contentId:", contentId);

    Meteor.call('ratings.getAverage', { contentId, contentType: content.contentType }, (error, result) => {
      if (error) {
        console.error('Failed to get global average rating:', error);
      } else {
        console.log("Global average rating fetched for contentId:", contentId, "Result:", result);
        setRating(result);
      }
    });

    Meteor.call('ratings.getUserRating', { userId: Meteor.userId(), contentId, contentType: content.contentType }, (error, result) => {
      if (error) {
        console.error('Failed to get user rating:', error);
      } else {
        console.log("User rating fetched for contentId:", contentId, "Result:", result);
        setUserRating(result);
      }
    });

    Meteor.call('ratings.getGlobalAverages', (error, result) => {
      if (error) {
        console.error('Failed to get total ratings count:', error);
      } else if (result[contentId]) {
        console.log("Total ratings count fetched for contentId:", contentId, "Count:", result[contentId].count);
        setTotalRatings(result[contentId].count);
      } else {
        console.log("No ratings found for contentId:", contentId);
      }
    });
  }, [contentId, content.contentType]);

  console.log("Rendered ContentInfoModal with rating:", rating, "userRating:", userRating, "totalRatings:", totalRatings);

  useEffect(() => {
    if (content.seasons && contentId) {
      content.seasons.forEach((season) => {
        Meteor.call('ratings.getSeasonAverage', {
          contentId,
          seasonId: season.season_number,
        }, (error, result) => {
          if (!error && result) {
            // Update the ratings for each season
            setSeasonRatings((prevRatings) => ({
              ...prevRatings,
              [season.season_number]: result.averageRating,
            }));

            // If the season is selected, update its specific rating and total ratings
            if (selectedSeason === season.season_number) {
              setSeasonAverageRating(result.averageRating);
              setSeasonTotalRatings(result.totalRatings);
            }
          } else {
            console.error('Error fetching season average rating:', error);
          }
        });
      });
    }
  }, [content.seasons, contentId, selectedSeason]);


  const addRating = (userId, contentId, contentType, rating) => {
    Meteor.call('ratings.addOrUpdate', { userId, contentId, contentType, rating }, (error) => {
      if (error) {
        console.error('Failed to update/add rating:', error);
      } else {
        // Fetch the updated average rating
        Meteor.call('ratings.getAverage', { contentId, contentType }, (error, result) => {
          if (error) {
            console.error('Failed to get updated global average rating:', error);
          } else {
            console.log("Updated global average rating for contentId:", contentId, "Result:", result);
            setRating(result);
            if (typeof onRatingUpdate === 'function') {
              onRatingUpdate(); // Trigger the callback to update ratings in SearchBar
            }
          }
        });

        // Fetch the updated total ratings count
        Meteor.call('ratings.getGlobalAverages', (error, result) => {
          if (error) {
            console.error('Failed to get updated total ratings count:', error);
          } else if (result[contentId]) {
            console.log("Updated total ratings count for contentId:", contentId, "Count:", result[contentId].count);
            setTotalRatings(result[contentId].count);
          } else {
            console.log("No ratings found for contentId after update:", contentId);
          }
        });
      }
    });
  };
  const handleSeasonRatingChange = (newRating) => {
    if (!selectedSeason) {
      console.error("No selected season to rate.");
      return;
    }

    Meteor.call('ratings.addOrUpdateSeasonRating', {
      userId: Meteor.userId(),
      contentId: contentId,
      seasonId: selectedSeason,
      rating: newRating
    }, (error) => {
      if (error) {
        console.error('Failed to update/add season rating:', error);
      } else {
        console.log("Season rating updated successfully");

        // Fetch the updated season average rating and total ratings count
        Meteor.call('ratings.getSeasonAverage', {
          contentId: contentId,
          seasonId: selectedSeason,
        }, (error, result) => {
          if (error) {
            console.error('Failed to get updated season average rating:', error);
          } else if (result) {
            console.log("Updated season average rating for contentId:", contentId, "Season:", selectedSeason, "Result:", result);
            setSeasonAverageRating(result.averageRating);
            setSeasonTotalRatings(result.totalRatings);
          }
        });
      }
    });
  };



  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // adjust this value to scroll more or less
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollWidth >
        scrollContainerRef.current.clientWidth + scrollContainerRef.current.scrollLeft
      );
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', updateScrollButtons);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', updateScrollButtons);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && seasonId) {
      setSelectedSeason(seasonId);
      setShowEpisodes(true);
    }
  }, [isOpen, seasonId]);


  const firstAiredYear = new Date(content.first_aired).getFullYear();
  const lastAiredYear = content.last_aired ? new Date(content.last_aired).getFullYear() : 'present';
  const numberOfSeasons = content.seasons ? content.seasons.length : 0;


  return isOpen ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleCloseClick}
      style={{ zIndex: 1000 }}
    >
      <Scrollbar className="modal-content w-1/2 max-h-[90vh] bg-gray-800 bg-opacity-90 rounded-lg shadow-lg relative">
        <div
          ref={ref}
          className="relative"
          onClick={handleModalBackgroundClick}
        >
          <div className="relative">
            <img
              src={content.background_url || content.image_url || popcornUrl}
              alt={content.title}
              className="w-full h-auto object-cover opacity-75"
            />
            <div className="absolute bottom-4 left-4 text-white text-3xl font-bold flex items-center">
              {content.title}
              <button
                className="ml-5 w-12 h-12 bg-magenta rounded-full hover:bg-dark-magenta active:shadow-lg shadow transition ease-in duration-200 focus:outline-none flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                <svg viewBox="0 0 20 20" enableBackground="new 0 0 20 20" className="w-6 h-6">
                  <path
                    fill="#FFFFFF"
                    d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
          C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
          C15.952,9,16,9.447,16,10z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 text-white bg-dark" onClick={handleModalClick}>
            <div className="flex justify-between text-gray-400 text-sm mb-2">
              {content.contentType === 'TV Show' ? (
                <div>{`${firstAiredYear} - ${lastAiredYear}`} • {numberOfSeasons} seasons</div>
              ) : (
                <div>{content.release_year}{content.runtime && ` • ${content.runtime} minutes`}</div>
              )}
              <div>{content.genres?.join(', ')}</div>
            </div>

            <p className="text-white mb-4">{content.overview}</p>
            {content.contentType === 'TV Show' && content.seasons && !showEpisodes ? (
              <div>
                <h3 className="text-xl mb-2">Seasons</h3>
                <div className="relative flex items-center">
                  <Scrollbar className="whitespace-nowrap" horizontal>
                    <div className="flex space-x-4">
                      {content.seasons.map((season, index) => (
                        <button
                          key={index}
                          className={`px-6 py-2 mb-2 rounded ${selectedSeason === season.season_number ? 'bg-gray-700' : 'bg-gray-500'
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSeason(season.season_number);
                            loadEpisodes(season.season_number);
                          }}
                        >
                          <span className="inline-flex items-center">
                            Season {season.season_number}
                            {/* Conditionally show the star icon if the season has been rated */}
                            {seasonRatings[season.season_number] ? (
                              <div className="ml-2 inline-flex">
                                <SingleStarRating totalStars={1} rating={seasonRatings[season.season_number] / 5} />
                              </div>
                            ) : null}
                          </span>

                        </button>
                      ))}
                    </div>
                  </Scrollbar>
                </div>
              </div>

            ) : showEpisodes ? (
              <div>
                <button
                  onClick={() => {
                    handleBackClick();
                    setSelectedSeason(null); // Reset the selected season to show the overall show rating
                    setShowEpisodes(false); // Hide the episode list when going back to seasons
                  }}
                  className="mb-4 mr-2 text-gray-400 hover:text-white"
                >
                  &larr; Back to seasons
                </button>
                <h3 className="text-xl mb-2 flex items-center">
                  Episodes
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-300"
                    onClick={toggleEpisodeListVisibility}
                  >
                    {isEpisodeListVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </h3>

                {/* Conditionally render the episode list */}
                {isEpisodeListVisible && (
                  <Scrollbar className="max-h-28" backgroundColor="#FFFFFF">
                    <ul>
                      {selectedSeasonEpisodes.map((episode, index) => (
                        <li key={index} className="mb-2">
                          <div className="text-lg">{`Episode ${episode.episode_number}: ${episode.title}`}</div>
                          <div className="text-sm text-gray-400">Runtime: {episode.runtime} minutes</div>
                        </li>
                      ))}
                    </ul>
                  </Scrollbar>
                )}
                <div className="mt-4">
                  <h4 className="text-lg mb-2">{`Rate season ${selectedSeason}`}</h4>
                  <ClickableRatingStar
                    totalStars={5}
                    rating={seasonRating || 0}
                    onChange={handleSeasonRatingChange}
                  />
                  <p className="mt-2 mb-2 text-sm">
                    <span className="text-gray-400">Average Season Rating: </span>
                    <span className="text-white">
                      {seasonAverageRating ?
                        `${parseFloat(seasonAverageRating) % 1 === 0 ? parseInt(seasonAverageRating) : parseFloat(seasonAverageRating).toFixed(1)}/5 
      (${seasonTotalRatings} ${seasonTotalRatings === 1 ? 'review' : 'reviews'})`
                        : "Not Yet Rated"}
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
            <div className="flex flex-col items-start mt-2">
              {!selectedSeason && (
                <>
                  <ClickableRatingStar
                    totalStars={5}
                    rating={userRating || 0}
                    onChange={(newValue) => {
                      console.log("New rating value:", newValue);
                      addRating(Meteor.userId(), contentId, content.contentType, newValue);
                      setUserRating(newValue);
                    }}
                  />
                  <p className="mt-2 mb-2 text-sm">
                    <span className="text-gray-400">Average Rating: </span>
                    <span className="text-white">
                      {rating ? `${parseFloat(rating) % 1 === 0 ? parseInt(rating) : parseFloat(rating).toFixed(1)}/5 (${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'})` : "Not Yet Rated"}
                    </span>
                  </p>
                </>
              )}

              {/* Directors */}
              {content.directors && content.directors.length > 0 && (
                <div className="text-sm mb-2">
                  <span className="text-gray-400 text-sm">
                    Director{content.directors.length > 1 ? 's' : ''}:
                  </span>
                  <span className="text-white"> {content.directors.join(', ')}</span>
                </div>
              )}

              {/* Cast */}
              {content.actors && content.actors.length > 0 && (
                <div className="text-sm mb-2">
                  <span className="text-gray-400 text-sm">Cast:</span>
                  <span className="text-white"> {renderActors()}</span>
                </div>
              )}


              {/* If the full cast is displayed, show an option to collapse it */}
              {showFullCast && content.actors.length > 5 && (
                <div style={{ cursor: 'pointer', color: 'white', fontStyle: 'italic' }} onClick={handleToggleCast}>
                  {'Show less'}
                </div>
              )}
            </div>

          </div>
        </div>
      </Scrollbar>
      <Modal ref={modalRef} show={showModal} onClose={() => setShowModal(false)} content={content} type={content.contentType} />
    </div>
  ) : null;

});

export default ContentInfoModal;
