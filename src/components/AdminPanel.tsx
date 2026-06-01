import React, { useState, useEffect } from "react";
import { Inquiry } from "../types";
import { X, ClipboardCheck, Trash2, Database, ShieldCheck, Mail, Phone } from "lucide-react";
import {
  googleSignInForSheets,
  getStoredAccessToken,
  createInquirySpreadsheet,
  appendRowToSpreadsheet,
  logoutGoogleSheets,
  fetchUserInfo
} from "../lib/sheetsService";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onInquiryChange: () => void;
}

export default function AdminPanel({ isOpen, onClose, onInquiryChange }: AdminPanelProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [confirmClearActive, setConfirmClearActive] = useState<boolean>(false);

  // Google Sheets connected states
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [isSheetsOperating, setIsSheetsOperating] = useState<boolean>(false);

  const loadInquiries = () => {
    try {
      const existingStr = localStorage.getItem("son_inquiries");
      if (existingStr) {
        setInquiries(JSON.parse(existingStr));
      } else {
        setInquiries([]);
      }
    } catch (e) {
      console.error("Local storage lookup/parse triggered an error", e);
      setInquiries([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadInquiries();
      setConfirmClearActive(false);

      // Load Google Sheets login status on load
      const token = getStoredAccessToken();
      setGoogleAccessToken(token);
      setGoogleUser(fetchUserInfo());
      setSpreadsheetId(localStorage.getItem("son_spreadsheet_id"));
    }
  }, [isOpen]);

  const handleSheetsConnect = async () => {
    setIsSheetsOperating(true);
    try {
      const token = await googleSignInForSheets();
      if (token) {
        setGoogleAccessToken(token);
        setGoogleUser(fetchUserInfo());
        setSpreadsheetId(localStorage.getItem("son_spreadsheet_id"));
        triggerFeedback("구글 계정과 상담 접수 시스템이 성공적으로 연결되었습니다!");
      }
    } catch (err: any) {
      console.error("Sheets connection detail error:", err);
      let errMsg = "연결 오류가 발생했습니다.";
      if (err.code === "auth/operation-not-allowed") {
        errMsg = "구글 로그인 미활성화: Firebase Console -> Authentication에서 Google 로그인을 먼저 '사용 설정(Enabled)'해 주셔야 합니다.";
      } else if (err.code === "auth/unauthorized-domain") {
        errMsg = "도메인 미등록: Firebase Console -> Authentication -> 승인된 도메인(Authorized domains)에 이 앱의 웹 주소를 추가해 주셔야 합니다.";
      } else if (err.code === "auth/popup-blocked") {
        errMsg = "팝업 차단됨: 브라우저 팝업 허용 설정을 켜고 다시 연동을 시도해주세요.";
      } else if (err.message && (err.message.includes("popup") || err.message.includes("closed"))) {
        errMsg = "팝업창이 차단되었거나 도중에 닫혔습니다. 로그인 창을 유지해 주세요.";
      } else {
        errMsg = `연결 실패: ${err.message || err}`;
      }
      triggerFeedback(errMsg);
    } finally {
      setIsSheetsOperating(false);
    }
  };

  const handleSheetsCreate = async () => {
    const token = googleAccessToken || getStoredAccessToken();
    if (!token) {
      triggerFeedback("구글 계정 연동을 먼저 수행해 주십시오.");
      return;
    }
    setIsSheetsOperating(true);
    try {
      const newSheetId = await createInquirySpreadsheet(token);
      setSpreadsheetId(newSheetId);
      triggerFeedback("새로운 구글 스프레드시트가 원본 생성 연동되었습니다!");
    } catch (err: any) {
      triggerFeedback(`스프레드시트 생성 오류: ${err.message || err}`);
    } finally {
      setIsSheetsOperating(false);
    }
  };

  const handleSheetsDisconnect = () => {
    logoutGoogleSheets();
    setGoogleAccessToken(null);
    setGoogleUser(null);
    setSpreadsheetId(null);
    triggerFeedback("구글 스프레드시트 연동이 해제되었습니다.");
  };

  const handleSheetsFullSync = async () => {
    const token = googleAccessToken || getStoredAccessToken();
    if (!token || !spreadsheetId) {
      triggerFeedback("구글 스프레드시트가 연동되어 있지 않습니다.");
      return;
    }
    if (inquiries.length === 0) {
      triggerFeedback("동기화할 상담 내역이 존재하지 않습니다.");
      return;
    }

    setIsSheetsOperating(true);
    let successCount = 0;
    try {
      for (const inq of inquiries) {
        let textStatus = "대기";
        if (inq.status === "reviewing") textStatus = "검토중";
        else if (inq.status === "replied") textStatus = "회신성공";
        else if (inq.status === "completed") textStatus = "준수교부";

        await appendRowToSpreadsheet(spreadsheetId, token, "문의내역!A1", [
          inq.id,
          inq.senderName,
          inq.email,
          inq.phone,
          inq.productName,
          inq.quantity,
          inq.message || "",
          textStatus,
          new Date(inq.createdAt).toLocaleString("ko-KR"),
          inq.notes || ""
        ]);
        successCount++;
      }
      triggerFeedback(`총 ${successCount}건의 모든 접수내역이 스프레드시트에 전송 동기화 완료되었습니다.`);
    } catch (err: any) {
      triggerFeedback(`동기화 중 오류 발생 (완료 ${successCount}건): ${err.message || err}`);
    } finally {
      setIsSheetsOperating(false);
    }
  };

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // Seed sample data to prove functionality instantly
  const seedSampleData = () => {
    const samples: Inquiry[] = [
      {
        id: "INQ-782194",
        senderName: "육군 제7보병사단 보급본부 임상민 소령",
        email: "im.major@ROKarmy.mil",
        phone: "010-4822-9912",
        productName: "[손난로 핫팩] 180g 대용량핫팩",
        quantity: 12000,
        message: "연 말 혹한기 종합 전술 훈련 대비 격오지 GOP/GP 경계 근무 장병 우선 지급용으로 손일병 대용량 핫팩 긴급 수급 의뢰합니다. 12월 첫 주까지 전원 인수 전제 하에 행정 카드 수수료 및 영수증 처리를 위한 사본 첨부 바랍니다.",
        status: "reviewing",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4h ago
        notes: "배송 차량 진입 신고 절차 확인 필요 (GOP 초소 전용 윙바디 트럭 배치)",
      },
      {
        id: "INQ-194038",
        senderName: "우정사업본부 서울강남우체국 집배팀 이강석 팀장",
        email: "ks.lee@postoffice.go.kr",
        phone: "010-8812-3041",
        productName: "[손난로 핫팩] 100g 핫팩",
        quantity: 5000,
        message: "겨울철 새벽 야외 집배 및 오토바이 이동 배송 시 배달원들의 양 손가락 부상을 상시 차단하기 위해 콤팩트 주머니 핫팩 구매 타진합니다. 세금 계산서 발행 필수입니다.",
        status: "replied",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        notes: "전액 세금 계산서 전자 국세청 신고 발행 완료. 견적서 메일 전송함.",
      },
      {
        id: "INQ-220491",
        senderName: "무주 해피 스노우 스키 스쿨 이민재 원장",
        email: "mj.lee@happy-skischool.com",
        phone: "010-7733-1025",
        productName: "[발 핫팩] 발꼬락핫팩 40g",
        quantity: 1500,
        message: "강습생 보행 및 슬로프 안전 지도 중 발가락에 감각이 마비되는 것을 예방하기 위해 스마트 부착형 발 핫팩 대량으로 확보해 두고자 합니다. 강습생 한 박스 기프트 구성에 관한 협의가 필요합니다.",
        status: "pending",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      }
    ];

    localStorage.setItem("son_inquiries", JSON.stringify(samples));
    loadInquiries();
    onInquiryChange();
    triggerFeedback("가사 군부대 및 공공기관 상담 데이터 3건이 정상 로드되었습니다");
  };

  const deleteInquiry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = inquiries.filter((inq) => inq.id !== id);
    localStorage.setItem("son_inquiries", JSON.stringify(updated));
    setInquiries(updated);
    if (activeInquiryId === id) {
      setActiveInquiryId(null);
      setAdminNote("");
    }
    onInquiryChange();
    triggerFeedback("선택항목이 로컬 데이터베이스에서 소멸되었습니다.");
  };

  const updateStatus = (id: string, newStatus: Inquiry["status"]) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        return { ...inq, status: newStatus };
      }
      return inq;
    });
    localStorage.setItem("son_inquiries", JSON.stringify(updated));
    setInquiries(updated);
    onInquiryChange();
    triggerFeedback(`문서의 상태를 ${newStatus} 수순으로 변경 지정 완료.`);
  };

  const saveAdminNote = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        return { ...inq, notes: adminNote };
      }
      return inq;
    });
    localStorage.setItem("son_inquiries", JSON.stringify(updated));
    setInquiries(updated);
    onInquiryChange();
    triggerFeedback("공급 조율 메모 이력이 내부 저장되었습니다.");
  };

  const executeClearAll = () => {
    localStorage.removeItem("son_inquiries");
    setInquiries([]);
    setActiveInquiryId(null);
    setAdminNote("");
    setConfirmClearActive(false);
    onInquiryChange();
    triggerFeedback("전체 접수 CRM 자료가 초기화 배출되었습니다.");
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === "all") return true;
    return inq.status === filter;
  });

  const selectedInq = inquiries.find((inq) => inq.id === activeInquiryId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark overlay backdrop */}
      <div
        id="admin-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-in sidebar container - Sharp Corners */}
      <div className="absolute inset-y-0 right-0 max-w-4xl w-full bg-white border-l border-[#1F3821]/15 shadow-2xl flex flex-col h-full animate-slide-in rounded-none text-black">
        
        {/* Header toolbar with robust info layout */}
        <div className="px-6 py-5 bg-[#F4F6F4] border-b border-[#1F3821]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF4D00]/10 border border-[#FF4D00]/30 rounded-none">
              <ShieldCheck className="w-5 h-5 text-[#FF4D00]" />
            </div>
            <div className="text-left leading-none">
              <h3 className="text-sm font-black text-black uppercase tracking-wider">
                실시간 대량 조달 문의 실시간 접수처 (CRM)
              </h3>
              <p className="text-[9px] font-mono font-bold text-stone-500 mt-1 uppercase">
                MILITARY BULK INBOX MANAGER • ssong8730@gmail.com
              </p>
            </div>
          </div>
          <button
            id="admin-close-btn"
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-black hover:bg-[#1F3821]/10 border border-[#1F3821]/15 rounded-none transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action controllers & filter tabs with rigid geometric design */}
        <div className="px-6 py-4 bg-white border-b border-[#1F3821]/10 flex flex-wrap items-center justify-between gap-4">
          
          {/* Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "전체" },
              { id: "pending", label: "대기" },
              { id: "reviewing", label: "검토중" },
              { id: "replied", label: "회신성공" },
              { id: "completed", label: "교부인수" },
            ].map((tab) => {
              const count = tab.id === "all" ? inquiries.length : inquiries.filter((inq) => inq.status === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide transition-colors cursor-pointer rounded-none border ${
                    filter === tab.id
                      ? "bg-[#1F3821] text-white border-[#1F3821]"
                      : "bg-[#F4F6F4] border-[#1F3821]/10 text-[#1F3821] hover:bg-[#1F3821]/10"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Seed and purge buttons */}
          <div className="flex items-center gap-2">
            <button
              id="admin-seed-btn"
              onClick={seedSampleData}
              className="px-3 py-1.5 bg-[#FF4D00]/10 hover:bg-[#FF4D00] border border-[#FF4D00]/30 hover:border-[#FF4D00] text-[#FF4D00] hover:text-white text-[10px] font-black uppercase tracking-wider rounded-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>연구 부대자료 추가</span>
            </button>
            
            {inquiries.length > 0 && !confirmClearActive && (
              <button
                id="admin-clear-stage"
                onClick={() => setConfirmClearActive(true)}
                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[10px] font-extrabold rounded-none transition-colors cursor-pointer uppercase"
              >
                전체비우기
              </button>
            )}

            {confirmClearActive && (
              <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 border border-red-200">
                <span className="text-[9px] text-red-700 font-bold uppercase">소거 확인?</span>
                <button
                  onClick={executeClearAll}
                  className="px-1.5 py-0.5 bg-red-600 text-white font-extrabold text-[9px]"
                >
                  실행
                </button>
                <button
                  onClick={() => setConfirmClearActive(false)}
                  className="px-1.5 py-0.5 bg-stone-200 text-stone-800 text-[9px]"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Alert Banner inside CRM panel */}
        {feedbackMsg && (
          <div className="bg-[#FF4D00]/10 border-b border-[#FF4D00]/35 text-[#FF4D00] px-6 py-2.5 text-xs text-left font-sans font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FF4D00]" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Google Sheets Integration Section */}
        <div className="bg-[#1F3821]/5 border-b border-[#1F3821]/15 px-6 py-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1F3821]/15 text-[#1F3821] border border-[#1F3821]/20 rounded-none shrink-0">
                <Database className="w-4 h-4 text-[#1F3821]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-black uppercase tracking-wider">
                  구글 스프레드시트 수주 연동 (Google Sheets CRM Sync)
                </h4>
                <p className="text-[10px] text-stone-600 font-medium leading-relaxed mt-1">
                  견적 요청을 실시간으로 스프레드시트에 동기화 기록하고 영구 보존할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!googleAccessToken ? (
                <button
                  onClick={handleSheetsConnect}
                  disabled={isSheetsOperating}
                  className="px-3.5 py-2 bg-[#FF4D00] hover:bg-[#FF4D00]/95 text-white font-black text-[10px] uppercase tracking-wider rounded-none shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSheetsOperating ? "인증 로딩..." : "구글 계정 연동하기"}
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {googleUser && (
                    <div className="flex items-center gap-1.5 bg-white border border-[#1F3821]/15 px-2.5 py-1.5 text-[10px] font-bold text-stone-700">
                      {googleUser.photoURL && (
                        <img referrerPolicy="no-referrer" src={googleUser.photoURL} alt="Avatar" className="w-4 h-4 rounded-full" />
                      )}
                      <span>{googleUser.displayName || googleUser.email} 연결됨</span>
                    </div>
                  )}

                  {!spreadsheetId ? (
                    <button
                      onClick={handleSheetsCreate}
                      disabled={isSheetsOperating}
                      className="px-3 py-1.5 bg-[#1F3821] hover:bg-[#2C4F2E] text-white text-[10px] font-black uppercase tracking-wider rounded-none border border-transparent transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSheetsOperating ? "시트 개설중..." : "첫 시트 자동 생성"}
                    </button>
                  ) : (
                    <>
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-[#1F3821]/20 text-stone-800 text-[10px] font-black uppercase tracking-wider rounded-none transition-all flex items-center gap-1"
                      >
                        시트 열기 ↗
                      </a>
                      <button
                        onClick={handleSheetsFullSync}
                        disabled={isSheetsOperating}
                        className="px-3 py-1.5 bg-[#FF4D00] hover:bg-[#FF4D00]/95 text-white text-[10px] font-black uppercase tracking-wider rounded-none border border-transparent transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSheetsOperating ? "기록 전송중..." : "전체 동기화 ↑"}
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleSheetsDisconnect}
                    className="p-1.5 px-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[9px] font-bold rounded-none cursor-pointer"
                    title="연동해제"
                  >
                    연동해제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content body split: Left list, Right detail panel */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          
          {/* Left panel: List */}
          <div className="w-full md:w-5/12 border-r border-[#1F3821]/10 overflow-y-auto bg-[#F4F6F4]/40 flex flex-col">
            {filteredInquiries.length === 0 ? (
              <div className="m-auto text-center p-8 max-w-xs">
                <ClipboardCheck className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h4 className="text-xs font-black text-[#1F3821] uppercase tracking-wider">조회할 접수건이 존재하지 않습니다</h4>
                <p className="text-[11px] text-stone-500 leading-normal mt-2">
                  문의 폼을 보내 대량 예산 심사를 의뢰하시거나, 상단 우측의 <strong>'연구 부대자료 추가'</strong> 단추로 예시 항목을 즉시 생성해 보십시오!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#1F3821]/15">
                {filteredInquiries.map((inq) => {
                  const isActive = inq.id === activeInquiryId;
                  
                  // Color styling for states
                  const stateStyles = {
                    pending: "bg-red-500/10 text-red-600 border-red-500/20",
                    reviewing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                    replied: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                    completed: "bg-[#1F3821]/10 text-[#1F3821] border-[#1F3821]/20",
                  }[inq.status];

                  const stateKorean = {
                    pending: "대기",
                    reviewing: "검토중",
                    replied: "회신성공",
                    completed: "준수교부",
                  }[inq.status];

                  return (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setActiveInquiryId(inq.id);
                        setAdminNote(inq.notes || "");
                      }}
                      className={`p-4 text-left cursor-pointer transition-colors rounded-none ${
                        isActive ? "bg-white border-l-4 border-[#FF4D00]" : "hover:bg-white/60"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-black text-stone-400">
                          {inq.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 border rounded-none ${stateStyles}`}>
                            {stateKorean}
                          </span>
                          <button
                            id={`del-inq-${inq.id}`}
                            onClick={(e) => deleteInquiry(inq.id, e)}
                            className="text-stone-400 hover:text-red-500 p-0.5 transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-black leading-normal">
                        {inq.senderName}
                      </h4>
                      
                      <div className="text-[11px] text-stone-600 mt-1 space-y-0.5 font-sans">
                        <p className="line-clamp-1 text-[#FF4D00] text-xs font-bold">{inq.productName}</p>
                        <p className="font-mono text-[9px] text-stone-500">요청수량: {inq.quantity.toLocaleString()}개</p>
                      </div>

                      <div className="text-[9px] text-stone-400 mt-2 font-mono">
                        {new Date(inq.createdAt).toLocaleDateString("ko-KR", {
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel: Details of active item */}
          <div className="w-full md:w-7/12 overflow-y-auto bg-white p-6 flex flex-col justify-between">
            {selectedInq ? (
              <div className="text-left space-y-6">
                
                {/* Selected Title summary info */}
                <div className="border-b border-[#1F3821]/10 pb-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest block">견적 공식 요청서</span>
                      <h4 className="text-md font-black text-black mt-1 leading-snug">
                        {selectedInq.senderName}
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono font-extrabold text-[#1F3821] bg-[#F4F6F4] border border-[#1F3821]/15 px-2.5 py-1 rounded-none">
                      {selectedInq.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 text-xs font-mono">
                    <span className="flex items-center text-stone-700 font-medium">
                      <Mail className="w-3.5 h-3.5 text-[#FF4D00] mr-1 shrink-0" /> {selectedInq.email}
                    </span>
                    <span className="flex items-center text-stone-700 font-medium text-xs">
                      <Phone className="w-3.5 h-3.5 text-[#1F3821] mr-1 shrink-0" /> {selectedInq.phone}
                    </span>
                  </div>
                </div>

                {/* Scope of Product ordered */}
                <div className="grid grid-cols-2 gap-4 bg-[#F4F6F4] border border-[#1F3821]/10 p-4 rounded-none shadow-inner">
                  <div>
                    <span className="block text-[9px] font-black text-stone-500 uppercase tracking-wider">상담 요청 제품</span>
                    <span className="block text-xs font-black text-[#FF4D00] mt-1">{selectedInq.productName}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-stone-500 uppercase tracking-wider">희망 취득 수량</span>
                    <span className="block text-xs font-black text-[#1F3821] mt-1 font-mono">{selectedInq.quantity.toLocaleString()} 개</span>
                  </div>
                </div>

                {/* Message detail */}
                <div>
                  <span className="block text-[10px] font-black text-stone-500 uppercase mb-2">상담 전송 메시지 원본</span>
                  <div className="bg-[#F4F6F4]/50 p-4 text-xs text-stone-800 leading-relaxed border border-[#1F3821]/10 rounded-none max-h-48 overflow-y-auto whitespace-pre-wrap select-text font-mono">
                    {selectedInq.message || "상세 비고 사항이 공란입니다."}
                  </div>
                </div>

                {/* State controllers on click */}
                <div>
                  <span className="block text-[10px] font-black text-stone-500 uppercase mb-2">조달 진행 단계 지시 변경</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                    {[
                      { state: "pending" as const, label: "대기전송", color: "hover:bg-[#1F3821]/5 text-red-500 border-[#1F3821]/10" },
                      { state: "reviewing" as const, label: "검토가공", color: "hover:bg-[#1F3821]/5 text-blue-500 border-[#1F3821]/10" },
                      { state: "replied" as const, label: "메일회신", color: "hover:bg-[#1F3821]/5 text-yellow-500 border-[#1F3821]/10" },
                      { state: "completed" as const, label: "최종납품", color: "hover:bg-[#1F3821]/5 text-[#1F3821] border-[#1F3821]/10" },
                    ].map((btn) => (
                      <button
                        key={btn.state}
                        onClick={() => updateStatus(selectedInq.id, btn.state)}
                        className={`py-2 text-[10px] font-black tracking-wider transition-colors cursor-pointer border rounded-none uppercase ${btn.color} ${
                          selectedInq.status === btn.state
                            ? "bg-[#1F3821] text-white border-[#1F3821] font-black"
                            : "bg-[#F4F6F4]"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CRM Notes */}
                <div className="border-t border-[#1F3821]/10 pt-4">
                  <label className="block text-[10px] font-black text-stone-500 uppercase mb-2">
                    도소매 공급단가 조율 사내 비고록
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="단가 조정액, 관납 전표 발행 기일 등 기록..."
                      className="flex-grow bg-white border border-[#1F3821]/15 rounded-none px-3 py-2 text-xs text-black placeholder-stone-400 focus:outline-none"
                    />
                    <button
                      onClick={() => saveAdminNote(selectedInq.id)}
                      className="px-4 py-2 bg-[#1F3821] hover:bg-[#FF4D00] text-white rounded-none text-xs font-black transition-all shrink-0 cursor-pointer"
                    >
                      저장
                    </button>
                  </div>
                  {selectedInq.notes && (
                    <div className="mt-3 text-xs bg-[#F4F6F4] border border-[#1F3821]/10 p-3 rounded-none flex items-start gap-1.5 text-stone-600">
                      <span className="font-extrabold underline text-[10px] shrink-0 text-[#FF4D00] uppercase tracking-wide">기록내용:</span>
                      <p className="italic leading-relaxed select-text text-stone-800 font-medium">{selectedInq.notes}</p>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="m-auto text-center p-8 max-w-xs">
                <Database className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest">수신 항목을 로드하지 않았습니다</h4>
                <p className="text-[11px] text-stone-500 leading-normal mt-2">
                  좌측 상담 일지 일련번호를 지정하시면 통신 일지, 이메일 주소, 자재 소요 일람을 자세히 확인해 보고 보온 물품 유통 등급을 매칭 지정 배정하실 수 있습니다.
                </p>
              </div>
            )}

            {/* Simulated server logs indicator at the bottom footer */}
            <div className="mt-8 border-t border-[#1F3821]/10 pt-4 flex items-center justify-between text-[8px] font-mono text-stone-400">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-none animate-ping mr-2" />
                LOCAL RAM-DATABASE SECURELY ACTIVE
              </span>
              <span>ADMIN DATA ISOLATION SHIELD</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
