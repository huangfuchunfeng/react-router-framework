export function getOpenEpisodeNum(initNum?: number) {
  if (initNum) {
    window.localStorage.setItem("open", "" + initNum);
    return initNum;
  }
  return +(window.localStorage.getItem("open") || 1);
}
export function setOpenEpisodeNum(skip: number) {
  window.addMonitor?.("setOpenEpisodeNum", {
    open: skip,
  });
  window.localStorage.setItem("open", "" + skip);
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
