import React from 'react';
import ContentItem from './ContentItem';

const MovieInfo = ({ movie }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap justify-flex-start items-start mt-4">
            </div>
        </div>
    );
};

export default MovieInfo;