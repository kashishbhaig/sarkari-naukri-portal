import Link from 'next/link';

export default function Home() {
  const tests = [
     { 
      id: "AEDO_MOCK_PRACTICES", 
      title: "AEDO MOCK PRACTICES : PYQ", 
      questions: "100 Qs", 
      tag: "AEDO", 
      color: "from-indigo-500 to-purple-700",
      desc: "High-yield Maths and Reasoning questions for sure-shot selection."
    },
 { 
      id: "NTPC_GS", 
      title: "NTPC GS: PYQ", 
      questions: "916 Qs", 
      tag: "NTPC", 
      color: "from-indigo-500 to-purple-700",
      desc: "High-yield Maths and Reasoning questions for sure-shot selection."
    },
    
    { 
      id: "simulator_02_aptitude", 
      title: "BPSC Simulator-2: Aptitude & Reasoning", 
      questions: "100 Qs", 
      tag: "BPSC PRELIMS", 
      color: "from-indigo-500 to-purple-700",
      desc: "High-yield Maths and Reasoning questions for sure-shot selection."
    },
    { 
  id: "simulator_02_gs", 
  title: "BPSC Simulator-2: GS Special", 
  questions: "100 Qs", 
  tag: "BPSC", 
  color: "from-red-600 to-orange-700",
  desc: "Latest March 2026 pattern based General Studies mock test."
},
    { 
  id: "bihar_budget", 
  title: "Bihar Budget & Eco Survey 2024-25", 
  questions: "50 Qs", 
  tag: "BIHAR SPECIAL", 
  color: "from-emerald-500 to-teal-700",
  desc: "BPSC aur Bihar State exams ke liye sabse important current data."
},
    { 
      id: "five_year_plans", 
      title: "Five Year Plans (पंचवर्षीय योजनाएं)", 
      questions: "50 Qs", 
      tag: "ECONOMY", 
      color: "from-purple-500 to-indigo-600",
      desc: "SSC, Railway aur State exams ke liye 50 sabse mahatvapurn sawal."
    },
    { 
      id: "gandhi_era", 
      title: "Modern History: Gandhi Era", 
      questions: "25 Qs", 
      tag: "HISTORY", 
      color: "from-orange-500 to-red-600",
      desc: "Gandhian movements aur modern history ke top sawal."
    },
    { 
      id: "upp_mock_01", 
      title: "UP Police Mock Test - 01", 
      questions: "100 Qs", 
      tag: "UP POLICE", 
      color: "from-blue-600 to-indigo-700",
      desc: "Full length mock test based on latest TCS pattern."
    },
    { 
      id: "rrb_science", 
      title: "RRB NTPC Science Special", 
      questions: "25 Qs", 
      tag: "RAILWAY", 
      color: "from-green-500 to-teal-600",
      desc: "Railway exams ke liye Physics, Chemistry aur Bio."
    },
    { 
      id: "indian_polity", 
      title: "Indian Polity: Constitution Master", 
      questions: "25 Qs", 
      tag: "POLITY", 
      color: "from-red-500 to-amber-600",
      desc: "Articles, Parts aur Constitution ke basic concepts."
    },
    { 
      id: "bihar_special", 
      title: "Bihar Special: G.K. Dhamaka", 
      questions: "100 Qs", 
      tag: "BIHAR EXAMS", 
      color: "from-yellow-500 to-red-700",
      desc: "BPSC aur Bihar Police ke liye 100% selection content."
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans selection:bg-blue-100 selection:text-blue-900 text-slate-900">
      
      {/* --- MODERN NAVBAR --- */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20 p-4 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black text-2xl shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">S</div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Sarkari Naukri Prayas</h1>
              <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1 block">Arrav Sir Academy</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
             <Link href="/about" className="hover:text-blue-600 cursor-pointer transition-colors">Courses</Link>
             <Link href="/contact" className="hover:text-blue-600 cursor-pointer transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.3em]">Official Test Portal 2026</span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Ab Taiyari Hogi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Selection Wali.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
            TCS Pattern par aadharit sabse sateek Mock Test Series. Join kijiye hazaron bacchon ka bharosa aur paiye apni man-chahi naukri.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
             <div className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-3xl">
                <p className="text-3xl font-black text-white">50k+</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Learners</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-3xl">
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Updated Content</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- TEST GRID --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 pb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-[2.5rem] p-2 shadow-2xl shadow-slate-200 group hover:-translate-y-3 transition-all duration-500 border border-white">
              <div className="bg-slate-50/50 rounded-[2.3rem] p-8 h-full flex flex-col border border-slate-100">
                <div className={`w-14 h-1.5 bg-gradient-to-r ${test.color} rounded-full mb-6`}></div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3 block">{test.tag}</span>
                <h3 className="text-2xl font-black text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{test.title}</h3>
                <p className="text-slate-500 text-sm font-medium mb-8 flex-1">{test.desc}</p>
                
                <div className="flex items-center gap-6 mb-10">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Questions</span>
                      <span className="text-sm font-black text-slate-700">{test.questions}</span>
                   </div>
                   <div className="w-[1px] h-6 bg-slate-200"></div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Duration</span>
                      <span className="text-sm font-black text-slate-700">90 Mins</span>
                   </div>
                   <div className="w-[1px] h-6 bg-slate-200"></div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Language</span>
                      <span className="text-sm font-black text-slate-700">Multi</span>
                   </div>
                </div>

                <Link href={`/test?id=${test.id}`}>
                  <button className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 group/btn">
                    ATTEMPT MOCK TEST 
                    <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TRUST FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
             <div className="text-left">
                <h4 className="text-xl font-black text-slate-900 mb-2">Sarkari Naukri Prayas</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">India&apos;s most trusted platform for Bihar and UP Government Exam Preparation. Made with ❤️ by Arrav Sir.</p>
             </div>
             <div className="flex justify-center gap-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">YT</div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">TG</div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">IN</div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">&copy; 2026 All Rights Reserved</p>
                <p className="text-xs font-bold text-slate-800 mt-2 italic">Designed for Selection.</p>
             </div>
          </div>

          {/* ADSENSE MANDATORY PAGES LINKS */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-12 py-8 border-t border-slate-200">
            <Link href="/about" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">About Us</Link>
            <Link href="/contact" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Contact</Link>
            <Link href="/privacy" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
