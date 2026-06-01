import React, { useState, useEffect } from "react";
import { Inquiry } from "../types";
import { Mail, Phone, Calculator, ClipboardList, Send, CheckCircle2, Truck } from "lucide-react";
import { motion } from "motion/react";
import { getStoredAccessToken, appendRowToSpreadsheet } from "../lib/sheetsService";

interface InquiryFormProps {
  selectedProductName: string;
  onInquirySubmitted: () => void;
}

export default function InquiryForm({
  selectedProductName,
  onInquirySubmitted,
}: InquiryFormProps) {
  const [senderName, setSenderName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync selected product from catalog clicks
  useEffect(() => {
    if (selectedProductName) {
      setProductName(selectedProductName);
    }
  }, [selectedProductName]);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!senderName.trim()) tempErrors.senderName = "기관명 또는 담당자 성함을 호칭과 함께 적어주십시오.";
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) tempErrors.email = "이메일 주소를 입력해 주십시오.";
    else if (!emailPattern.test(email)) tempErrors.email = "올바른 이메일 규격이 아닙니다.";

    const phonePattern = /^[0-9\s-]{9,15}$/;
    if (!phone) tempErrors.phone = "연락처를 적어주십시오.";
    else if (!phonePattern.test(phone.replace(/-/g, ""))) tempErrors.phone = "숫자만 조합한 정확한 전화번호를 기재해 주십시오.";

    if (!productName) tempErrors.productName = "문의하실 수 있는 제품군을 1개 이상 골라주십시오.";
    if (!quantity || Number(quantity) <= 0) tempErrors.quantity = "구입 희망하는 수량(최소 100개 이상)을 기재해 주십시오.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate sending email to manager
    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: "INQ-" + Math.floor(Math.random() * 900000 + 100000),
        senderName,
        email,
        phone,
        productName,
        quantity: Number(quantity),
        message,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Retrieve existing from localStorage
      const existingStr = localStorage.getItem("son_inquiries");
      const existing: Inquiry[] = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(newInquiry);
      localStorage.setItem("son_inquiries", JSON.stringify(existing));

      // Try dynamically uploading to connected Google Sheet
      const token = getStoredAccessToken();
      const spreadsheetId = localStorage.getItem("son_spreadsheet_id");
      if (token && spreadsheetId) {
        appendRowToSpreadsheet(spreadsheetId, token, "문의내역!A1", [
          newInquiry.id,
          newInquiry.senderName,
          newInquiry.email,
          newInquiry.phone,
          newInquiry.productName,
          newInquiry.quantity,
          newInquiry.message || "",
          "대기",
          new Date(newInquiry.createdAt).toLocaleString("ko-KR"),
          ""
        ]).then(() => {
          console.info("Google Sheet Auto-Write Succeeded");
          // Add a small flag that it succeeded in sheets
          newInquiry.notes = "[자동] 구글 스프레드시트 기록완료";
          const updated = [newInquiry, ...existing.slice(1)];
          localStorage.setItem("son_inquiries", JSON.stringify(updated));
        }).catch((err) => {
          console.error("Google Sheet Auto-Write Failed:", err);
        });
      }

      // Reset
      setSenderName("");
      setEmail("");
      setPhone("");
      setProductName("");
      setQuantity("");
      setMessage("");
      setErrors({});
      setIsSubmitting(false);
      setIsSuccess(true);

      // Notify parent
      onInquirySubmitted();

      // Clear success notification after 6 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);
    }, 1500);
  };

  return (
    <section
      id="inquiry"
      className="relative py-24 sm:py-32 bg-white text-black border-b border-[#1F3821]/10"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1F3821]/15 to-transparent" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Brand explanation for inquiry & credentials */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <span className="text-[10px] font-extrabold text-[#FF4D00] bg-[#FF4D00]/10 border border-[#FF4D00]/25 px-2.5 py-1 rounded-none uppercase tracking-widest font-mono">
                MILITARY BULK QUOTATION & DISTRIBUTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-sans font-black text-black mt-4 tracking-tighter uppercase leading-tight">
                단 한 장도 정확한 날짜에, <br />
                <span className="text-[#1F3821] border-b-2 border-[#FF4D00] pb-1">
                  본부 영내 무사 직배송
                </span>
              </h2>
              <div className="w-12 h-[2px] bg-[#1F3821] mt-6" />
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mt-6 font-medium">
                '손일병 핫팩' 생산업체인 <strong>손피싱</strong>은 최적의 단가 및 군인조달 맞춤 혜택을 제공합니다. 행정 서류 및 공정 견적서 발송, 세금 계산서 발행, 관납 결제 예산 등 모든 장병 복지 행정 절차를 원스톱으로 신속히 지원해 드립니다.
              </p>
            </div>

            {/* Quick credentials listed - Sharp corners layout */}
            <div className="bg-[#FAFBF9] border border-[#1F3821]/10 rounded-none p-6 space-y-5 shadow-sm">
              <h3 className="text-xs font-black text-[#1F3821] uppercase tracking-widest font-mono flex items-center mb-1">
                <Calculator className="w-4 h-4 text-[#FF4D00] mr-2" /> 대량 협상 특수 프로필
              </h3>

              <div id="quote-benefit-1" className="flex items-start">
                <Truck className="w-5 h-5 text-[#FF4D00] mr-3 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 leading-normal font-medium">
                  <strong className="text-black font-black">전국 연대/대대급 주둔지 직배송</strong>
                  <br /> 격오지 GP, GOP 초소 및 연대 물류 보관소까지 무너지지 않는 완벽한 특수 방수 패키징 포장 후 완포 발송
                </div>
              </div>

              <div id="quote-benefit-2" className="flex items-start">
                <ClipboardList className="w-5 h-5 text-[#1F3821] mr-3 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 leading-normal font-medium">
                  <strong className="text-black font-black">기관 맞춤 공공 서류 및 관인 대행</strong>
                  <br /> 행정반 제출용 사업자등록증, 국산 확인품 명세서, 납품 영수증 및 카드 결제 원천 대행 대용량 지원
                </div>
              </div>

              <div id="quote-benefit-3" className="flex items-start">
                <Mail className="w-5 h-5 text-[#1F3821] mr-3 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 leading-normal font-medium">
                  <strong className="text-black font-black">실시간 이메일/문자 행정 알림 서비스</strong>
                  <br /> 견적의뢰 제출이 수신된 즉시 손피싱 전담 세일즈 팀원이 매칭되어 최저 단가 회신서를 PDF로 메신저 즉시 전송
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card - Sharp corners */}
          <div className="lg:col-span-7 bg-[#FAFBF9] border border-[#1F3821]/15 rounded-none p-6 sm:p-10 shadow-md relative">
            <h3 className="text-lg sm:text-xl font-black text-left text-[#1F3821] flex items-center mb-6 uppercase tracking-tight">
              <ClipboardList className="w-5 h-5 text-[#FF4D00] mr-2.5" /> 대량 주문 및 견적 폼
            </h3>

            {isSuccess && (
              <div
                id="submission-success-banner"
                className="mb-6 p-4 bg-green-50/10 border border-green-500/35 rounded-none text-left flex items-start gap-3 text-green-700 text-xs sm:text-sm animate-fade-in"
              >
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-[#1F3821] mb-1">문의 양식이 정상 접수되었습니다!</h4>
                  <p className="text-stone-700 text-xs font-semibold">
                    작성하신 핫팩 대량 소요 물량 정보가 <strong>손피싱 공인 조달 수주 관리부서</strong>로 무사히 전송 접수되었습니다. (담당자: ssong8730@gmail.com)
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitInquiry} className="space-y-5 text-left font-sans">
              {/* Sender Organization / Name */}
              <div>
                <label className="block text-[10px] font-black text-[#1F3821]/65 mb-2 uppercase tracking-widest font-mono">
                  기관명 / 직책 / 담당자 성함 <span className="text-[#FF4D00]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="예: ROK 육군 7사단 보급처 김대위 / 아웃도어 동호회 총무"
                    className={`w-full bg-white border ${
                      errors.senderName ? "border-red-500/70" : "border-[#1F3821]/15 focus:border-[#FF4D00]"
                    } rounded-none px-4 py-3 text-sm text-black placeholder-stone-400 focus:outline-none transition-all shadow-inner`}
                  />
                </div>
                {errors.senderName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.senderName}</p>}
              </div>

              {/* Contact Information (Two col on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black text-[#1F3821]/65 mb-2 uppercase tracking-widest flex items-center font-mono">
                    <Mail className="w-3.5 h-3.5 text-[#1F3821]/40 mr-1" /> 이메일 주소 <span className="text-[#FF4D00]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="예: sergeant@military.kr"
                    className={`w-full bg-white border ${
                      errors.email ? "border-red-500/70" : "border-[#1F3821]/15 focus:border-[#FF4D00]"
                    } rounded-none px-4 py-3 text-sm text-black placeholder-stone-400 focus:outline-none transition-all shadow-inner`}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-black text-[#1F3821]/65 mb-2 uppercase tracking-widest flex items-center font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#1F3821]/40 mr-1" /> 비상 연락처 <span className="text-[#FF4D00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className={`w-full bg-white border ${
                      errors.phone ? "border-red-500/70" : "border-[#1F3821]/15 focus:border-[#FF4D00]"
                    } rounded-none px-4 py-3 text-sm text-black placeholder-stone-400 focus:outline-none transition-all shadow-inner`}
                  />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone}</p>}
                </div>
              </div>

              {/* Choice of Product & Quantity (Two col on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Product Name Dropdown */}
                <div>
                  <label className="block text-[10px] font-black text-[#1F3821]/65 mb-2 uppercase tracking-widest font-mono">
                    문의 제품명 <span className="text-[#FF4D00]">*</span>
                  </label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className={`w-full bg-white border ${
                      errors.productName ? "border-red-500/70" : "border-[#1F3821]/15 focus:border-[#FF4D00]"
                    } rounded-none px-4 py-3 text-sm text-black focus:outline-none transition-all shadow-inner`}
                  >
                    <option value="" disabled className="text-stone-400">-- 제품 종류를 선택해 주세요 --</option>
                    <option value="[손난로 핫팩] 180g 대용량핫팩">[손난로 핫팩] 180g 대용량핫팩</option>
                    <option value="[손난로 핫팩] 100g 핫팩">[손난로 핫팩] 100g 핫팩</option>
                    <option value="[손난로 핫팩] 50g 미니핫팩">[손난로 핫팩] 50g 미니핫팩</option>
                    <option value="[손난로 핫팩] 25gx2 미니미니핫팩">[손난로 핫팩] 25gx2 미니미니핫팩</option>
                    <option value="[붙이는 핫팩] 붙이는 어깨핫팩 70g">[붙이는 핫팩] 붙이는 어깨핫팩 70g</option>
                    <option value="[붙이는 핫팩] 파스형 핫팩 50g">[붙이는 핫팩] 파스형 핫팩 50g</option>
                    <option value="[발 핫팩] 남성 깔창핫팩 (270mm-60gx2)">[발 핫팩] 남성 깔창핫팩 (270mm-60gx2)</option>
                    <option value="[발 핫팩] 여성 깔창핫팩 (250mm-40gx2)">[발 핫팩] 여성 깔창핫팩 (250mm-40gx2)</option>
                    <option value="[발 핫팩] 발꼬락핫팩 40g">[발 핫팩] 발꼬락핫팩 40g</option>
                    <option value="[기타] 방석핫팩 400g">[기타] 방석핫팩 400g</option>
                    <option value="[기타] 핫팩 패밀리세트">[기타] 핫팩 패밀리세트</option>
                  </select>
                  {errors.productName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.productName}</p>}
                </div>

                {/* Desired Quantity */}
                <div>
                  <label className="block text-[10px] font-black text-[#1F3821]/65 mb-2 uppercase tracking-widest font-mono">
                    희망 구입량 (최소 100개) <span className="text-[#FF4D00]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="예: 2500"
                      min="100"
                      className={`w-full bg-white border ${
                        errors.quantity ? "border-red-500/70" : "border-[#1F3821]/15 focus:border-[#FF4D00]"
                      } rounded-none px-4 py-3 text-sm text-black placeholder-stone-400 focus:outline-none transition-all shadow-inner`}
                    />
                    <span className="absolute right-4 top-3 text-xs font-bold text-stone-500 font-mono">개</span>
                  </div>
                  {errors.quantity && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.quantity}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-black text-[#1F3821]/65 mb-2 uppercase tracking-widest font-mono font-bold">
                  구체적인 문의 및 요청 내용 (희망 납품일, 긴급 여부 등)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="예: 경기 연천군 ROK 보병연대 주둔지로 대량 수령 희망합니다. 우체국 택배 혹은 화물 트럭 진입이 가능한 군부대 배송 조건을 원하며, 영수증 세금계산서의 전자 선발행 및 선결제 지원 관련해서 검토 부탁드립니다."
                  rows={4}
                  className="w-full bg-white border border-[#1F3821]/15 focus:border-[#FF4D00] rounded-none px-4 py-3 text-sm text-black placeholder-stone-400 focus:outline-none transition-all resize-none shadow-inner"
                />
              </div>

              {/* Submit Trigger Button */}
              <button
                type="submit"
                id="submit-inquiry-btn"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FF4D00] hover:bg-black text-white hover:text-white font-extrabold text-xs uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>세일즈 본부 전송 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>대량 견적서 무료 신청하기</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
        </div>
      </motion.div>
    </section>
  );
}
