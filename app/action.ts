"use server";

import type { AnimeProp } from "@/components/AnimeCard";
import { data as fallbackData } from "./_data";

const JIKAN = "https://api.jikan.moe/v4";
const ANILIST = "https://graphql.anilist.co";

interface JikanGenre {
  mal_id: number;
  name: string;
}

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  images: {
    jpg: { image_url: string; large_image_url?: string | null };
  };
  type?: string | null;
  episodes?: number | null;
  status?: string;
  score?: number | null;
  synopsis?: string | null;
  aired?: { from?: string | null };
  rating?: string | null;
  genres?: JikanGenre[];
}

interface AniListMedia {
  id: number;
  idMal?: number | null;
  title: { english?: string | null; romaji?: string | null; native?: string | null };
  coverImage: { large?: string | null };
  bannerImage?: string | null;
  trailer?: { site?: string | null; id?: string | null } | null;
  format?: string | null;
  episodes?: number | null;
  status?: string | null;
  averageScore?: number | null;
  description?: string | null;
  startDate?: { year?: number | null };
  genres?: string[];
}

export interface FetchOptions {
  query?: string;
  kind?: string;
  order?: string;
  genre?: Genre | null;
}

export interface FetchResult {
  items: AnimeProp[];
  offline: boolean;
  hasMore: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface AnimeDetail extends AnimeProp {
  status?: string;
  description?: string;
  aired_on?: string | null;
  rating?: string;
  japanese?: string;
  banner?: string | null;
  trailerUrl?: string;
  genres?: Genre[];
}

const ORDER_MAP: Record<string, { order_by: string; sort: "asc" | "desc" }> = {
  popularity: { order_by: "popularity", sort: "asc" },
  ranked: { order_by: "score", sort: "desc" },
  aired_on: { order_by: "start_date", sort: "desc" },
  name: { order_by: "title", sort: "asc" },
};

const ANILIST_SORT: Record<string, string> = {
  popularity: "POPULARITY_DESC",
  ranked: "SCORE_DESC",
  aired_on: "START_DATE_DESC",
  name: "TITLE_ROMAJI",
};

const ANILIST_STATUS: Record<string, string> = {
  FINISHED: "Finished Airing",
  RELEASING: "Currently Airing",
  NOT_YET_RELEASED: "Not Yet Aired",
  CANCELLED: "Cancelled",
  HIATUS: "Hiatus",
};

const jikanToProp = (anime: JikanAnime): AnimeProp => ({
  id: anime.mal_id,
  name: anime.title_english ?? anime.title,
  image: {
    original:
      anime.images.jpg.large_image_url ?? anime.images.jpg.image_url,
  },
  kind: anime.type ?? "TV",
  episodes: anime.episodes ?? 0,
  episodes_aired: anime.episodes ?? 0,
  score: anime.score != null ? String(anime.score) : "N/A",
});

const anilistToProp = (media: AniListMedia): AnimeProp => ({
  id: media.idMal ?? media.id,
  name: media.title.english ?? media.title.romaji ?? "Unknown",
  image: { original: media.coverImage.large ?? "" },
  kind: media.format ?? "TV",
  episodes: media.episodes ?? 0,
  episodes_aired: media.episodes ?? 0,
  score:
    media.averageScore != null
      ? (media.averageScore / 10).toFixed(1)
      : "N/A",
});

const matchesQuery = (name: string, query: string) =>
  name.replace(/_/g, " ").toLowerCase().includes(query.toLowerCase());

const anilistQuery = async <T>(query: string, variables: object): Promise<T> => {
  const res = await fetch(ANILIST, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`AniList API responded with ${res.status}`);
  }
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (!json.data) {
    throw new Error("AniList API returned no data");
  }
  return json.data;
};

const fetchAnimeJikan = async (
  page: number,
  options: FetchOptions
): Promise<FetchResult> => {
  const { query = "", kind = "all", order = "popularity", genre = null } =
    options;
  const { order_by, sort } = ORDER_MAP[order] ?? ORDER_MAP.popularity;

  const params = new URLSearchParams({
    page: String(page),
    limit: "8",
    order_by,
    sort,
    sfw: "true",
  });
  if (query) params.set("q", query);
  if (kind !== "all") params.set("type", kind);
  if (genre) params.set("genres", String(genre.id));

  const res = await fetch(`${JIKAN}/anime?${params}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`Jikan API responded with ${res.status}`);
  }
  const json = (await res.json()) as {
    data: JikanAnime[];
    pagination: { has_next_page: boolean };
  };
  return {
    items: json.data.map(jikanToProp),
    offline: false,
    hasMore: json.pagination.has_next_page,
  };
};

const fetchAnimeAnilist = async (
  page: number,
  options: FetchOptions
): Promise<FetchResult> => {
  const { query = "", kind = "all", order = "popularity", genre = null } =
    options;

  const variables: Record<string, unknown> = {
    page,
    perPage: 8,
    sort: [ANILIST_SORT[order] ?? "POPULARITY_DESC"],
  };
  if (query) variables.search = query;
  if (kind !== "all") variables.format = kind.toUpperCase();
  if (genre) variables.genre = genre.name;

  const data = await anilistQuery<{
    Page: {
      pageInfo: { hasNextPage: boolean };
      media: AniListMedia[];
    };
  }>(
    `query ($page: Int, $perPage: Int, $search: String, $format: MediaFormat, $genre: String, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage }
        media(type: ANIME, search: $search, format: $format, genre: $genre, sort: $sort, isAdult: false) {
          id idMal
          title { english romaji }
          coverImage { large }
          format episodes averageScore
        }
      }
    }`,
    variables
  );

  return {
    items: data.Page.media.filter((m) => m.coverImage.large).map(anilistToProp),
    offline: false,
    hasMore: data.Page.pageInfo.hasNextPage,
  };
};

export const fetchAnime = async (
  page: number,
  options: FetchOptions = {}
): Promise<FetchResult> => {
  try {
    return await fetchAnimeJikan(page, options);
  } catch {
    try {
      return await fetchAnimeAnilist(page, options);
    } catch {
      if (page > 1) return { items: [], offline: true, hasMore: false };
      const { query = "", kind = "all" } = options;
      let items = fallbackData;
      if (query) {
        items = items.filter((item) => matchesQuery(item.name, query));
      }
      if (kind !== "all") {
        items = items.filter((item) => item.kind.toLowerCase() === kind);
      }
      return { items, offline: true, hasMore: false };
    }
  }
};

export const fetchAnimeById = async (
  id: string
): Promise<AnimeDetail | null> => {
  try {
    const res = await fetch(`${JIKAN}/anime/${id}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      throw new Error(`Jikan API responded with ${res.status}`);
    }
    const { data } = (await res.json()) as { data: JikanAnime };
    return {
      ...jikanToProp(data),
      status: data.status,
      description: data.synopsis ?? undefined,
      aired_on: data.aired?.from,
      rating: data.rating?.split(" - ")[0],
      japanese: data.title_japanese ?? undefined,
      genres: data.genres?.map((g) => ({ id: g.mal_id, name: g.name })),
    };
  } catch {
    try {
      const media = await fetchAniListMedia(id);
      if (!media) throw new Error("Not found");
      return {
        ...anilistToProp(media),
        status: ANILIST_STATUS[media.status ?? ""] ?? media.status ?? undefined,
        description: media.description?.replace(/<[^>]+>/g, "") ?? undefined,
        aired_on: media.startDate?.year
          ? `${media.startDate.year}-01-01`
          : null,
        japanese: media.title.native ?? undefined,
        banner: media.bannerImage,
        trailerUrl:
          media.trailer?.site === "youtube" && media.trailer.id
            ? `https://www.youtube.com/watch?v=${media.trailer.id.trim()}`
            : undefined,
        genres: media.genres?.map((name, i) => ({ id: i, name })),
      };
    } catch {
      const fallback = fallbackData.find((item) => item.id === id);
      return fallback ? { ...fallback } : null;
    }
  }
}

const ANILIST_MEDIA_FIELDS = `
  id idMal
  title { english romaji native }
  coverImage { large }
  bannerImage
  trailer { site id }
  format episodes status averageScore description
  startDate { year }
  genres
`;

const fetchAniListMedia = async (
  id: string
): Promise<AniListMedia | null> => {
  const query = (field: string) =>
    `query ($id: Int) { Media(${field}: $id, type: ANIME) { ${ANILIST_MEDIA_FIELDS} } }`;
  const byMalId = await anilistQuery<{ Media: AniListMedia | null }>(
    query("idMal"),
    { id: Number(id) }
  );
  if (byMalId.Media) return byMalId.Media;
  const byId = await anilistQuery<{ Media: AniListMedia | null }>(
    query("id"),
    { id: Number(id) }
  );
  return byId.Media;
};;

const FEATURED_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
];

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const res = await fetch(`${JIKAN}/genres/anime?filter=genres`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      throw new Error(`Jikan API responded with ${res.status}`);
    }
    const { data } = (await res.json()) as { data: JikanGenre[] };
    return FEATURED_GENRES.flatMap((name) => {
      const match = data.find((g) => g.name === name);
      return match ? [{ id: match.mal_id, name: match.name }] : [];
    });
  } catch {
    try {
      const data = await anilistQuery<{ GenreCollection: string[] }>(
        `query { GenreCollection }`,
        {}
      );
      return FEATURED_GENRES.flatMap((name, i) =>
        data.GenreCollection.includes(name) ? [{ id: i, name }] : []
      );
    } catch {
      return [];
    }
  }
};
