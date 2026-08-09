with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

hphc_hero = '''          {id === 'hp-high-court-district-judiciary-recruitment-2026' && (
            <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 rounded-2xl shadow-xl border-2 border-sky-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      HP High Court Shimla Recruitment
                    </span>
                    <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Salary up to ₹1,54,300/month
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      388 District Judiciary Vacancies
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    HP High Court District Judiciary Recruitment 2026
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Direct recruitment for <strong>141 Clerks</strong>, <strong>89 Peons</strong>, <strong>79 Stenographers</strong>, <strong>65 Process Servers</strong>, <strong>9 Drivers</strong> &amp; <strong>5 Court Managers</strong> in HP District Judiciary.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://www.hphcrecruitment.in/login" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on HPHC Portal
                  </a>
                </div>
              </div>
            </div>
          )}'''

hphc_post_cards = '''                    {id === 'hp-high-court-district-judiciary-recruitment-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-sky-600" /> Post-wise Educational Qualification &amp; Pay Scale Matrix
                          </h4>
                          <span className="text-[10px] font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md">388 Total Posts</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white border border-sky-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-sky-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">141 Posts</span>
                              <span className="text-[11px] font-bold text-sky-700">Level 03 (₹20k-₹64k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">1. Clerk (Group-C)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Graduate Degree + Computer Knowledge + Typing 30 WPM English &amp; 25 WPM Hindi (Kruti Dev-10).
                            </p>
                          </div>
                          <div className="bg-white border border-indigo-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-indigo-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">89 Posts</span>
                              <span className="text-[11px] font-bold text-indigo-700">Level 01 (₹18k-₹56k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">2. Peon / Chowkidar (Group-D)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Class 12th (10+2) Pass. Merit list based on 10+2 marks percentage (85%) + Certificate Evaluation (15%).
                            </p>
                          </div>
                          <div className="bg-white border border-purple-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-purple-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">79 Posts</span>
                              <span className="text-[11px] font-bold text-purple-700">Level 06 (₹25k-₹81k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">3. Stenographer Gr-III (Group-C)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Graduate Degree + English Steno 80 WPM &amp; Typing 40 WPM (English) / 30 WPM (Hindi Kruti Dev-10).
                            </p>
                          </div>
                          <div className="bg-white border border-blue-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">65 Posts</span>
                              <span className="text-[11px] font-bold text-blue-700">Level 01 (₹18k-₹56k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">4. Process Server (Group-D)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Passed Class 12th (10+2) examination from a recognized Board.
                            </p>
                          </div>
                          <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">09 Posts</span>
                              <span className="text-[11px] font-bold text-emerald-700">Level 05 (₹21k-₹67k)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">5. Driver (Group-C)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Matriculation (10th) + Valid LMV Driving License with minimum 3 years driving experience.
                            </p>
                          </div>
                          <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">05 Posts</span>
                              <span className="text-[11px] font-bold text-amber-700">Level 16 (₹48k-₹1.54L)</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-xs mb-1">6. Court Manager (Group-B)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              Graduation Degree + MBA (HR/IT/Finance/Process) + 3 years experience. Age: 25 to 35 years.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}'''

hphc_upload_card = '''            {id === 'hp-high-court-district-judiciary-recruitment-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-sky-400 mb-3 flex items-center gap-2">
                  <FileSignature className="h-4.5 w-4.5 text-sky-400" /> HP High Court Selection Rules &amp; Typing Font Guidelines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-sky-300 mb-1">1. Hindi Typing Font Rule</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Hindi typing test for Clerk and Steno will be conducted strictly on computer using <strong>Kruti Dev-10 font</strong> at 25 WPM speed.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-sky-300 mb-1">2. Peon 10+2 Merit Weightage</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Shortlisting for Peon/Chowkidar in 1:3 ratio based on <strong>10+2 marks percentage (85%)</strong> + <strong>Document Evaluation (15 Marks)</strong>.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-sky-300 mb-1">3. Bonafide Himachali Rule</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      Condition of passing 10th/12th from HP school applies for Non-Bonafides. <strong>Bonafide Himachalis are 100% exempt</strong> from this condition.
                    </p>
                  </div>
                </div>
              </div>
            )}'''

if "hp-high-court-district-judiciary-recruitment-2026" not in content:
    if "{/* Quick Highlights */}" in content:
        content = content.replace("{/* Quick Highlights */}", hphc_hero + "\n\n          {/* Quick Highlights */}")

    if "Educational Qualification" in content:
        target_edu = "<BookOpen className=\"h-4 w-4 sm:h-5 sm:w-5 text-blue-500\" /> Educational Qualification\n                    </h3>"
        content = content.replace(target_edu, target_edu + "\n" + hphc_post_cards)

    if "Documents Required Checklist" in content:
        target_doc = "<UploadCloud className=\"h-4 w-4 sm:h-5 sm:w-5 text-blue-500\" /> Documents Required Checklist\n                </h3>"
        content = content.replace(target_doc, hphc_upload_card + "\n\n                " + target_doc)

    with open('src/pages/JobDetailPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Injected HPHC visual cards into JobDetailPage.tsx")
else:
    print("INFO: HPHC cards already present in JobDetailPage.tsx")
