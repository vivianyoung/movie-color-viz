const axios = require('axios');

MOVIEDB_API_URL = 'https://api.themoviedb.org/3'
MOVIEDB_API_KEY = '8bab42520fb79424d47245ab1e5406cf'
OMDB_API_KEY = 'e6dd17dc'

const getRequestMovieDB = async (queryUrl) => {
  let result = null;

  await axios.get(`${MOVIEDB_API_URL}${queryUrl}`).then((response) => {
    if (response.status == 200) {
      result = response.data;
    }
  }).catch( (err) => {
    console.log(err);
  });

  return result;
}

const getMovieApiData = async (movieName) => {
  let result = {};

  let data = await getRequestMovieDB(`/search/movie?api_key=${MOVIEDB_API_KEY}&query=${movieName}`);
  let movieData = data['results'][0];

  result['id'] = movieData['id'];
  result['poster url'] = `https://image.tmdb.org/t/p/original/${movieData['poster_path']}`;
  result['backdrop url'] = `https://image.tmdb.org/t/p/original/${movieData['backdrop_path']}`;
  result['overview'] = movieData['overview'];
  result['release date'] = movieData['release_date'];
  
  return result;
}

const getRecommendedMovies = async (movieName, numRecs=5) => {
  let result = [];
  result['type'] = 'movie';

  let movieData = await getMovieApiData(movieName);
  
  let recQueryUrl = `/movie/${movieData["id"]}/similar?api_key=${MOVIEDB_API_KEY}`;
  let recData = await getRequestMovieDB(recQueryUrl);

  for (let i = 0; i < numRecs; i++) {
    let currRecData = recData['results'][i];
    let data = {};

    data['title'] = currRecData['original_title'];
    data['id'] = currRecData['id'];
    data['poster'] = `https://image.tmdb.org/t/p/original/${currRecData['poster_path']}`;
    data['backdrop'] = `https://image.tmdb.org/t/p/original/${currRecData['backdrop_path']}`;
    data['overview'] = currRecData['overview'];
    data['date'] = currRecData['release_date'];

    result.push(data);
  }

  // add current movie
  let queryUrl = `/movie/${movieData["id"]}?api_key=${MOVIEDB_API_KEY}`;
  let queryData = await getRequestMovieDB(queryUrl);
  let originalData = {};

  originalData['title'] = queryData['original_title'];
  originalData['id'] = queryData['id'];
  originalData['poster'] = `https://image.tmdb.org/t/p/original/${queryData['poster_path']}`;
  originalData['backdrop'] = `https://image.tmdb.org/t/p/original/${queryData['backdrop_path']}`;
  originalData['overview'] = queryData['overview'];
  originalData['date'] = queryData['release_date'];

  result.push(originalData);

  return result;
}

const getPersonMovies = async (name, personType, numMovies=5) => {
  let result = [];
  result['type'] = personType;

  // first, get person id
  let searchData = await getRequestMovieDB(`/search/person?api_key=${MOVIEDB_API_KEY}&query=${name}`);
  let personId = searchData['results'][0]['id'];

  // get movies
  let worksData = await getRequestMovieDB(`/person/${personId}/combined_credits?api_key=${MOVIEDB_API_KEY}`);
  let sortedList;
  
  if (personType == 'producer') {
    let crewList = worksData['crew'];

    // filter out tv shows
    crewList = crewList.filter(function(e) {
      return e.media_type && e.media_type == 'movie';
    });

    // sort list by popularity
    sortedList = crewList.sort(function(first, second) {
      return second.popularity - first.popularity;
    });
  } else if (personType == 'actor') {
    let castList = worksData['cast'];

    // filter out tv shows
    castList = castList.filter(function(e) {
      return e.media_type && e.media_type == 'movie';
    });

    sortedList = castList.sort(function(first, second) {
      return second.popularity - first.popularity;
    });
  }

  // populate result list
  for (let i = 0; i < numMovies; i++) {
    let currMovieData = sortedList[i];
    let data = {};

    data['title'] = currMovieData['original_title'];
    data['id'] = currMovieData['id'];
    data['poster'] = `https://image.tmdb.org/t/p/original/${currMovieData['poster_path']}`;
    data['backdrop'] = `https://image.tmdb.org/t/p/original/${currMovieData['backdrop_path']}`;
    data['overview'] = currMovieData['overview'];
    data['date'] = currMovieData['release_date'];

    result.push(data);
  }

  return result;
}



module.exports = {
  getRecommendedMovies,
  getPersonMovies
};
