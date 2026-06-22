import React from "react";
import { Flame, Clock, Sparkles, Layers } from "lucide-react";
import { motion } from "motion/react";

export default function ProductSpecs() {
  const specs = [
    {
      title: "최고온 발열 - 70도",
      desc: "180g 대용량 기준 최대 온도 70도, 평균 65도의 폭발적인 고온 발열 성능으로 가혹한 영하 날씨 속에서도 차가워진 체온을 완벽하게 지켜줍니다.",
      icon: Flame,
    },
    {
      title: "20시간 압도적 지속성",
      desc: "180g 대용량 기준 20시간 동안 꺼지지 않는 지속 온기를 유지하여 동계 고지대 철야 작업 및 한랭 근무 교대 시 최적입니다.",
      icon: Clock,
    },
    {
      title: "100% 국산 안심성분",
      desc: "품질 좋은 부직포 원단과 안전한 성분만을 사용하였습니다. 부직포는 터지지 않고 냄새나 피부 트러블 없이 안심하고 사용하실 수 있습니다.",
      icon: Sparkles,
    },
    {
      title: "다양한 제품 라인업",
      desc: "대용량, 실속형, 미니 주머니형은 물론 붙이는 어깨 및 파스형 핫팩, 발가락 전용과 깔창형 및 방석형까지 다양한 현장에 맞춰 선택하실 수 있습니다.",
      icon: Layers,
    },
  ];

  return (
    <section
      id="products"
      className="relative py-20 sm:py-28 bg-[#FF4D00] border-b border-[#FF4D00]/20 text-white"
    >
      {/* Dynamic graphic pattern to add depth to solid orange */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Slide up/Fade in animation with viewport trigger */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-widest text-[#FF4D00] uppercase font-mono bg-white px-3 py-1 border border-white text-shadow-sm">
            PREMIUM THERMAL ENGINEERING
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-white mt-4 tracking-tighter uppercase leading-none text-shadow-lg">
            손일병 핫팩만의 <span className="text-black text-shadow-sm">독보적인 제품 장점</span>
          </h2>
          <div className="w-12 h-[2px] bg-white mx-auto mt-6" />
          <p className="text-white/90 font-sans leading-relaxed text-sm sm:text-base mt-6 font-medium text-shadow-sm">
            최고 등급의 화력 배합 기술과 정교한 마감 검수를 조율해 탄생한 핫팩.
            혹독한 기온 저하 위협에도 확실하게 온난 상태를 지속 공급하겠습니다.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 border border-white/20 p-6 hover:bg-white hover:border-white hover:text-black hover:shadow-2xl transition-all duration-300 rounded-none flex flex-col items-center md:items-start text-center md:text-left group relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/5 rounded-none transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="p-3.5 rounded-none mb-5 border border-white/30 bg-white/10 text-white group-hover:bg-[#FF4D00] group-hover:text-white group-hover:border-[#FF4D00] transition-colors shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-[#1F3821] mb-3 tracking-tight font-sans transition-colors duration-300 text-shadow-md group-hover:text-shadow-none">
                {item.title}
              </h3>
              <p className="text-white/80 group-hover:text-stone-700 text-xs sm:text-sm leading-relaxed font-semibold transition-colors duration-300 text-shadow-sm group-hover:text-shadow-none">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
