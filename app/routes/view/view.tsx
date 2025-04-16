import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getOpenEpisodeNum, getSkip } from "~/utils/seasonUtil";

export default function ViewPage({}) {
  const [searchParams] = useSearchParams();
  const seasonId = searchParams.get("s");
  const episodeId = searchParams.get("e");
  const navigation = useNavigate();

  const baseUrl = "https://comic.maores.com/series/1/";
  const videoUrl = `${baseUrl}s${seasonId}e${episodeId}.mp4`;

  // 获取 video 元素的引用
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function checkVideo() {
      if (
        !Number(seasonId) ||
        !Number(episodeId) ||
        Number(episodeId) < 1 ||
        Number(seasonId) < 1 ||
        Number(episodeId) > 8 ||
        Number(seasonId) > 4
      ) {
        return navigation("/");
      }
      const openEpisodeNum = getOpenEpisodeNum();
      const skip = getSkip(Number(seasonId), Number(episodeId));
      if (skip < openEpisodeNum) {
        return navigation("/");
      }
      console.log(`openEpisodeNum: ${openEpisodeNum}, skip: ${skip}, videoUrl: ${videoUrl}`);
    }
    checkVideo();
  }, [navigation, seasonId, episodeId, videoUrl]);

  return (
    <video ref={videoRef} src={videoUrl} className="w-screen h-screen object-contain" controls playsInline></video>
  );
}
