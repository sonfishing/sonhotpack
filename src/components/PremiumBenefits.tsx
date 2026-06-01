import React from "react";
import { Gift, Truck, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

export default function PremiumBenefits() {
  return (
    <section id="premium-benefits" className="relative py-20 sm:py-24 bg-white border-b border-[#1F3821]/10 text-black">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F3821]/20 to-transparent" />

      {/* Slide up/Fade in viewport motion container */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Brand Premium Benefits Section (고객 혜택) */}
        <div className="bg-[#FAFBF9] border border-[#1F3821]/15 p-6 sm:p-12 rounded-none text-left relative overflow-hidden shadow-lg animate-fade-in">
          <div className="absolute top-0 left-0 w-[5px] h-full bg-[#FF4D00]" />
          
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#FF4D00] uppercase font-mono bg-[#FF4D00]/10 px-2.5 py-1 border border-[#FF4D00]/20 text-shadow-sm">
                SPECIAL CLIENT ADVANTAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F3821] uppercase tracking-tight mt-3 text-shadow-sm">
                손일병 고객성원 3대 독점 혜택
              </h2>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm font-semibold sm:max-w-xs leading-relaxed text-shadow-sm">
              손피싱은 단순 핫팩 중개를 넘어, 사용자의 확실한 방온 편익과 만족을 보장해드리기 위하여 3가지 공식 혜택 제도를 엄정히 준수 운영합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1: Pouch Offer */}
            <div className="bg-white border border-[#1F3821]/10 p-6 rounded-none flex items-start space-x-4 shadow-sm hover:border-[#FF4D00] transition-all hover:shadow-md">
              <div className="p-3 bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/20 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="font-sans text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-black">핫팩 파우치 증정</h3>
                  <span className="text-[8px] bg-[#1F3821] text-white px-1.5 py-0.5 rounded-none font-bold uppercase font-mono leading-none">Gift Bonus</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed mt-3.5 font-semibold">
                  주머니형 핫팩 <span className="font-black text-[#FF4D00] underline">30매당 전용 방한 파우치 1개</span>를 무상 증정합니다.
                  <span className="block mt-2 text-[10px] text-stone-500 font-bold bg-[#FAFBF9] p-2 border border-stone-200 leading-normal">
                    ※ 단, [손난로 핫팩] 180g 대용량핫팩 50매는 파우치 2매 증정!
                  </span>
                </p>
              </div>
            </div>

            {/* Box 2: Quick Delivery */}
            <div className="bg-white border border-[#1F3821]/10 p-6 rounded-none flex items-start space-x-4 shadow-sm hover:border-[#FF4D00] transition-all hover:shadow-md">
              <div className="p-3 bg-[#1F3821]/10 text-[#1F3821] border border-[#1F3821]/15 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="font-sans text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-black">11시 이전 주문 다음날 도착</h3>
                  <span className="text-[8px] bg-[#1F3821] text-white px-1.5 py-0.5 rounded-none font-bold font-mono uppercase leading-none">Express</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed mt-3.5 font-semibold">
                  오전 11시 이전 결제 확인 인입 건에 한하여, <span className="font-black text-[#1F3821]">다음날 도착 완료</span>를 원칙으로 신속 배송 물류라인이 직접 가동 배정됩니다. (도심지 기준)
                </p>
              </div>
            </div>

            {/* Box 3: Quick Replacement */}
            <div className="bg-white border border-[#1F3821]/10 p-6 rounded-none flex items-start space-x-4 shadow-sm hover:border-[#FF4D00] transition-all hover:shadow-md">
              <div className="p-3 bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/20 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="font-sans text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-black">불량 제품 빠른 교환 제공</h3>
                  <span className="text-[8px] bg-red-50 border border-red-200 text-red-700 px-1.5 py-0.5 rounded-none font-bold leading-none">100% Care</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed mt-3.5 font-semibold">
                  미세한 터짐, 누설 등 불량 발견 시 즉각적이고 유연한 <span className="font-black text-red-600">무상 100% 맞교환</span> 지원 및 안심 환불 처리를 전액 무상 신속 보장해 드립니다.
                </p>
              </div>
            </div>

          </div>
        </div>

      </motion.div>
    </section>
  );
}
