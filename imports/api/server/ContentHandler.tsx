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
  run: function ({
    id,
    searchString,
    limit,
    page,
    genre,
    language,
    sortOption,
    contentType,
  }: GetContentOptions) {
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

    const skip = limit && page ? limit * page : 0;
    const limitValue = limit ?? 50;

    const projection: any = {};
    if (!fullDetails) {
      projection.contentId = 1;
      projection.title = 1;
      projection.image_url = 1;
      projection.release_year = 1;
      projection.first_aired = 1;
      projection.genres = 1;
      projection.popularity = 1;
      projection.origin_country = 1;
      projection.contentType = 1;
    }

    let results: GetContentResults = { content: [], total: 0 };
    const CURRENT_YEAR = new Date().getFullYear();
    const MIN_YEAR = 1800;

    if (contentType === 'Movie') {
      const MovieCollectionRaw = MovieCollection.rawCollection();

      const pipeline: any[] = [{ $match: searchCriteria }];

      if (sortOption === 'release_date_asc' || sortOption === 'release_date_desc') {
        const sortOrder = sortOption === 'release_date_asc' ? 1 : -1;

        pipeline.push({
          $addFields: {
            isValidReleaseYear: {
              $and: [
                { $gte: ['$release_year', MIN_YEAR] },
                { $lte: ['$release_year', CURRENT_YEAR] },
                { $ne: ['$release_year', null] },
              ],
            },
          },
        });

        pipeline.push({
          $sort: {
            isValidReleaseYear: -1, // Valid years first
            release_year: sortOrder,
            _id: 1,
          },
        });
      } else if (sortOption === 'title_asc' || sortOption === 'title_desc') {
        const titleSortOrder = sortOption === 'title_asc' ? 1 : -1;
        pipeline.push({
          $sort: {
            title: titleSortOrder,
            _id: 1,
          },
        });
      } else {
        pipeline.push({
          $sort: {
            popularity: -1,
            _id: 1,
          },
        });
      }

      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limitValue });

      if (!fullDetails) {
        pipeline.push({ $project: projection });
      }

      // Execute the aggregation pipeline
      const moviesCursor = MovieCollectionRaw.aggregate(pipeline, { allowDiskUse: true });
      const movies = Meteor.wrapAsync(moviesCursor.toArray, moviesCursor)();

      // Get the total count
      const total = Meteor.wrapAsync(MovieCollectionRaw.countDocuments, MovieCollectionRaw)(searchCriteria);

      results.content = movies.map((item) => ({ ...item, contentType }));
      results.total = total;
    } else if (contentType === 'TV Show') {
      const TVCollectionRaw = TVCollection.rawCollection();

      const pipeline: any[] = [{ $match: searchCriteria }];

      if (sortOption === 'release_date_asc' || sortOption === 'release_date_desc') {
        const sortOrder = sortOption === 'release_date_asc' ? 1 : -1;

        pipeline.push({
          $addFields: {
            firstAiredYear: {
              $switch: {
                branches: [
                  {
                    case: { $eq: [{ $type: '$first_aired' }, 'date'] },
                    then: { $year: '$first_aired' },
                  },
                  {
                    case: {
                      $in: [{ $type: '$first_aired' }, ['double', 'int', 'long']],
                    },
                    then: '$first_aired',
                  },
                ],
                default: null,
              },
            },
            isValidFirstAiredYear: {
              $and: [
                { $gte: ['$firstAiredYear', MIN_YEAR] },
                { $lte: ['$firstAiredYear', CURRENT_YEAR] },
                { $ne: ['$firstAiredYear', null] },
              ],
            },
          },
        });

        pipeline.push({
          $sort: {
            isValidFirstAiredYear: -1, // Valid years first
            firstAiredYear: sortOrder,
            _id: 1,
          },
        });
      } else if (sortOption === 'title_asc' || sortOption === 'title_desc') {
        const titleSortOrder = sortOption === 'title_asc' ? 1 : -1;
        pipeline.push({
          $sort: {
            title: titleSortOrder,
            _id: 1,
          },
        });
      } else {
        pipeline.push({
          $sort: {
            popularity: -1,
            _id: 1,
          },
        });
      }

      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limitValue });

      if (!fullDetails) {
        pipeline.push({ $project: projection });
      }

      // Execute the aggregation pipeline
      const tvCursor = TVCollectionRaw.aggregate(pipeline, { allowDiskUse: true });
      const tvShows = Meteor.wrapAsync(tvCursor.toArray, tvCursor)();

      // Get the total count
      const total = Meteor.wrapAsync(TVCollectionRaw.countDocuments, TVCollectionRaw)(
        searchCriteria
      );

      results.content = tvShows.map((item) => ({ ...item, contentType }));
      results.total = total;
    } else {
      throw new Meteor.Error(
        'Invalid content type',
        'contentType must be either "Movie" or "TV Show".'
      );
    }

    return results;
  },
};

const ContentHandler = new Handler('content').addReadHandler(readContent);

export default ContentHandler;