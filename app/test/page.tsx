"use client";
import { useState, useEffect, Suspense } from "react";

// Custom CSV Parser to replace papaparse dependency
function parseCSV(str) {
  const arr = [];
  let quote = false;
  let row = 0, col = 0;
  for (let c = 0; c < str.length; c++) {
    let cc = str[c], nc = str[c+1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';
    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { ++col; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
    if (cc === '\n' && !quote) { ++row; col = 0; continue; }
    if (cc === '\r' && !quote) { ++row; col = 0; continue; }
    arr[row][col] += cc;
  }
  
  const headers = arr[0] || [];
  const data = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].length === 1 && arr[i][0].trim() === '') continue;
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      if (headers[j]) {
        obj[headers[j].trim()] = arr[i][j];
      }
    }
    data.push(obj);
  }
  return data;
}

function TestContent() {
  const [testId, setTestId] = useState("five_year_plans");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({}); 
  const [lang, setLang] = useState("hi"); 
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState({ correct: 0, incorrect: 0, unattended: 0, total: 0 });
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) setTestId(id);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    // Uses the ID to fetch from the specified sheet name
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/1eMdE5uhdQXpA73_NO6MwJbMq7x_eI7C38jbqjzP1vtY/gviz/tq?tqx=out:csv&sheet=${testId}`;

    fetch(SHEET_URL)
      .then(res => res.text())
      .then(csvText => {
        const parsedData = parseCSV(csvText);
        const validQuestions = parsedData.filter(q => q.q_hi && q.q_hi.trim() !== "");
        setQuestions(validQuestions);
        
        const initialStatus = {};
        validQuestions.forEach((_, i) => { initialStatus[i] = 'not_visited'; });
        if(validQuestions.length > 0) initialStatus[0] = 'not_answered';
        
        setStatus(initialStatus);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sheet data:", err);
        setLoading(false);
      });

    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [testId]);

  const handleSaveAndNext = () => {
    setStatus({ ...status, [currentQ]: answers[currentQ] ? 'answered' : 'not_answered' });
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const calculateScore = () => {
    if(!window.confirm("Submit Final Exam?")) return;
    let c = 0, inc = 0, un = 0;
    questions.forEach((q, index) => {
      if (!answers[index]) un++;
      else if (answers[index] === q.correctAnswer) c++;
      else inc++;
    });
    setResultData({ correct: c, incorrect: inc, unattended: un, total: questions.length });
    setScore(c);
    setIsSubmitted(true);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse text-lg uppercase tracking-tighter italic">SNP Secure Server Connecting...</div>;

  // --- RESULT VIEW (SSC SCORECARD STYLE) ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-100 p-3 md:p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          {/* SSC Official Header */}
          <div className="bg-white border-t-4 border-orange-500 rounded-t-xl p-4 flex items-center gap-4 shadow-sm border-x border-b">
             <div className="bg-orange-600 text-white p-2 rounded-lg font-black text-xl italic">SNP</div>
             <div>
                <h1 className="text-sm md:text-lg font-black text-slate-700 uppercase leading-none mb-1">Sarkari Naukri Prayas Examination Portal</h1>
                <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Staff Selection Mock Result - Tier I</p>
             </div>
          </div>

          {/* Candidate Profile Box */}
          <div className="bg-white border-x border-b p-6 mb-6 shadow-sm rounded-b-xl">
            <div className="bg-orange-50 px-4 py-1 mb-5 border-l-4 border-orange-500 flex justify-between items-center">
                <span className="text-[10px] font-black text-orange-700 uppercase italic">Candidate Dashboard</span>
                <span className="text-[9px] font-bold text-orange-400 uppercase">Status: Published</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-[10px] md:text-xs">
                <div><p className="text-slate-400 font-bold uppercase mb-1">Registration No</p><p className="font-black text-slate-800">SNP-2026-X88</p></div>
                <div><p className="text-slate-400 font-bold uppercase mb-1">Candidate Name</p><p className="font-black text-slate-800 uppercase italic">Arav Sir Student</p></div>
                <div><p className="text-slate-400 font-bold uppercase mb-1">Subject</p><p className="font-black text-slate-800 uppercase">{testId.replace(/_/g, ' ')}</p></div>
                <div><p className="text-slate-400 font-bold uppercase mb-1">Exam Date</p><p className="font-black text-slate-800">{new Date().toLocaleDateString('en-GB')}</p></div>
            </div>
          </div>

          {/* SSC Style Marks Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border mb-8">
            <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-widest">Score Summary</h2>
                <span className="text-[9px] opacity-60">Report Generated Successfully</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-[11px] md:text-sm text-center border-collapse">
                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tighter border-b">
                        <tr>
                            <th className="p-4 border-r">Section</th>
                            <th className="p-4 border-r">Total Qs</th>
                            <th className="p-4 border-r text-green-600">Right</th>
                            <th className="p-4 border-r text-red-500">Wrong</th>
                            <th className="p-4 border-r text-blue-600 font-black">Score</th>
                            <th className="p-4 text-orange-600">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody className="font-bold text-slate-700">
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 border-r italic text-left pl-6">{testId.toUpperCase()}</td>
                            <td className="p-4 border-r">{questions.length}</td>
                            <td className="p-4 border-r text-green-600">{resultData.correct}</td>
                            <td className="p-4 border-r text-red-500">{resultData.incorrect}</td>
                            <td className="p-4 border-r text-blue-700 bg-blue-50/30 text-lg">{score}.00</td>
                            <td className="p-4 text-orange-700 bg-orange-50/20">{questions.length > 0 ? Math.round((score/questions.length)*100) : 0}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>

          {/* Detailed Question Review */}
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase border-b-2 border-slate-800 pb-2 flex justify-between items-center italic">
            <span>Review Question Paper</span>
            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">Official Key</span>
          </h3>
          
          <div className="space-y-4 mb-10">
            {questions.map((q, i) => (
              <div key={i} className="bg-white border rounded-xl p-5 hover:border-blue-400 transition-all shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-slate-400 text-[10px] uppercase">Item #{i + 1}</span>
                  <div className="flex gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm ${answers[i] === q.correctAnswer ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}>
                        {answers[i] === q.correctAnswer ? 'Correct' : 'Wrong'}
                    </span>
                  </div>
                </div>

                <p 
                  className="font-bold text-slate-800 mb-6 text-sm md:text-base leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: q?.[`q_${lang}`] || '' }} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className={`p-4 rounded-lg border-2 ${answers[i] === q.correctAnswer ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-100'}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Student Response</p>
                    <p className="font-bold">
                      {answers[i] ? (
                        <span dangerouslySetInnerHTML={{ __html: `${answers[i]}. ${q?.[`${answers[i].toLowerCase()}_${lang}`] || ''}` }} />
                      ) : (
                        <span className="italic text-slate-300">Skipped</span>
                      )}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-blue-100 bg-blue-50/50">
                    <p className="text-[9px] font-black text-blue-400 uppercase mb-2">Verified Answer</p>
                    <p className="font-bold text-blue-800" dangerouslySetInnerHTML={{ __html: `${q.correctAnswer}. ${q?.[`${q.correctAnswer?.toLowerCase()}_${lang}`] || ''}` }} />
                  </div>
                </div>

                {q.explanation && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Explanation</p>
                    <p className="text-xs text-slate-600 font-medium italic" dangerouslySetInnerHTML={{ __html: q.explanation }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={() => window.location.href='/'} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-orange-600 transition-all uppercase tracking-widest text-xs shadow-2xl mb-20">Back to Home Screen</button>
        </div>
      </div>
    );
  }

  // --- MAIN EXAM SCREEN ---
  const q = questions[currentQ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans select-none relative text-slate-800">
      
      {/* HEADER */}
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-[100]">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded font-black text-sm italic">SNP</div>
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-slate-300 border-l pl-2">{testId}</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-slate-100 text-[10px] font-black px-3 py-1.5 rounded-full outline-none uppercase shadow-inner">
            <option value="hi">Hindi</option><option value="en">English</option><option value="hg">Hinglish</option>
          </select>
          <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-mono font-black text-sm shadow-md">
            {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* QUESTION PANEL */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden border-r shadow-inner">
          <div className="bg-slate-50/50 px-6 py-2 border-b text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between">
            <span>Question {currentQ + 1} / {questions.length}</span>
            <span>Marks: 1.0</span>
          </div>
          
          <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
            {q ? (
              <div className="max-w-3xl mx-auto">
                  <h2 
                    className="text-lg md:text-2xl font-bold text-slate-800 mb-8 leading-snug"
                    dangerouslySetInnerHTML={{ __html: q?.[`q_${lang}`] || '' }}
                  />
                  
                  <div className="space-y-3">
                  {['a', 'b', 'c', 'd'].map(opt => {
                      if (!q?.[`${opt}_${lang}`]) return null;
                      return (
                        <label key={opt} className={`group flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${answers[currentQ] === opt.toUpperCase() ? 'bg-blue-50 border-blue-600 shadow-md ring-1 ring-blue-600' : 'hover:bg-slate-50 border-slate-100 hover:border-slate-300'}`}>
                        <input type="radio" checked={answers[currentQ] === opt.toUpperCase()} onChange={() => setAnswers({...answers, [currentQ]: opt.toUpperCase()})} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQ] === opt.toUpperCase() ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white'}`}>
                            {answers[currentQ] === opt.toUpperCase() && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-xs font-black ${answers[currentQ] === opt.toUpperCase() ? 'text-blue-600' : 'text-slate-300'}`}>{opt.toUpperCase()}.</span>
                        
                        <span 
                          className="text-sm md:text-base font-bold text-slate-600 group-hover:text-slate-900 transition-colors"
                          dangerouslySetInnerHTML={{ __html: q?.[`${opt}_${lang}`] || '' }}
                        />
                        </label>
                      )
                  })}
                  </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 font-bold">No questions found in this sheet. Please check the ID or URL parameters.</div>
            )}
          </div>
          
          {/* FOOTER */}
          <footer className="p-4 bg-white border-t flex justify-between items-center px-6 lg:px-12">
            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">Previous</button>
            <div className="flex gap-4">
                <button onClick={() => setAnswers({...answers, [currentQ]: null})} className="hidden md:block text-[10px] font-black text-red-300 uppercase hover:text-red-500">Clear</button>
                <button onClick={handleSaveAndNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-transform active:scale-95">Save & Next</button>
            </div>
          </footer>
        </div>

        {/* SIDEBAR PALETTE (TCS STYLE) */}
        <div className={`
          fixed lg:relative top-0 right-0 h-full lg:h-auto z-[110] lg:z-0
          w-72 md:w-80 bg-slate-50 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out border-l
          ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          <div className="p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">RA</div>
                    <div><p className="font-black text-xs text-slate-800 leading-none mb-1 uppercase tracking-tighter">Arrav Sir Student</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">Official Aspirant</p></div>
                </div>
                <button onClick={() => setIsPaletteOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-400 font-bold shadow-sm">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                <p className="text-[10px] font-black text-slate-300 uppercase mb-4 tracking-widest border-b pb-2">Question Navigation</p>
                <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => (
                    <button 
                    key={i} 
                    onClick={() => { setCurrentQ(i); setIsPaletteOpen(false); }} 
                    className={`h-10 w-10 rounded-xl font-black text-[11px] transition-all flex items-center justify-center border-2 ${currentQ === i ? 'border-blue-600 ring-2 ring-blue-50 bg-white text-blue-600 shadow-md' : status[i] === 'answered' ? 'bg-green-500 border-green-500 text-white shadow-sm' : status[i] === 'not_answered' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                    {i + 1}
                    </button>
                ))}
                </div>
            </div>

            <button onClick={calculateScore} className="mt-6 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all">Submit Final Exam</button>
          </div>
        </div>

        {/* MOBILE OVERLAY */}
        {isPaletteOpen && (
          <div onClick={() => setIsPaletteOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[105]" />
        )}
      </div>

      {/* FLOATING TOGGLE BUTTON (MOBILE) */}
      <button 
        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[120] bg-slate-900 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center border-2 border-white/20 transform active:scale-90 transition-transform"
      >
        {isPaletteOpen ? <span className="text-xl">✕</span> : <span className="text-xl">☰</span>}
      </button>

    </div>
  );
}

export default function TestPage() {
  return <Suspense fallback={<div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse text-sm uppercase">Secure Portal Launching...</div>}><TestContent /></Suspense>;
}
