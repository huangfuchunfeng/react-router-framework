import { useState } from "react";
import type { Route } from "./+types/home";
import "./home.css";
import series from "./series.json";
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
  const { season } = series;
  const [activeIndex, setActiveIndex] = useState<number>(1);
  return (
    <div id="wrapper">
      <header className="header-wrapper relative flex flex-col justify-center items-center gap-y-6">
        <img
          src="/header-blur.webp"
          className="blur-3xl block h-full w-full absolute object-cover object-center z-0"
          alt=""
        />
        <img src="/header.webp" className="block max-w-[50%] z-1" alt="" />
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
      <main>
        <h1 className="main-header mt-12 text-3xl">Сериал Содержанки 1 сезон смотреть онлайн</h1>
        <div className="series">
          <h2 className="series-title text-xl mt-4 mb-2">Сезоны и серии</h2>
          <div className="season-tabs flex flex-row gap-x-2">
            {season.map((item, index) => {
              return (
                <div
                  className={`tab  font-bold py-2 px-5 rounded-lg ${
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
              <div key={se.id}>
                <div className="season-content">
                  <div className="season-slider-wrap">
                    {se.episodes.map((episode, index) => {
                      return (
                        <div className="slider" key={`${se.id}-${episode.id}`}>
                          <div className="slider-content">
                            <div className="relative">
                              <img
                                src={`season/${se.id}/${episode.id}.webp`}
                                className="rounded block w-full h-auto"
                                alt=""
                              />
                              <span className="absolute w-full h-full top-0 left-0 bg-black/[0.35]"></span>
                              <span className="absolute text-white right-4 bottom-2 text-sm">{episode.duration}</span>
                              <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                                {/* <img src="/button-play.svg" alt="" /> */}
                                <img src="/lock.svg" alt="" className="w-20" />
                              </div>
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
              </div>
            ) : null;
          })}
        </div>
      </main>
    </div>
  );
}
