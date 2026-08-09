with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

cgssb_hero = '''          {id === 'cgssb-chhattisgarh-teacher-recruitment-2026' && (
            <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 rounded-2xl shadow-xl border-2 border-orange-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      CGSSB (CG Vyapam) Exam LST26
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      100% Fee Refund for CG Domiciles
                    </span>
                    <span className="bg-orange-500/20 text-orange-300 border border-orange-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Exam Date: 25 Oct 2026
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    CGSSB Chhattisgarh School Education Teacher Recruitment 2026 (LST26)
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Written recruitment exam for <strong>Shikshak (Teacher)</strong> posts under Directorate of Public Instruction CG. Level 8 Pay Scale (Basic ₹35,400 + Allowances).
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://cgssb.cgstate.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on CGSSB Portal
                  </a>
                </div>
              </div>
            </div>
          )}'''

cgssb_post_cards = '''                    {id === 'cgssb-chhattisgarh-teacher-recruitment-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-orange-600" /> CG Domicile Fee Refund &amp; Exam Schedule Highlights
                          </h4>
                          <span className="text-[10px] font-bold text-orange-900 bg-orange-100 px-2 py-0.5 rounded-md">Exam Code LST26</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">Govt Policy</span>
                              <span className="text-[11px] font-bold text-emerald-700">100% Refund</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">1. Application Fee Refund Rule</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Fee paid by CG Domiciles who <strong>appear in the written exam</strong> will be 100% refunded back into their bank account.
                            </p>
                          </div>
                          <div className="bg-white border border-orange-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-orange-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">25.10.2026</span>
                              <span className="text-[11px] font-bold text-orange-700">10:00 AM - 12:15 PM</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">2. Tentative Exam Date</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Written competitive exam across 16 District Headquarters. Admit Cards available from <strong>19 October 2026</strong>.
                            </p>
                          </div>
                          <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">3-5 Sept 2026</span>
                              <span className="text-[11px] font-bold text-amber-700">Truti Sudhar</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">3. Correction Window</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Online correction window will be active from 03 to 05 September 2026 up to 5:00 PM on CGSSB portal.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}'''

cgssb_upload_card = '''            {id === 'cgssb-chhattisgarh-teacher-recruitment-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-orange-400 mb-3 flex items-center gap-2">
                  <FileSignature className="h-4.5 w-4.5 text-orange-400" /> CGSSB LST26 Exam Pattern &amp; Photo Guidelines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-orange-300 mb-1">1. Exam Pattern &amp; Duration</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      100 Multiple Choice Questions (100 Marks). Total Exam Duration: <strong>2 Hours 15 Minutes (135 Mins)</strong>.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-orange-300 mb-1">2. Negative Marking Rule</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      <strong>0.25 Marks (1/4th)</strong> deducted for each incorrect answer in OMR answer sheet.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-orange-300 mb-1">3. Photo Upload Specs</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Recent photograph on <strong>light background (50-100 KB)</strong> + Signature (50-100 KB) in JPG/JPEG format.
                    </p>
                  </div>
                </div>
              </div>
            )}'''

if "cgssb-chhattisgarh-teacher-recruitment-2026" not in content:
    if "{/* Quick Highlights */}" in content:
        content = content.replace("{/* Quick Highlights */}", cgssb_hero + "\n\n          {/* Quick Highlights */}")

    if "Educational Qualification" in content:
        target_edu = "<BookOpen className=\"h-4 w-4 sm:h-5 sm:w-5 text-blue-500\" /> Educational Qualification\n                    </h3>"
        content = content.replace(target_edu, target_edu + "\n" + cgssb_post_cards)

    if "Documents Required Checklist" in content:
        target_doc = "<UploadCloud className=\"h-4 w-4 sm:h-5 sm:w-5 text-blue-500\" /> Documents Required Checklist\n                </h3>"
        content = content.replace(target_doc, cgssb_upload_card + "\n\n                " + target_doc)

    with open('src/pages/JobDetailPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Injected CGSSB visual cards into JobDetailPage.tsx")
else:
    print("INFO: CGSSB cards already present in JobDetailPage.tsx")
