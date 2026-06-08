import React, { useState, useEffect, useRef } from "react";
import { IMAGES } from "../assets";
import { Flame, Star, Compass, ArrowDownCircle, Shield, ChevronLeft, ChevronRight } from "lucide-react";

interface ParallaxHeroProps {
  onExploreClick: () => void;
}

export default function ParallaxHero({ onExploreClick }: ParallaxHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windRef = useRef<number>(0);
  const isHovering = useRef(false);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Falling Snow Canvas Effect with slide transition wind drift
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numFlakes = 100;
    const flakes = Array.from({ length: numFlakes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1,
      d: Math.random() * numFlakes,
      speed: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      for (let i = 0; i < numFlakes; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);

        // Update positions - add horizontal wind drift
        f.y += f.speed;
        f.x += Math.sin(f.d) * 0.5 + windRef.current;

        // Wrap around horizontally if wind pushes flakes offscreen
        if (f.x < -10) {
          f.x = width + 10;
        } else if (f.x > width + 10) {
          f.x = -10;
        }

        if (f.y > height) {
          flakes[i] = {
            x: Math.random() * width,
            y: 0,
            r: f.r,
            d: f.d,
            speed: f.speed,
          };
        }
      }
      ctx.fill();

      // Smooth decay of horizontal wind force over frames
      if (Math.abs(windRef.current) > 0.05) {
        windRef.current *= 0.96;
      } else {
        windRef.current = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const slides = [
    {
      badge: "ACTIVE WARMTH FOR EXTREME COLD",
      title: "혹한기 영하 20℃를 녹이는",
      titleAccent: "손일병 핫팩!",
      bgUrl: IMAGES.banner1,
      desc: (
        <>
          평균 온도 <span className="font-extrabold text-[#FF4D00]">65℃</span>, 최대 최고 온도{" "}
          <span className="font-extrabold text-[#FF4D00]">70℃</span>!
          <br />20시간 이상 꺼지지 않는 압도적인 지속 온기로
          <br />대한민국 국군 장병의 혹한기 작전을 수호합니다.
        </>
      ),
      btn1Text: "상세 특장점 확인하기",
      btn1Action: onExploreClick,
      btn2Text: "대량 주문 / 견적 문의",
      btn2Action: () => {
        const el = document.getElementById("inquiry");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      badge: "SPECIAL GIFT BONUSES",
      title: "손난로형 핫팩 구매자 전원",
      titleAccent: "핫팩 전용 파우치 증정!",
      bgUrl: IMAGES.banner2,
      desc: (
        <>
          주머니형 핫팩 30매당 전용 방한 파우치
          <br />1매 무상지급해 드립니다.
        </>
      ),
      btn1Text: "파우치 증정 혜택 보기",
      btn1Action: () => {
        const el = document.getElementById("premium-benefits");
        el?.scrollIntoView({ behavior: "smooth" });
      },
      btn2Text: "특별 주문 문의하기",
      btn2Action: () => {
        const el = document.getElementById("inquiry");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      badge: "PLATFORM DISCOUNT ACCESS",
      title: "손일병 핫팩 공식 온라인",
      titleAccent: "고객 특별 할인가 제공!",
      bgUrl: IMAGES.banner3,
      desc: (
        <>
          소량부터 군부대 단체용 벌크 단위까지, 
          <br />검증된 정품 라인업을 온라인 공식 할인 혜택가로 공급합니다.
          <br />아래 카탈로그 링크로 접속하시면 할인가격으로 구매가능합니다.
        </>
      ),
      btn1Text: "구매하기 (카탈로그로 이동)",
      btn1Action: () => {
        const el = document.getElementById("catalog");
        el?.scrollIntoView({ behavior: "smooth" });
      },
      btn2Text: "간편 대량견적 접수",
      btn2Action: () => {
        const el = document.getElementById("inquiry");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  ];

  const triggerWindDrift = (direction: "left" | "right") => {
    windRef.current = direction === "left" ? -15 : 15;
  };

  // Auto transition slides (paused on hover)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isHovering.current) return;
      triggerWindDrift("left");
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    triggerWindDrift("right");
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    triggerWindDrift("left");
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Soft limit values to avoid excessive displacement in preview
  const bgTransform = Math.min(scrollY * 0.45, 300);
  const textTransform = Math.min(scrollY * 0.15, 120);

  return (
    <div
      ref={containerRef}
      id="parallax-container"
      className="relative w-full h-[100vh] bg-white overflow-hidden flex flex-col justify-between"
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; }}
    >
      {/* 1. Snowflakes Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* 2. Parallax Sky & Mountain Background Layer */}
      <div
        id="bg-sky-layer"
        className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center select-none pointer-events-none transition-all duration-500 ease-out"
        style={{
          transform: `translate3d(0, ${bgTransform}px, 0)`,
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.95) 90%), url(${slides[currentSlide].bgUrl})`,
        }}
      />

      {/* 3. (removed) */}

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 bg-white/80 hover:bg-black hover:text-white border border-[#1F3821]/20 text-black rounded-none cursor-pointer group transition-all hidden sm:flex items-center justify-center shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNextSlide}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 bg-white/80 hover:bg-black hover:text-white border border-[#1F3821]/20 text-black rounded-none cursor-pointer group transition-all hidden sm:flex items-center justify-center shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* 4. Center Typography Content (Floating parallax, dynamic slides based on key) */}
      <div
        id="parallax-hero-content"
        key={currentSlide}
        className="relative z-30 flex-grow flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-28 pb-8 transition-all duration-500 animate-fade-in"
        style={{
          transform: `translate3d(0, ${textTransform}px, 0)`,
          opacity: Math.max(1 - scrollY / 400, 0),
        }}
      >
        <span className="inline-block px-3 py-1 bg-[#1F3821] text-white font-extrabold text-[10px] uppercase tracking-widest mb-6 font-mono rounded-none">
          {slides[currentSlide].badge}
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter text-black leading-[1.05] sm:leading-[0.95] mb-6 select-none uppercase text-shadow-md">
          {slides[currentSlide].title}
          <span className="block mt-3 text-[#FF4D00] font-extrabold pb-1 drop-shadow-md text-shadow-brand">
            {slides[currentSlide].titleAccent}
          </span>
        </h1>

        <div className="text-sm sm:text-base md:text-lg text-black/85 font-sans tracking-tight leading-relaxed max-w-2xl mb-10 font-semibold min-h-[3.5rem] sm:min-h-auto text-shadow-sm">
          {slides[currentSlide].desc}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={slides[currentSlide].btn1Action}
            className="px-8 py-4 bg-[#FF4D00] text-white hover:bg-black font-extrabold tracking-widest text-xs uppercase transition-all rounded-none shadow-lg cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span>{slides[currentSlide].btn1Text}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Horizontal Slider Dots/Carousels Bottom Navigation */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx > currentSlide) {
                triggerWindDrift("left");
              } else if (idx < currentSlide) {
                triggerWindDrift("right");
              }
              setCurrentSlide(idx);
            }}
            className={`h-2 transition-all duration-300 rounded-none cursor-pointer ${
              currentSlide === idx ? "w-8 bg-[#FF4D00]" : "w-2 bg-stone-300 hover:bg-stone-500"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* 5. Bottom Parallax Cutout Overlay (Foreground) */}
      <div
        id="hero-scroll-indicator"
        className="relative z-30 pb-8 text-center text-black/40 flex flex-col items-center select-none pointer-events-none"
        style={{ opacity: Math.max(1 - scrollY / 250, 0) }}
      >
        <span className="text-[9px] font-mono tracking-widest text-[#FF4D00] font-bold uppercase mb-2">
          SCROLL DOWN FOR DETAILED SPECIFICATIONS
        </span>
        <ArrowDownCircle className="w-5 h-5 text-[#FF4D00] animate-bounce" />
      </div>

      {/* Warm bottom overlay gradient to fade hero section smoothly into Brand Intro */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
    </div>
  );
}
