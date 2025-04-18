import { useEffect, useState } from "react";

export function SkeletonBlock({ width = "w-full", height = "h-4" }) {
  return <div className={`bg-gray-300 ${width} ${height} rounded animate-pulse`} />;
}
export function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-4 p-4 border rounded shadow">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
    </div>
  );
}
export function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <div key={idx} className="h-4 bg-gray-300 rounded w-full animate-pulse" />
        ))}
    </div>
  );
}
export function SkeletonAvatar() {
  return <div className="animate-pulse rounded-full bg-gray-300 h-12 w-12" />;
}

interface Props {
  src: string;
  alt?: string;
  className?: string;
}
export function ImageWithSkeleton({ src, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      console.log("✅ 图片已加载");
      setLoaded(true);
    };
  }, [src]);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 骨架图背景 */}
      {!loaded && <div className="absolute inset-0 bg-gray-500 animate-pulse z-0" />}

      {/* 实际图片 */}
      <img src={src} alt={alt} decoding="async" loading="lazy" className="w-full h-full object-cover relative z-2" />
    </div>
  );
}
