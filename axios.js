import axios from 'axios';

// Function to handle the search request
async function searchMovies(query) {
  const apiKey = 'af494bd325c7a11466338e7f4837eac8';
  const apiUrl = `https://api.themoviedb.org/3/search/movie`;

  try {
    const response = await axios.get(apiUrl, {
      params: {
        api_key: apiKey,
        query: query,
      },
    });

    // Process the response and extract the relevant movie data
    const results = response.data.results;
    const movies = results.map(movie => ({
      title: movie.title,
      poster: movie.poster_path,
      releaseDate: movie.release_date,
      overview: movie.overview,
    }));
    return movies;
  } catch (error) {
    console.error('Error searching movies:', error);
  }
}

export default searchMovies;