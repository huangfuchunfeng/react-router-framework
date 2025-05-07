import { Fragment, useEffect, useRef, useState } from "react";

import type { Route } from "./+types/home";
import { useSearchParams } from "react-router";
import { ImageWithSkeleton } from "~/components/Skeleton";
import DialogComponent from "~/components/DialogComponent";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  try {
    const res = await fetch(`./series-${params.seriesId}.json`);
    const seriesInfo = await res.json();
    if (!seriesInfo) {
      throw new Response("Not Found", { status: 404 });
    }
    return seriesInfo;
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}
export function meta({ data }: Route.MetaArgs) {
  const { description, title } = data;
  return [
    { title: title },
    {
      name: "description",
      content: description,
    },
  ];
}
type Episode = {
  id: string;
  duration: string;
  name: string;
  poster: string;
  video: string;
  description: string;
  openId: number;
};
type Season = {
  id: string;
  name: string;
  title: string;
  description: string;
  episodes: Episode[];
};
interface SeriesInfo {
  season: Season[];
  cover: string;
  baseUrl: string;
  label: string;
  tags: string[];
  title: string;
  id: number;
}
export default function Home({ loaderData }: { loaderData: SeriesInfo }) {
  const { season, cover, baseUrl, label, tags, title, id } = loaderData;
  const wrapper = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const [currentSeason, setCurrentSeason] = useState(season[0]); // 当前季
  const [currentEpisode, setCurrentEpisode] = useState(season[0].episodes[0]); // 当前集
  const [openId, setOpenId] = useState(season[0].episodes[0].openId); // 当前能打开的 OpenId
  const flatEpisodeMap = season.reduce((acc, cur, seasonIndex) => {
    cur.episodes.forEach((item, episodeIndex) => {
      acc[item.openId] = {
        ...item,
        episodeIndex,
        seasonIndex,
      };
    });
    return acc;
  }, {} as Record<string, Episode & { seasonIndex: number; episodeIndex: number }>);

  const [openModel, setOpenModel] = useState(false); // 弹窗
  function changeSeason(season: Season) {
    setCurrentSeason(season);
    setTimeout(() => {
      if (wrapper.current) {
        let left = 0;
        if (season.episodes.some((item) => item.openId === openId)) {
          left = (flatEpisodeMap[openId].episodeIndex + 1) * 0.5 * document.documentElement.clientWidth;
        }
        wrapper.current.scrollTo({ left, behavior: "smooth" });
      }
    }, 0);
  }
  function lockVideo(episode: Episode) {
    if (episode.openId > openId + 1) {
      console.log("带锁");
      monitor("lockVideo", {
        id: episode.id,
        openId: episode.openId,
      });
    } else {
      console.log("广告");
      monitor("adVideo", {
        id: episode.id,
        openId: episode.openId,
      });
      window.WigoalSDK?.playRewardVideo?.();
    }
  }
  function playVideo(episode: Episode) {
    setCurrentEpisode(flatEpisodeMap[episode.openId]);
    monitor("playVideo", {
      openId: episode.openId,
      id: episode.id,
    });
  }
  function monitor(event: string, data = {}) {
    window.addMonitor?.(event, {
      ...data,
      time: Date.now(),
    });
  }

  useEffect(() => {
    window.onRewardVideoResult = (success, message) => {
      if (success) {
        const level = openId + 1;
        setOpenId(level);
        setCurrentEpisode(flatEpisodeMap[level]);
        setCurrentSeason(season[flatEpisodeMap[level].seasonIndex]);
        window.WigoalSDK?.onLevelChanged?.("series-" + id, level);
        monitor("onRewardVideoResult", {
          level,
        });
      } else {
        setOpenModel(true);
      }
    };
  }, [openId]);
  useEffect(() => {
    const searchOpen = searchParams.get("open") || 1;
    if (!flatEpisodeMap[searchOpen]) {
      throw new Response("Not Found", { status: 404 });
    }
    const flatEpisode = flatEpisodeMap[searchOpen];
    setOpenId(flatEpisode.openId);
    setCurrentSeason(season[flatEpisode.seasonIndex]);
    setCurrentEpisode(flatEpisode);
    setTimeout(() => {
      if (wrapper.current) {
        const scrollPosition = flatEpisode.episodeIndex * 0.5 * document.documentElement.clientWidth;
        wrapper.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    }, 0);
    monitor("PageView", {
      openId: searchOpen,
    });
  }, []);
  return (
    <div className="bg-[#14161a] text-[#f2f2f2] min-h-screen  antialiased relative">
      <header className="relative py-2 bg-black">
        <video
          src={`${baseUrl}/${currentEpisode.video}`}
          className="w-screen h-[40vh]  object-contain"
          controls
          playsInline
          autoPlay
          poster={`${baseUrl}/${currentEpisode.poster}`}
        ></video>
      </header>
      <div className="p-6 ">
        <main>
          <h1 className="mt-5 text-xl">{currentSeason.title}</h1>
          <h2 className="text-xl mt-2 mb-2">{label}</h2>
          <div className="flex flex-row gap-x-2">
            {season.map((item, seasonIndex) => {
              return (
                <div
                  className={`font-bold py-2 px-5 rounded-lg whitespace-nowrap  ${
                    currentSeason.id === item.id ? "text-[#252930] bg-[#f2f2f2]" : "text-[#f2f2f2] bg-[#252930]"
                  } `}
                  onClick={() => changeSeason(item)}
                  key={item.id}
                >
                  {currentSeason.id === item.id ? item.name : seasonIndex + 1}
                </div>
              );
            })}
          </div>

          <div
            ref={wrapper}
            className="relative z-2 overflow-x-scroll snap-mandatory  snap-x scroll-smooth py-5 ep-wrapper"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            <div className="flex flex-row gap-x-3">
              {currentSeason.episodes.map((episode) => {
                return (
                  <div className="snap-start" key={episode.id}>
                    <div className="flex flex-col gap-y-3 justify-center items-center w-[50vw]">
                      <div className="relative w-full">
                        <ImageWithSkeleton
                          src={`${baseUrl}/${episode.poster}`}
                          className="z-0 rounded block w-full h-auto aspect-[333/188] object-cover object-center"
                          alt=""
                        />
                        <span className="absolute w-full h-full top-0 left-0 bg-black/[0.35]"></span>
                        <span className="absolute text-white right-4 bottom-2 text-sm">{episode.duration}</span>

                        {episode.openId <= openId ? (
                          <div
                            onClick={() => playVideo(episode)}
                            className="absolute w-full h-full top-0 left-0 flex justify-center items-center"
                          >
                            <img className="w-10 block" src="button-play.svg" alt="" />
                          </div>
                        ) : (
                          <div
                            onClick={() => lockVideo(episode)}
                            className="absolute w-full h-full top-0 left-0 flex justify-center items-center"
                          >
                            {episode.openId === openId + 1 ? (
                              <img src="ad.svg" alt="" className="w-10 block" />
                            ) : (
                              <img src="lock.svg" alt="" className="w-10 block" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-base">{episode.name}</div>
                      <div className="text-white/[0.6] text-sm">{episode.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {currentSeason.description && (
            <div className="pl-4">
              <h2 className="text-2xl">Описание</h2>
              <div className="pb-10 text-base">{currentSeason.description}</div>
            </div>
          )}
        </main>
        <header className="relative flex flex-col justify-center items-center gap-y-6">
          <img
            src={`${baseUrl + "/" + cover}`}
            className="blur-64 block h-full w-full absolute object-cover object-center z-0"
            alt=""
          />
          <ImageWithSkeleton src={`${baseUrl + "/" + cover}`} className="block w-[50%] z-1 aspect-[30/43]" alt="" />
          <div className="z-1 text-center">
            <h1 className="line-clamp-6 text-3xl break-all"> {title}</h1>
          </div>
          <div className="z-1 flex justify-center items-center flex-row whitespace-nowrap flex-wrap gap-x-2">
            {tags.map((item, tagIndex) => {
              return (
                <Fragment key={item}>
                  <span>{item}</span>
                  {tagIndex === tags.length - 1 ? null : <span>•</span>}
                </Fragment>
              );
            })}
          </div>
        </header>
      </div>
      <DialogComponent open={openModel} setOpen={setOpenModel} />
    </div>
  );
}
