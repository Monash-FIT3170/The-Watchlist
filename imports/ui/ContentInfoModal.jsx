import React, { useEffect, useState, forwardRef } from 'react';
import ClickableRatingStar from './ClickableRatingStar';
import { useTracker } from 'meteor/react-meteor-data';
import { Rating as RatingDB } from '../db/Rating';
import Modal from './Modal';

const ContentInfoModal = forwardRef(({ isOpen, onClose, content }, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);

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

  const { rating, userRating, totalRatings } = useTracker(() => {
    const handler = Meteor.subscribe("ratings");
    if (!handler.ready()) {
      return { rating: 0, userRating: null, totalRatings: 0 };
    }
    const ratings = RatingDB.find({ contentId: content.id }).fetch();
    const total = ratings.reduce((acc, cur) => acc + cur.rating, 0);
    const averageRating = ratings.length > 0 ? (total / ratings.length).toFixed(2) : 0;
    const userRating = ratings.find(r => r.userId === Meteor.userId())?.rating;
    return {
      rating: averageRating,
      userRating,
      totalRatings: ratings.length
    };
  });

  const addRating = (userId, contentId, contentType, rating) => {
    Meteor.call('ratings.addOrUpdate', { userId, contentId, contentType, rating }, (error, result) => {
      if (error) {
        console.error('Failed to update/add rating:', error);
      }
    });
  };

  const loadEpisodes = (seasonNumber) => {
    Meteor.call('tv.getEpisodes', content.id, seasonNumber, (error, result) => {
      if (error) {
        console.error('Failed to load episodes:', error);
      } else {
        setEpisodes(result);
        setSelectedSeason(seasonNumber);
      }
    });
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const firstAiredYear = new Date(content.first_aired).getFullYear();
  const lastAiredYear = content.last_aired ? new Date(content.last_aired).getFullYear() : 'present';
  const numberOfSeasons = content.seasons ? content.seasons.length : 0;

  return isOpen ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleCloseClick}
      style={{ zIndex: 1000 }}
    >
      <div
        ref={ref} // Attach the forwarded ref here
        className="modal-content w-1/2 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg overflow-hidden relative"
        onClick={handleModalBackgroundClick}
      >
        <div className="relative">
          <img
            src={content.background_url || content.image_url}
            alt={content.title}
            className="w-full h-auto object-cover opacity-75"
          />
          <div className="absolute bottom-4 left-4 text-white text-3xl font-bold">
            {content.title}
            <button
              className="ml-5 p-0 w-12 h-12 bg-magenta rounded-full hover:bg-dark-magenta active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              <svg viewBox="0 0 20 20" enableBackground="new 0 0 20 20" className="w-6 h-6 inline-block">
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
            {content.type === 'TV Show' ? (
              <div>{`${firstAiredYear} - ${lastAiredYear}`} • {numberOfSeasons} seasons</div>
            ) : (
              <div>{content.release_year}{content.runtime && ` • ${content.runtime} minutes`}</div>
            )}
            <div>{content.genres?.join(', ')}</div>
          </div>
          <p className="text-white mb-4">{content.overview}</p>
          {content.type === 'TV Show' && content.seasons && (
            <div>
              <h3 className="text-xl mb-2">Seasons</h3>
              <div className="flex space-x-2 mb-4">
                {content.seasons.map((season, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded ${selectedSeason === season.season_number ? 'bg-gray-700' : 'bg-gray-500'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      loadEpisodes(season.season_number);
                    }}
                  >
                    Season {season.season_number}
                  </button>
                ))}
              </div>
              {episodes.length > 0 && (
                <div>
                  <h4 className="text-lg mb-2">Episodes</h4>
                  <ul className="space-y-2">
                    {episodes.map((episode, index) => (
                      <li key={index} className="border-b border-gray-600 pb-2">
                        <strong>Episode {episode.episode_number}:</strong> {episode.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col items-start mb-4">
            <ClickableRatingStar
              totalStars={5}
              rating={userRating || 0}
              onChange={(newValue) => {
                addRating(Meteor.userId(), content.id, content.type, newValue);
              }}
            />
            <p className="mt-2">Average Rating: {rating ? `${rating}/5 (${totalRatings} reviews)` : "Not Yet Rated"}</p>
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} content={content} type={content.type} />
    </div>
  ) : null;
});

export default ContentInfoModal;
