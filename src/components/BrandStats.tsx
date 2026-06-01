import React, { useState, useEffect, useRef } from "react";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

// Beautiful custom Animated counter component with 3s ease-out animation
function AnimatedCounter({ end, duration = 3000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease-out cubic: f(t) = 1 - (1-t)^3
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            setCount(Math.floor(easeProgress * end));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

export default function BrandStats() {
  return (
    <section
      id="brand"
      className="relative py-20 sm:py-28 bg-white border-b border-[#1F3821]/10 text-black overflow-hidden"
    >
      {/* Decorative background gradients for premium editorial look */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F3821]/20 to-transparent" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#1F3821]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#FF4D00]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Slide-Up / Fade-In section wrapper using motion */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-widest text-[#FF4D00] uppercase font-mono bg-[#FF4D00]/10 px-3 py-1 border border-[#FF4D00]/20 text-shadow-sm">
            VERIFIED CUSTOMER TRUST INDEX
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-black mt-4 tracking-tighter uppercase leading-none text-shadow-sm">
            실제 구매자가 입증한 <span className="text-[#1F3821]">생생하고 정직한 평점 통계</span>
          </h2>
          <div className="w-12 h-[2px] bg-[#1F3821] mx-auto mt-6" />
          <p className="text-[#1F3821]/80 font-sans leading-relaxed text-sm sm:text-base mt-6 font-medium text-shadow-sm">
            가혹한 동계 영하 날씨를 완벽하게 버텨내며 실구매자가 작성해주신 압도적인 실제 상품후기와 평점입니다.
            품질의 수준차를 숫자로 완벽히 증명합니다.
          </p>
        </div>

        {/* Coupang & Smart Store Dual Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Box 1: Coupang (Red background, transparent icon watermark) */}
          <div className="bg-[#E52528] text-white p-6 sm:p-10 rounded-none border border-white/20 relative overflow-hidden shadow-xl flex flex-col justify-between group hover:border-white hover:scale-[1.02] transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-full bg-white/5 transform skew-x-12 pointer-events-none" />
            
            {/* Highly transparent icon watermark as requested */}
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
              <Star className="w-48 h-48 text-white" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-white uppercase font-mono bg-black/30 border border-white/20 px-2.5 py-1 text-shadow-sm">
                  COUPANG AUDITED
                </span>
                <span className="text-xs text-white/70 font-mono font-bold text-shadow-sm">17,000+ Reviews</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight text-shadow-md">
                쿠팡 공식 실구매 상품평가
              </h3>
              
              <p className="text-white/95 text-xs sm:text-sm leading-relaxed font-semibold text-shadow-sm">
                쿠팡 공식 실구매 가입자들이 직접 작성한 무려 <span className="font-black text-yellow-300 underline decoration-wavy decoration-yellow-300 text-shadow-sm">17,000건의 생생한 상품 평가</span> 중, 가혹한 동계 영하 날씨 속에서 손일병 핫팩을 착용하고 극찬을 아끼지 않은 비율이 담겨있습니다.
              </p>

              <div className="pt-6 border-t border-white/20 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[8px] font-bold text-white/60 uppercase tracking-widest leading-none font-mono text-shadow-sm">누적 리뷰량</span>
                  <span className="text-xs sm:text-sm font-black text-white mt-1.5 block text-shadow-sm">리뷰 누적 총 17,000건 돌파</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] font-bold text-white/60 uppercase tracking-widest leading-none font-mono text-shadow-sm">구매자의 평가 회신</span>
                  <span className="text-xl sm:text-2xl font-mono font-black text-yellow-300 mt-1.5 block text-shadow-md">구매자의 96%가 "최고/좋음"</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Smart Store (Green background, transparent icon watermark) */}
          <div className="bg-[#03C75A] text-white p-6 sm:p-10 rounded-none border border-white/20 relative overflow-hidden shadow-xl flex flex-col justify-between group hover:border-white hover:scale-[1.02] transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-full bg-white/5 transform skew-x-12 pointer-events-none" />
            
            {/* Highly transparent icon watermark as requested */}
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
              <MessageSquare className="w-48 h-48 text-white" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-white uppercase font-mono bg-black/30 border border-white/20 px-2.5 py-1 text-shadow-sm">
                  NAVER SMART STORE OFFICIAL
                </span>
                <span className="text-xs text-white/70 font-mono font-bold text-shadow-sm">67,000+ Reviews</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight text-shadow-md">
                스마트스토어 압도적 평판 지표
              </h3>
              
              <p className="text-white/95 text-xs sm:text-sm leading-relaxed font-semibold text-shadow-sm">
                네이버 스마트스토어에서 한파 대비 자위 구매가들이 성원해주신 <span className="font-black text-yellow-300 underline decoration-wavy decoration-yellow-300 text-shadow-sm">67,000건의 경이로운 자체 리뷰 누적 수량</span>입니다. 실구매자의 높은 평점이 제품 품질 경쟁력을 직배 입증합니다.
              </p>

              <div className="pt-6 border-t border-white/20 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[8px] font-bold text-white/60 uppercase tracking-widest leading-none font-mono text-shadow-sm">누적 리뷰량</span>
                  <span className="text-xs sm:text-sm font-black text-white mt-1.5 block text-shadow-sm">리뷰 누적 총 67,000건 돌파</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] font-bold text-white/60 uppercase tracking-widest leading-none font-mono text-shadow-sm">구매자의 평점 만족도</span>
                  <span className="text-xl sm:text-2xl font-mono font-black text-yellow-300 mt-1.5 block text-shadow-md">97%가 4점 이상 고평가</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Milestone Indicator Box: 10,000,000장 돌파 with 5s Ease-Out counting up */}
        <div className="bg-[#FAFBF9] border border-[#1F3821]/15 p-8 sm:p-10 rounded-none flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="p-5 bg-[#1F3821] text-white border border-[#1F3821]/10 rounded-none shrink-0 font-extrabold text-3xl font-mono text-shadow-sm shadow-md">
              10M+
            </div>
            <div className="font-sans">
              <h4 className="text-base sm:text-lg font-black text-black text-shadow-sm leading-tight">
                연간 1,000만 장 이상 판매되는 검증된 손일병 핫팩
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed font-semibold">
                정부, 관공서는 물론 군부대 보급본부, 대형 산업 건설 현장, 각종 동호회나 소대 훈련, 정기 모임까지 안정적인 방한 성능을 인정받아 지속적으로 대량 조달 납품되고 있습니다.
              </p>
            </div>
          </div>
          
          <div className="text-center md:text-right shrink-0 bg-[#FF4D00] text-white px-8 py-6 border border-[#FF4D00]/20 w-full md:w-auto shadow-md">
            <p className="text-[10px] font-black text-white/80 uppercase tracking-widest font-mono leading-none text-shadow-sm">ANNUAL SALES VOLUME</p>
            <p className="text-3xl sm:text-4xl font-mono font-black text-white mt-3 block text-shadow-md tracking-tight">
              <AnimatedCounter end={10000000} duration={3000} /> 장 돌파
            </p>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
