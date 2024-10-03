// src/components/ContentItemDisplay.jsx

import React from 'react';
import ContentItem from './ContentItem';
import LoadingNoAnimation from '/imports/ui/pages/LoadingNoAnimation';

const ContentItemDisplay = ({ contentItems, contentType, globalRatings, setGlobalRatings }) => {
    return (
        <>
            {contentItems.length > 0 ? (
                <div className="flex justify-center py-2">
                    <div className="w-full px-2">
                        <div
                            className="grid gap-6"
                            style={{
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            }}
                        >
                            {contentItems.map((content) => (
                                <ContentItem
                                    key={content.contentId}
                                    content={content}
                                    contentType={contentType}
                                    globalRating={globalRatings[content.contentId]?.average || 0}
                                    setGlobalRatings={setGlobalRatings}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <LoadingNoAnimation 
                    pageName="The Watchlist" 
                    pageDesc="Loading Updated AI Recommendations..." 
                    upperScreen={true} 
                />
            )}
        </>
    );
};

export default ContentItemDisplay;