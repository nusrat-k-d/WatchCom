export type Movie = {
  id: string;
  title: string;
  year: number;
  runtime: string;
  genres: string[];
  overview: string;
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  matchScore?: number;
  director?: string;
  actors?: string[];
  decade?: string;
  contentSimilarity?: number;
  userSimilarity?: number;
  genreAlignment?: number;
  confidenceLabel?: "High" | "Medium" | "Exploratory";
  hiddenGemReason?: string;
  discoveryScore?: number;
  confidence?: string;
  reason?: string;
  tags?: string[];
};

export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Interstellar",
    year: 2014,
    runtime: "169 min",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    rating: 4.8,
    matchScore: 98,
    director: "Christopher Nolan",
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    decade: "2010s",
    contentSimilarity: 96,
    userSimilarity: 99,
    genreAlignment: 94,
    confidenceLabel: "High"
  },
  {
    id: "2",
    title: "Inception",
    year: 2010,
    runtime: "148 min",
    genres: ["Sci-Fi", "Action", "Thriller"],
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1invgHHzwmqsDug9P7.jpg",
    rating: 4.9,
    matchScore: 95,
    director: "Christopher Nolan",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    decade: "2010s",
    contentSimilarity: 92,
    userSimilarity: 96,
    genreAlignment: 97,
    confidenceLabel: "High"
  },
  {
    id: "3",
    title: "The Dark Knight",
    year: 2008,
    runtime: "152 min",
    genres: ["Action", "Crime", "Drama"],
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    rating: 4.9,
    matchScore: 92,
    director: "Christopher Nolan",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    decade: "2000s",
    contentSimilarity: 88,
    userSimilarity: 95,
    genreAlignment: 90,
    confidenceLabel: "High"
  },
  {
    id: "4",
    title: "Fight Club",
    year: 1999,
    runtime: "139 min",
    genres: ["Drama", "Thriller"],
    overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/hZkgoQYus5vyzX1XItMGrzeXQG.jpg",
    rating: 4.7,
    matchScore: 89,
    director: "David Fincher",
    actors: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    decade: "1990s",
    contentSimilarity: 85,
    userSimilarity: 92,
    genreAlignment: 88,
    confidenceLabel: "Medium"
  },
  {
    id: "5",
    title: "The Matrix",
    year: 1999,
    runtime: "136 min",
    genres: ["Sci-Fi", "Action"],
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/7u3pxc0K1wx32IlePqdVN8Qpnw.jpg",
    rating: 4.8,
    matchScore: 94,
    director: "Lana Wachowski, Lilly Wachowski",
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    decade: "1990s",
    contentSimilarity: 95,
    userSimilarity: 93,
    genreAlignment: 95,
    confidenceLabel: "High"
  },
  {
    id: "6",
    title: "Whiplash",
    year: 2014,
    runtime: "106 min",
    genres: ["Drama", "Music"],
    overview: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/71vW1Xn7k92O7BqB00bLzQxKIfK.jpg",
    rating: 4.6,
    matchScore: 82,
    director: "Damien Chazelle",
    actors: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
    decade: "2010s",
    contentSimilarity: 75,
    userSimilarity: 85,
    genreAlignment: 88,
    confidenceLabel: "Medium"
  },
  {
    id: "7",
    title: "Pulp Fiction",
    year: 1994,
    runtime: "154 min",
    genres: ["Crime", "Drama"],
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/vQWk5YBFWFCPbV6ZT2DweA5r01g.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    rating: 4.8,
    matchScore: 85,
    director: "Quentin Tarantino",
    actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    decade: "1990s",
    contentSimilarity: 80,
    userSimilarity: 88,
    genreAlignment: 85,
    confidenceLabel: "Medium"
  },
  {
    id: "8",
    title: "Primer",
    year: 2004,
    runtime: "77 min",
    genres: ["Sci-Fi", "Thriller", "Drama"],
    overview: "Four friends/fledgling entrepreneurs, knowing that there's something bigger and more innovative than the different error-checking devices they've built, wrestle over their new invention.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/xXvTcw4XU1Vq5u9W5pXl3b6e8aM.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/5m2W3y1r4T3Gz7Qy6QZJ5G2R8r4.jpg",
    rating: 4.2,
    matchScore: 91,
    director: "Shane Carruth",
    actors: ["Shane Carruth", "David Sullivan", "Casey Gooden"],
    decade: "2000s",
    contentSimilarity: 98,
    userSimilarity: 82,
    genreAlignment: 96,
    confidenceLabel: "Exploratory",
    hiddenGemReason: "A micro-budget masterpiece that rewards multiple viewings. Matches your deep interest in complex, conceptual Sci-Fi like Inception and Interstellar.",
    discoveryScore: 99
  },
  {
    id: "9",
    title: "Coherence",
    year: 2013,
    runtime: "89 min",
    genres: ["Sci-Fi", "Thriller", "Mystery"],
    overview: "Strange things begin to happen when a group of friends gather for a dinner party on an evening when a comet is passing overhead.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/eA0jO3UaW2E1yT6x0y5O6n9x0m6.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/gN1s9d8a8Jb3P2zH2X9oZ0D8K4.jpg",
    rating: 4.3,
    matchScore: 93,
    director: "James Ward Byrkit",
    actors: ["Emily Baldoni", "Maury Sterling", "Nicholas Brendon"],
    decade: "2010s",
    contentSimilarity: 94,
    userSimilarity: 89,
    genreAlignment: 97,
    confidenceLabel: "Exploratory",
    hiddenGemReason: "Since you love cerebral thrillers and Sci-Fi, this largely improvised indie film delivers massive conceptual twists without the CGI budget.",
    discoveryScore: 96
  },
  {
    id: "10",
    title: "Moon",
    year: 2009,
    runtime: "97 min",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    overview: "Astronaut Sam Bell has a quintessentially personal encounter toward the end of his three-year stint on the Moon, where he, working alongside his computer, GERTY, sends back to Earth parcels of a resource that has helped diminish our planet's power problems.",
    posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/41OAwvQzHkK4A4Z1i71kR5N0i8L.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/9O1O8C8Q6o3G0a8G6b3XQ6H9X8A.jpg",
    rating: 4.4,
    matchScore: 88,
    director: "Duncan Jones",
    actors: ["Sam Rockwell", "Kevin Spacey", "Dominique McElligott"],
    decade: "2000s",
    contentSimilarity: 91,
    userSimilarity: 86,
    genreAlignment: 92,
    confidenceLabel: "Exploratory",
    hiddenGemReason: "A modern Sci-Fi classic that often flies under the radar. Its isolation theme strongly resonates with your affinity for Interstellar.",
    discoveryScore: 94
  }
];

export const GENRES = [
  "Action", "Comedy", "Drama", "Sci-Fi", "Thriller", 
  "Romance", "Fantasy", "Crime", "Adventure", "Animation", "Mystery", "Music"
];
