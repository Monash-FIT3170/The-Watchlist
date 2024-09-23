// imports/api/server/ContentHandler.tsx

import { Handler, HandlerFunc } from './Handler';
import { MovieCollection, TVCollection } from '../../db/Content';
import { check, Match } from 'meteor/check';

type GetContentOptions = {
  id?: string | number;
  searchString?: string;
  limit?: number;
  page?: number;
  genre?: string;
  language?: string;
  sortOption?: string;
  contentType?: string; // 'Movie' or 'TV Show'
};

type GetContentResults = {
  content: any[];
  total: number;
};

const readContent: HandlerFunc = {
  validate: ({
    id,
    searchString,
    limit,
    page,
    genre,
    language,
    sortOption,
    contentType,
  }: GetContentOptions) => {
    check(id, Match.Maybe(Match.OneOf(String, Number)));
    check(searchString, Match.Maybe(String));
    check(limit, Match.Maybe(Number));
    check(page, Match.Maybe(Number));
    check(genre, Match.Maybe(String));
    check(language, Match.Maybe(String));
    check(sortOption, Match.Maybe(String));
    check(contentType, Match.Maybe(String));
  },
  run: ({
    id,
    searchString,
    limit,
    page,
    genre,
    language,
    sortOption,
    contentType,
  }: GetContentOptions) => {
    const searchOptions: any = {
      limit: limit ?? 50,
      skip: limit && page ? limit * page : 0,
    };

    const searchCriteria: any = {};
    let fullDetails = false;

    if (id) {
      searchCriteria.contentId = Number(id);
      fullDetails = true;
    } else {
      if (searchString && searchString.trim() !== '') {
        searchCriteria.title = { $regex: searchString, $options: 'i' };
      }

      if (genre && genre.trim() !== '') {
        searchCriteria.genres = genre;
      }

      if (language && language.trim() !== '') {
        searchCriteria.language = language;
      }
    }

    // Define default sort options
    let sortOptions: any = {};

    if (sortOption === 'title_asc') {
      sortOptions.title = 1;
    } else if (sortOption === 'title_desc') {
      sortOptions.title = -1;
    } else if (sortOption === 'release_date_asc') {
      sortOptions.release_year = 1; // For movies
    } else if (sortOption === 'release_date_desc') {
      sortOptions.release_year = -1; // For movies
    } else {
      sortOptions.popularity = -1;
    }

    // Define projection based on whether full details are needed
    let projection: any = null;

    if (!fullDetails) {
      projection = {
        contentId: 1,
        title: 1,
        image_url: 1,
        release_year: 1,
        first_aired: 1,
        genres: 1,
        popularity: 1,
        origin_country: 1,
      };
    }

    // Build query options, including fields only if projection is defined
    const queryOptions: any = {
      ...searchOptions,
      sort: sortOptions,
    };

    if (projection) {
      queryOptions.fields = projection;
    }

    let results: GetContentResults = { content: [], total: 0 };

    if (contentType === 'Movie') {
      const moviesCursor = MovieCollection.find(searchCriteria, queryOptions);
      results.content = moviesCursor.fetch();
      results.total = MovieCollection.find(searchCriteria).count();
    } else if (contentType === 'TV Show') {
      // Adjust sort options for TV shows
      if (sortOption === 'release_date_asc' || sortOption === 'release_date_desc') {
        sortOptions = {
          first_aired: sortOption === 'release_date_asc' ? 1 : -1,
        };
      }

      const tvCursor = TVCollection.find(searchCriteria, queryOptions);
      results.content = tvCursor.fetch();
      results.total = TVCollection.find(searchCriteria).count();
    } else {
      throw new Meteor.Error(
        'Invalid content type',
        'contentType must be either "Movie" or "TV Show".'
      );
    }

    const contentWithType = results.content.map((item) => ({
      ...item,
      contentType,
    }));

    return {
      content: contentWithType,
      total: results.total,
    };
  },
};

const ContentHandler = new Handler('content').addReadHandler(readContent);

export default ContentHandler;
