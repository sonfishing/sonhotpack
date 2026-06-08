import React from "react";
import { Factory, ShieldCheck, Truck, Clock } from "lucide-react";
import { motion } from "motion/react";
import { IMAGES } from "../assets";

export default function CompanyAdvantages() {
  const advantages = [
    {
      title: "대량 생산력과 넉넉한 재고 확보",
      sub: "정시 납기 보장",
      desc: "본사 직속의 거대 자동화 설비 라인과 일평균 최대 수십만 장 수준의 생산 역량을 보유하고 있습니다. 항시 넉넉한 예비 재고를 엄격 보유하여, 군부대 혹한기 훈련 등 다급한 긴급 대량 수급 의뢰에도 납기 지연 없이 안전하고 철저한 적시 직배송을 약속합니다.",
      icon: Factory,
      bgImage: IMAGES.m1,
      iconBg: "bg-white/10 text-white border border-white/20",
      borderAccent: "hover:border-[#FF4D00]"
    },
    {
      title: "철저한 품질기준 준수 및 불량 관리",
      sub: "완벽 교환 & 환불 서비스",
      desc: "인체에 완전히 안심할 수 있는 무해 친환경 성분과 최고급 보온재, 부직포를 사용하여 만들었습니다. 혹여라도 발생할 수 있는 극소수 미세 결함에 대비하여 신속하고 유기적인 교환 및 안전 100% 환불 지원 체계를 작동합니다.",
      icon: ShieldCheck,
      bgImage: IMAGES.m2,
      iconBg: "bg-white/10 text-white border border-white/20",
      borderAccent: "hover:border-[#FF4D00]"
    },
    {
      title: "물류창고 직배송 인프라 시스템",
      sub: "유통 비용 제로화 구현",
      desc: "본사 직영으로 물류를 컨트롤 하며 전용 택배사에 인계하여 배송해드립니다. 오후 5시까지의 모든 주문건은 당일 발송 시스템으로 운영하고 있습니다. 신속한 배송을 위해 최선을 다하겠습니다.",
      icon: Truck,
      bgImage: IMAGES.m3,
      iconBg: "bg-white/10 text-white border border-white/20",
      borderAccent: "hover:border-[#FF4D00]"
    },
    {
      title: "밤 11시 조기 결제 완료시 익일 수령",
      sub: "일부 시그니처 베스트셀러 모델 전용",
      desc: "늦은 한파경보, 긴급 교대 점호, 장례 지원 등 촌각을 다투는 겨울철 방한 물품 기동 조달이 절실한 상황에 대응합니다. 베스트 상품 및 일부 모델에 한정해 밤 11시 전 최종 주문이 완료되면, 도심별 중계창고를 통해 다음날 배송처에 도달될 수 있도록 연계 지원합니다.",
      icon: Clock,
      bgImage: IMAGES.m4,
      iconBg: "bg-white/10 text-white border border-white/20",
      borderAccent: "hover:border-[#FF4D00]"
    }
  ];

  return (
    <section id="company-advantages" className="relative py-20 sm:py-28 bg-[#1F3821] text-white overflow-hidden">
      {/* Accent Grid Stripes Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-widest text-[#FF4D00] uppercase font-mono bg-[#FF4D00]/10 px-3 py-1 border border-[#FF4D00]/20 text-shadow-sm">
            SONFISHING LOGISTICS & MANUFACTURE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-white mt-4 tracking-tighter uppercase leading-none text-shadow-md">
            손일병 핫팩의<br /><span className="text-[#FF4D00]">독보적인 물류, 품질 관리 시스템</span>
          </h2>
          <div className="w-12 h-[2px] bg-[#FF4D00] mx-auto mt-6" />
          <p className="text-white/80 font-sans leading-relaxed text-sm sm:text-base mt-6 font-medium text-shadow-sm">
            국내 최고 규격의 제조 공장과 택배회사와 다이렉트 스마트 풀필먼트 물류 거점을 운영하고 있습니다.
          </p>
        </div>

        {/* Major Grid of 4 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {advantages.map((adv, idx) => (
            <div
              key={idx}
              className={`relative border border-white/10 p-8 sm:p-10 rounded-none transition-all duration-300 ${adv.borderAccent} shadow-xl group text-left flex flex-col justify-end overflow-hidden min-h-[320px]`}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0) 45%, rgba(15, 23, 42, 0.98) 90%), url(${adv.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              {/* Scale effect on hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 pointer-events-none -z-10 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${adv.bgImage})`,
                }}
              />
              {/* Additional dark tint layer overlay fading elegantly to 100% transparent from top to middle, and dark solid at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/0 to-[#0F172A]/95 transition-opacity duration-300 -z-10" />

              <div className="space-y-6 relative z-10 pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-none ${adv.iconBg}`}>
                    <adv.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-mono font-black text-white/40 group-hover:text-[#FF4D00] transition-colors text-shadow-sm">
                    0{idx + 1} / ADVANTAGE
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-[#FF4D00] text-white px-1.5 py-0.5 rounded-none uppercase font-mono tracking-wider font-bold">
                      {adv.sub}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-black tracking-tight leading-snug group-hover:text-[#FF4D00] transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                    {adv.title}
                  </h3>
                </div>

                <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-semibold text-shadow-sm col-span-3">
                  {adv.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
