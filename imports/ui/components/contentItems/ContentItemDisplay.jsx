// src/components/ContentItemDisplay.jsx

import React from 'react';
import ContentItem from './ContentItem';

const ContentItemDisplay = ({ contentItems, contentType, globalRatings, setGlobalRatings }) => {
    console.log(contentItems);
    return (
        <div className="flex justify-center py-4">
            <div className="w-full px-4">
                <div
                    className="grid gap-6"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    }}
                >
                    {contentItems.length > 0 ? (
                        contentItems.map((content) => (
                            <ContentItem
                                key={content.contentId}
                                content={content}
                                contentType={contentType}
                                globalRating={globalRatings[content.contentId]?.average || 0}
                                setGlobalRatings={setGlobalRatings}
                            />
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <img src="/images/popcorn.png" alt={`No ${contentType}`} className="w-32 h-32" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentItemDisplay;
