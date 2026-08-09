with open('src/pages/JobDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

kea_hero = '''          {id === 'kea-karnataka-esi-pharmacist-nursing-officer-2026' && (
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl shadow-xl border-2 border-emerald-500/40 p-5 sm:p-8 relative overflow-hidden mb-6 print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                      KEA Karnataka Direct Recruitment
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      Salary up to ₹99,400/month
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      188 Group 'C' Posts
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    KEA ESI Medical Services Pharmacist &amp; Nursing Officer Recruitment 2026
                  </h3>
                  <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Direct recruitment for <strong>98 Pharmacist Officers</strong> (Pay ₹44,425-₹83,700) and <strong>90 Nursing Officers / Shushrushadhikari</strong> (Pay ₹54,175-₹99,400) in ESI Hospitals across Karnataka.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://cetonline.karnataka.gov.in/kea/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Apply on KEA Portal
                  </a>
                </div>
              </div>
            </div>
          )}'''

kea_post_cards = '''                    {id === 'kea-karnataka-esi-pharmacist-nursing-officer-2026' && (
                      <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4 text-emerald-600" /> Post-wise Qualification &amp; Pay Scale Breakdown
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">188 Total Posts</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">98 Posts</span>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Pay: ₹44,425 - ₹83,700</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-sm mb-1">1. Pharmacist Officer (ಫಾರ್ಮಸಿ ಆಫೀಸರ್)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              <strong>Qualification:</strong> Diploma in Pharmacy (D.Pharm) from a recognized institute + Must be registered with <strong>Karnataka Pharmacy Council</strong>.
                            </p>
                          </div>
                          <div className="bg-white border border-teal-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-teal-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">90 Posts</span>
                              <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Pay: ₹54,175 - ₹99,400</span>
                            </div>
                            <h5 className="font-black text-slate-900 text-sm mb-1">2. Nursing Officer (ನರ್ಸಿಂಗ್ ಆಫೀಸರ್ - ಶುಶ್ರೂಷಾಧಿಕಾರಿ)</h5>
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                              <strong>Qualification:</strong> Diploma in General Nursing (GNM) OR B.Sc Nursing from authorized authority + Must be registered with <strong>Karnataka Nursing Council</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}'''

kea_upload_card = '''            {id === 'kea-karnataka-esi-pharmacist-nursing-officer-2026' && (
              <div className="my-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
                <h4 className="text-xs sm:text-sm font-black text-emerald-400 mb-3 flex items-center gap-2">
                  <FileSignature className="h-4.5 w-4.5 text-emerald-400" /> KEA Examination Pattern &amp; Kannada Language Test Rules
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-emerald-300 mb-1">1. Compulsory Kannada Test</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      150 Marks test (2 Hours). Minimum <strong>50 Marks required to pass</strong>. (Exempted if studied Kannada in SSLC/10th).
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-emerald-300 mb-1">2. Competitive Written Exam</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      <strong>Paper 1 (GK 100 Qs / 100 Marks)</strong> + <strong>Paper 2 (Domain 100 Qs / 100 Marks)</strong>. Total 200 Marks. Minimum 35% to qualify.
                    </p>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl">
                    <h5 className="font-black text-xs text-emerald-300 mb-1">3. Negative Marking</h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      <strong>0.25 Marks (1/4th)</strong> deducted for each incorrect answer in Competitive Written Exam (Paper 1 &amp; 2).
                    </p>
                  </div>
                </div>
              </div>
            )}'''

if "kea-karnataka-esi-pharmacist-nursing-officer-2026" not in content:
    if "{/* Quick Highlights */}" in content:
        content = content.replace("{/* Quick Highlights */}", kea_hero + "\n\n          {/* Quick Highlights */}")

    if "Educational Qualification" in content:
        target_edu = "<BookOpen className=\"h-4 w-4 sm:h-5 sm:w-5 text-blue-500\" /> Educational Qualification\n                    </h3>"
        content = content.replace(target_edu, target_edu + "\n" + kea_post_cards)

    if "Documents Required Checklist" in content:
        target_doc = "<UploadCloud className=\"h-4 w-4 sm:h-5 sm:w-5 text-blue-500\" /> Documents Required Checklist\n                </h3>"
        content = content.replace(target_doc, kea_upload_card + "\n\n                " + target_doc)

    with open('src/pages/JobDetailPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Injected KEA visual cards into JobDetailPage.tsx")
else:
    print("INFO: KEA cards already present in JobDetailPage.tsx")
