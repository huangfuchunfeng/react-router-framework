export function getOpenEpisodeNum() {
  return +(window.localStorage.getItem("open") || 0);
}
export function getSeasonEpisodes(skip: number) {
  const size = 8;
  const page = Math.ceil(skip / size);
  const take = skip - (page - 1) * size;
  return { seasonNum: page, episodeNum: take };
}
export function getSkip(seasonId: number, episodeId: number) {
  return (seasonId - 1) * 8 + episodeId;
}
