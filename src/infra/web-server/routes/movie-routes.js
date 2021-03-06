const CreateMovieRouterComposer = require("../../composers/movie/create-movie-router-composer");
const ListingMovieRouterComposer = require("../../composers/movie/listing-movie-router-composer");
const VoteMovieRouterComposer = require("../../composers/movie/vote-movie-router-composer");
const DetailMovieRouterComposer = require("../../composers/movie/detail-movie-router-composer");
const { adapt } = require("../../adapters/express-router-adapter");

const prefix = '/movies';

module.exports = (router) => {
  router.post(
    prefix,
    adapt(CreateMovieRouterComposer.compose())
  );

  router.get(
    `${prefix}/:id`,
    adapt(DetailMovieRouterComposer.compose())
  );

  router.get(
    prefix,
    adapt(ListingMovieRouterComposer.compose())
  );

  router.post(
    `${prefix}/:movieId/vote`,
    adapt(VoteMovieRouterComposer.compose())
  );
};
