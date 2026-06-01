import React from "react";
import { IMAGES } from "../assets";
import { Product } from "../types";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface ProductCatalogProps {
  onSelectProductForInquiry: (productName: string) => void;
}

export default function ProductCatalog({ onSelectProductForInquiry }: ProductCatalogProps) {
  const products: Product[] = [
    {
      id: "product-1",
      sku: "SON-HD-180",
      name: "[손난로 핫팩] 180g 대용량핫팩",
      duration: "24시간 내외",
      maxTemp: "70℃",
      avgTemp: "60℃",
      sizeWeight: "180g / 13 x 15 cm",
      description: "압도적인 용량과 두툼한 두께로 영하 20도 혹한에서도 24시간 동안 지속되는 최고의 손난로입니다.",
      tags: ["손난로 핫팩", "대용량", "주머니형"],
      features: ["국산 고밀도 철분 포뮬러", "24시간 지속 고밀도 단열", "내구성 우수 특수 부직포"],
      imageUrl: IMAGES.productPack,
    },
    {
      id: "product-2",
      sku: "SON-HD-100",
      name: "[손난로 핫팩] 100g 핫팩",
      duration: "15시간 내외",
      maxTemp: "68℃",
      avgTemp: "58℃",
      sizeWeight: "100g / 10 x 12 cm",
      description: "가장 대중적이고 실용적인 규격으로 손안에 쏙 들어와 주머니 및 군 보관 장비에 최적인 손난로입니다.",
      tags: ["손난로 핫팩", "표준형", "실속 만점"],
      features: ["언택트 미리기공 특수필터", "15시간 정위 시간 발열", "언제 어디서나 안심 소재"],
      imageUrl: IMAGES.soldierMascot,
    },
    {
      id: "product-3",
      sku: "SON-HD-50",
      name: "[손난로 핫팩] 50g 미니핫팩",
      duration: "10시간 내외",
      maxTemp: "65℃",
      avgTemp: "55℃",
      sizeWeight: "50g / 8 x 9 cm",
      description: "가볍고 귀여운 미니 크기로 점퍼 주머니나 학생 및 여군 전투복 소매 속에도 간편 보관이 가능한 핫팩입니다.",
      tags: ["손난로 핫팩", "미니형", "포켓 콤팩트"],
      features: ["작지만 조밀한 순간 화력", "고탄력 소프트 부직포 공법", "수출 규격 적합성 증명"],
      imageUrl: IMAGES.productPack,
    },
    {
      id: "product-4",
      sku: "SON-HD-25",
      name: "[손난로 핫팩] 25gx2 미니미니핫팩",
      duration: "8시간 내외",
      maxTemp: "63℃",
      avgTemp: "53℃",
      sizeWeight: "25g x 2개 / 6 x 7 cm",
      description: "양손 주머니에 하나씩 쏙 넣어 균형 있게 손을 보온하도록 특수 고안된 초소형 쌍둥이 손난로입니다.",
      tags: ["손난로 핫팩", "초미니", "양손형 듀얼"],
      features: ["2개 한 세트 구성 패키지", "장갑 및 소매 포켓 특화", "무독성 고정밀 원료 합성"],
      imageUrl: IMAGES.campfire,
    },
    {
      id: "product-5",
      sku: "SON-FIT-70",
      name: "[붙이는 핫팩] 붙이는 어깨핫팩 70g",
      duration: "12시간 내외",
      maxTemp: "60℃",
      avgTemp: "50℃",
      sizeWeight: "70g / 10 x 13 cm",
      description: "어깨와 목덜미 굴곡진 부위에 알맞게 고밀착 부양하여 온종일 피로와 뻐근함을 풀어주는 부착형 보온재입니다.",
      tags: ["붙이는 핫팩", "어깨 릴렉스", "인체공학 설계"],
      features: ["피부 저자극 특수 수성 접착제", "온열 이완 스펙 설계", "흘러내림 없는 신축 필름"],
      imageUrl: IMAGES.campfire,
    },
    {
      id: "product-6",
      sku: "SON-FIT-50",
      name: "[붙이는 핫팩] 파스형 핫팩 50g",
      duration: "12시간 내외",
      maxTemp: "63℃",
      avgTemp: "52℃",
      sizeWeight: "50g / 9 x 12 cm",
      description: "등, 허리, 가슴 등 의류 내의 안쪽에 깔끔하게 고정하여 하루 내내 균일한 코어 온도를 수호하는 전통적 파스형 핫팩입니다.",
      tags: ["붙이는 핫팩", "파스형", "내의 밀착식"],
      features: ["에어 스루 통기 전용 막", "의류 훼손 없는 소프트 접착력", "인체 온도 최적화 정온 유지"],
      imageUrl: IMAGES.soldierMascot,
    },
    {
      id: "product-7",
      sku: "SON-SOLE-270",
      name: "[발 핫팩] 남성 깔창핫팩 (270mm-60gx2)",
      duration: "10시간 내외",
      maxTemp: "55℃",
      avgTemp: "45℃",
      sizeWeight: "60g x 2개 / 270mm",
      description: "군화 및 등산화 전체 깔창 크기로 제작되어 발뒤꿈치부터 가락 끝까지 폭넓고 은은하게 보온을 지켜주는 정식 남성용 깔창핫팩입니다.",
      tags: ["발 핫팩", "깔창핫팩", "남성용 270mm"],
      features: ["신발 바닥 완벽 장착 가능", "발바닥 굴곡 흡수 엠보싱", "압력 저항형 균일 발열 기술"],
      imageUrl: IMAGES.warehouse,
    },
    {
      id: "product-8",
      sku: "SON-SOLE-250",
      name: "[발/다리] 여성 깔창핫팩 (250mm-40gx2)",
      duration: "10시간 내외",
      maxTemp: "55℃",
      avgTemp: "45℃",
      sizeWeight: "40g x 2개 / 250mm",
      description: "단화, 부츠, 소형 신발에 부드럽게 안착되어 동상을 원천 예방하고 온기를 순환시키는 여성용 규격 깔창형 핫팩입니다.",
      tags: ["발 핫팩", "깔창핫팩", "여성용 250mm"],
      features: ["슬림라인 입체 재단 가습", "신발 내 습기 배출 특수 가공", "저온 화상 예방 안심 발열 곡선"],
      imageUrl: IMAGES.warehouse,
    },
    {
      id: "product-9",
      sku: "SON-SOLE-TOE",
      name: "[발 핫팩] 발꼬락핫팩 40g",
      duration: "8시간 내외",
      maxTemp: "58℃",
      avgTemp: "48℃",
      sizeWeight: "40g / 8 x 10 cm",
      description: "가장 취약하고 쉽게 어는 양말 앞코(발가락 부분)에 집중적으로 밀착 부착하도록 콤팩트하게 형상화된 스티커 핫팩입니다.",
      tags: ["발 핫팩", "발가락 전용", "스티커형 패치"],
      features: ["우수한 자가 점착 필름 기술", "양말 앞면에 착 감기는 아치 쉐입", "장시간 야외 순찰 맞춤 설계"],
      imageUrl: IMAGES.productPack,
    },
    {
      id: "product-10",
      sku: "SON-ETC-400",
      name: "[기타] 방석핫팩 400g",
      duration: "18시간 내외",
      maxTemp: "65℃",
      avgTemp: "55℃",
      sizeWeight: "400g / 30 x 30 cm",
      description: "초대형 방석 크기로 설계되어 혹한기 초소 감시 활동, 낚시, 아웃도어 의자에 깔고 앉아 엉덩이와 전신으로 타고 오르는 열기를 체감하십시오.",
      tags: ["기타", "방석형", "초대형 400g"],
      features: ["내부 공기 순환 및 고탄력 쿠션감", "터짐 방지 전술 직조 코팅 부직포", "강력하고 풍성한 전신 보온"],
      imageUrl: IMAGES.warehouse,
    },
    {
      id: "product-11",
      sku: "SON-ETC-SET",
      name: "[기타] 핫팩 패밀리세트",
      duration: "종합 패키지",
      maxTemp: "다양함",
      avgTemp: "다양함",
      sizeWeight: "구성 상일",
      description: "대용량, 미니, 붙이는 패치, 발 핫팩까지 온가족과 전 동료장병이 함께 사용하도록 최적으로 수량을 분배한 프리미엄 종합 혼합 세트입니다.",
      tags: ["기타", "패밀리 세트", "종합 모듬"],
      features: ["손난로, 깔창, 붙이는 패키지 올인원", "보관과 관리가 우수한 전용 방수백 구성", "대량 구매 단가 극소화 세트"],
      imageUrl: IMAGES.soldierMascot,
    },
  ];

  const handleInquiryRedirect = (productName: string) => {
    onSelectProductForInquiry(productName);
    const formEl = document.getElementById("inquiry");
    formEl?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="catalog" className="relative py-20 sm:py-28 bg-white text-black">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F3821]/20 to-transparent" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Separator Heading */}
        <div className="mb-12 text-left flex items-center justify-between border-b border-[#1F3821]/20 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1F3821] uppercase tracking-tight">
              손일병 정품 전제품 카탈로그
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 font-medium">대량 관납 조달 및 도소매 견적 즉시 상담 가능</p>
          </div>
          <span className="text-[10px] font-mono font-black bg-[#1F3821] text-white px-3 py-1.5 border border-[#1F3821]/20 rounded-none uppercase tracking-wider hidden sm:inline-block">
            TOTAL {products.length} PRODUCTS CERTIFIED
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-[#FAFCFA]/60 hover:bg-[#F6FAF6] border border-[#1F3821]/15 hover:border-[#FF4D00]/50 rounded-none overflow-hidden shadow-md transition-all duration-300 flex flex-col sm:flex-row group"
            >
              {/* Product Thumbnail Box */}
              <div className="sm:w-5/12 aspect-[4/3] sm:aspect-auto relative bg-white border-b sm:border-b-0 sm:border-r border-[#1F3821]/10 overflow-hidden select-none shrink-0">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-102 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
                
                {/* Product SKU Label */}
                <div className="absolute top-3 left-3 bg-[#1F3821] border border-[#1F3821]/20 px-2 py-0.5 rounded-none text-[8px] font-mono text-white font-black uppercase tracking-wider">
                  {p.sku}
                </div>
              </div>

              {/* Product Info Description Side */}
              <div className="p-6 sm:p-7 flex flex-col justify-between text-left flex-grow">
                <div>
                  {/* Category badging */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {p.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-black bg-[#1F3821]/10 text-[#1F3821] px-2 py-0.5 rounded-none tracking-tight border border-[#1F3821]/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-black text-black group-hover:text-[#FF4D00] transition-colors leading-snug mb-3">
                    {p.name}
                  </h4>

                  {/* High Quality Specification HUD with sharp geometric rows */}
                  <div className="grid grid-cols-3 gap-2 bg-white border border-[#1F3821]/10 p-2 rounded-none mb-4 text-center font-sans shadow-sm">
                    <div>
                      <span className="block text-[8px] font-black text-[#1F3821]/50 uppercase leading-none font-mono">지속 시간</span>
                      <span className="block text-xs font-black text-[#1F3821] mt-1">{p.duration.split(" ")[0]}</span>
                    </div>
                    <div className="border-x border-[#1F3821]/10">
                      <span className="block text-[8px] font-black text-[#1F3821]/50 uppercase leading-none font-mono">최고 온도</span>
                      <span className="block text-xs font-extrabold text-[#FF4D00] mt-1">{p.maxTemp}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-[#1F3821]/50 uppercase leading-none font-mono">용량 규격</span>
                      <span className="block text-xs font-black text-[#1F3821] mt-1">{p.sizeWeight.split(" / ")[0]}</span>
                    </div>
                  </div>

                  {/* Paragraph */}
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
                    {p.description}
                  </p>

                  {/* Small Bullet Specs */}
                  <ul className="space-y-1 mb-5 font-sans">
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx} className="text-xs text-stone-800 flex items-center gap-1.5 font-semibold">
                        <span className="w-1 h-1 bg-[#FF4D00] rounded-none shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Action Button to request inquiry */}
                <button
                  onClick={() => handleInquiryRedirect(p.name)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1F3821] hover:bg-[#FF4D00] hover:text-black border border-transparent text-white text-xs font-bold uppercase tracking-widest rounded-none transition-all cursor-pointer"
                >
                  <span>제품 구매하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
