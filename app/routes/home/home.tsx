import { Fragment, useEffect, useRef, useState } from "react";

import type { Route } from "./+types/home";
import series from "./series.json";
import { useNavigate, useSearchParams } from "react-router";
import { getOpenEpisodeNum, getSeasonEpisodes, getSkip, setOpenEpisodeNum } from "~/utils/seasonUtil";
import { ImageWithSkeleton } from "~/components/Skeleton";
import DialogComponent from "~/components/DialogComponent";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Содержанки" },
    {
      name: "description",
      content:
        "Большие деньги, жестокие игры и опасные связи… Бурлящая жизнь московской элиты не затихла. Следующая глава развернется уже на берегах Невы: давние знакомые и новые герои соберутся на «Белой вечеринке». За три года изменилось так много: пока одни утоляют свою жажду власти, другие ищут счастье во взаимовыгодном браке.",
    },
  ];
}

export default function Home() {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  console.log("=============>2 Home", searchParams.get("open"), Date.now());

  const [openModel, setOpenModel] = useState(false);
  const { season } = series;
  // 选择剧集
  const [activeIndex, setActiveIndex] = useState<number>(1);
  // 当前能打开的第几集
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(1);
  // 当前能打开的第几季
  const [activeSeasonIndex, setActiveSeasonIndex] = useState<number>(1);
  // 当前播放的第几季第几集
  const [currentPlay, setCurrentPlay] = useState({ s: 1, e: 1 });
  function setCanPlay(play = false, init = false) {
    const openEpisodeNum = getOpenEpisodeNum();
    const { seasonNum, episodeNum } = getSeasonEpisodes(openEpisodeNum);
    setActiveEpisodeIndex(episodeNum);
    setActiveSeasonIndex(seasonNum);
    if (play) {
      setCurrentPlay({ s: seasonNum, e: episodeNum });
    }
    if (init) {
      setActiveIndex(seasonNum);
      setTimeout(() => {
        if (wrapper.current) {
          const scrollPosition = (episodeNum - 1) * 0.5 * document.documentElement.clientWidth;
          wrapper.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
      }, 0);
    }
  }
  function lockVideo(seasonId: number, episodeId: number) {
    const skip = getSkip(seasonId, episodeId);
    const openEpisodeNum = getOpenEpisodeNum();
    if (openEpisodeNum >= skip) {
      playVideo(seasonId, episodeId);
    } else {
      console.log("带锁");
      monitor("lockVideo", {
        season: seasonId,
        episode: episodeId,
      });
      window.WigoalSDK?.playRewardVideo?.();
    }
  }
  function playVideo(seasonId: number, episodeId: number) {
    const skip = getSkip(seasonId, episodeId);
    const openEpisodeNum = getOpenEpisodeNum();
    if (openEpisodeNum >= skip) {
      setCanPlay();
      setCurrentPlay({ s: seasonId, e: episodeId });
      monitor("playVideo", {
        season: seasonId,
        episode: episodeId,
      });
    }
  }
  function monitor(event: string, data = {}) {
    const openEpisodeNum = getOpenEpisodeNum();
    window.addMonitor?.(event, {
      ...data,
      openEpisodeNum,
      time: Date.now(),
    });
  }
  useEffect(() => {
    const searchOpen = searchParams.get("open") || 1;
    setOpenEpisodeNum(Number(searchOpen));
    setCanPlay(true, true);
    monitor("PageView", {
      open: searchOpen,
    });
    window.onRewardVideoResult = (success, message) => {
      if (success) {
        const level = getOpenEpisodeNum() + 1;
        setOpenEpisodeNum(level);
        setCanPlay(true);
        window.WigoalSDK?.onLevelChanged?.("series-1", level);
        monitor("onRewardVideoResult", {
          level,
        });
        // 视频播放成功
      } else {
        setOpenModel(true);
      }
    };
  }, []);
  return (
    <div className="bg-[#14161a] text-[#f2f2f2] min-h-screen  antialiased relative">
      <header className="relative py-2 bg-black">
        <video
          src={`https://comic.maores.com/series/1/s${currentPlay.s}e${currentPlay.e}.mp4`}
          className="w-screen h-[40vh]  object-contain"
          controls
          playsInline
          autoPlay
          poster={`season/${currentPlay.s}/${currentPlay.e}.webp`}
        ></video>
      </header>
      <div className="p-6 ">
        <main>
          <h1 className="mt-5 text-xl">Сериал Содержанки {activeIndex} сезон смотреть онлайн</h1>
          <h2 className="text-xl mt-2 mb-2">Сезоны и серии</h2>
          <div className="flex flex-row gap-x-2">
            {season.map((item, index) => {
              return (
                <div
                  className={`font-bold py-2 px-5 rounded-lg ${
                    activeIndex === item.id ? "text-[#252930] bg-[#f2f2f2]" : "text-[#f2f2f2] bg-[#252930]"
                  } `}
                  key={index}
                  onClick={() => setActiveIndex(item.id)}
                >
                  {activeIndex === item.id ? item.name : item.id}
                </div>
              );
            })}
          </div>
          {season.map((se, index) => {
            return se.id === activeIndex ? (
              <Fragment key={se.id}>
                <div
                  ref={wrapper}
                  className="relative z-2 overflow-x-scroll snap-mandatory  snap-x scroll-smooth py-5 ep-wrapper"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                >
                  <div className="flex flex-row gap-x-3">
                    {se.episodes.map((episode, index) => {
                      return (
                        <div className="snap-start" key={`${se.id}-${episode.id}`}>
                          <div className="flex flex-col gap-y-3 justify-center items-center w-[50vw]">
                            <div className="relative w-full">
                              <ImageWithSkeleton
                                src={`season/${se.id}/${episode.id}.webp`}
                                className="z-0 rounded block w-full h-auto aspect-[333/188] object-cover object-center"
                                alt=""
                              />
                              {/* <img
                              src={`season/${se.id}/${episode.id}.webp`}
                              className="rounded block w-full h-auto aspect-[333/188] object-cover object-center"
                              alt=""
                            /> */}
                              <span className="absolute w-full h-full top-0 left-0 bg-black/[0.35]"></span>
                              <span className="absolute text-white right-4 bottom-2 text-sm">{episode.duration}</span>

                              {activeSeasonIndex > se.id ||
                              (activeSeasonIndex === se.id && activeEpisodeIndex >= episode.id) ? (
                                <div
                                  onClick={() => lockVideo(se.id, episode.id)}
                                  className="absolute w-full h-full top-0 left-0 flex justify-center items-center"
                                >
                                  <img className="w-10 block" src="button-play.svg" alt="" />
                                </div>
                              ) : (
                                <div
                                  onClick={() => lockVideo(se.id, episode.id)}
                                  className="absolute w-full h-full top-0 left-0 flex justify-center items-center"
                                >
                                  <img src="lock.svg" alt="" className="w-10 block" />{" "}
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
                <div className="pl-4">
                  <h2 className="text-2xl">Описание</h2>
                  <div className="pb-10 text-base">{se.description}</div>
                </div>
              </Fragment>
            ) : null;
          })}
        </main>
        <header className="relative flex flex-col justify-center items-center gap-y-6">
          <img
            src="header.webp"
            className="blur-64 block h-full w-full absolute object-cover object-center z-0"
            alt=""
          />
          <ImageWithSkeleton src="header.webp" className="block w-[50%] z-1 aspect-[30/43]" alt="" />
          <div className="z-1 text-center">
            <h1 className="line-clamp-6 text-3xl break-all">Содержанки</h1>
            <div className="p-1">
              <span className="bg-[#1d1f23]  p-1 rounded text-xs">ЭКСКЛЮЗИВ</span>
            </div>
          </div>
          <div className="z-1 flex justify-center items-center flex-row whitespace-nowrap flex-wrap gap-x-2">
            <span>7.9</span>
            <span>•</span>
            <span>2019-2023</span>
            <span>•</span>
            <span>4 сезона</span>
            <span>•</span>
            <span>18+</span>
            <span>•</span>
            <span>Триллер, Драма</span>
            <span>•</span>
            <span>Россия</span>
          </div>
          <article className="flex flex-row justify-between items-center z-1 rounded-lg bg-[#1d1f23] text-center py-5 px-3 gap-x-2">
            <span className="text-4xl text-[#a7a7a7]">&laquo;</span>
            <span className="break-words">
              Миллионы зрителей и неповторимый стиль. Смотрите все серии культового сериала об изнанке светской Москвы
            </span>
            <span className="text-4xl text-[#a7a7a7]">&raquo;</span>
          </article>
        </header>
      </div>
      <DialogComponent open={openModel} setOpen={setOpenModel} />
      {/* <DialogVideoComponent open={true} setOpen={() => {}} /> */}
    </div>
  );
}
