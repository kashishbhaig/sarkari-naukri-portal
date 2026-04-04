"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Papa from "papaparse";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';

function TestContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("id") || "five_year_plans";

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
  
  // Mobile Palette Toggle State
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const SHEET_URL = `https://docs.google.com/spreadsheets/d/1eMdE5uhdQXpA73_NO6MwJbMq7x_eI7C38jbqjzP1vtY/gviz/tq?tqx=out:csv&sheet=${testId}`;

  useEffect(() => {
    setLoading(true);
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const validQuestions = results.data.filter(q => q.q_hi && q.q_hi.trim() !== "");
        setQuestions(validQuestions);
        const initialStatus = {};
        validQuestions.forEach((_, i) => { initialStatus[i] = 'not_visited'; });
        if(validQuestions.length > 0) initialStatus[0] = 'not_answered';
        setStatus(initialStatus);
        setLoading(false);
      },
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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600 animate-pulse uppercase tracking-widest italic">SNP Portal Loading...</div>;

  // --- RESULT VIEW WITH DETAILED ANSWER SHEET ---
  if (isSubmitted) {
    const pieData = [
      { name: 'Correct', value: resultData.correct, color: '#22c55e' },
      { name: 'Wrong', value: resultData.incorrect, color: '#ef4444' },
      { name: 'Skip', value: resultData.unattended, color: '#94a3b8' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          {/* Performance Summary */}
          <div className="bg-white rounded-3xl shadow-sm border p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
               <h2 className="text-3xl font-black text-slate-800 tracking-tight">ANALYSIS REPORT</h2>
               <p className="text-sm font-bold text-blue-600 uppercase">Test ID: {testId}</p>
            </div>
            <div className="flex gap-6 mt-6 md:mt-0">
               <div className="text-center">
                  <p className="text-3xl font-black text-blue-600">{score}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
               </div>
               <div className="text-center border-l pl-6">
                  <p className="text-3xl font-black text-slate-800">{questions.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
               </div>
               <div className="text-center border-l pl-6">
                  <p className="text-3xl font-black text-green-500">{Math.round((score/questions.length)*100)}%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success</p>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border mb-8 h-80">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                   </Pie>
                   <Tooltip />
                   <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </div>

          {/* DETAILED REVIEW SECTION */}
          <h3 className="text-xl font-black text-slate-800 mb-6 px-2 uppercase italic border-l-4 border-blue-600 pl-4">Review Your Answers</h3>
          
          <div className="space-y-6 mb-10">
            {questions.map((q, i) => (
              <div key={i} className={`bg-white rounded-2xl border-l-8 shadow-sm p-6 transition-all ${
                !answers[i] ? 'border-l-slate-300' : 
                answers[i] === q.correctAnswer ? 'border-l-green-500' : 'border-l-red-500'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Question {i + 1}</span>
                  {answers[i] === q.correctAnswer ? 
                    <span className="text-green-600 font-black text-[10px] bg-green-50 px-2 py-1 rounded italic uppercase">Correct</span> : 
                    !answers[i] ? <span className="text-slate-400 font-black text-[10px] bg-slate-50 px-2 py-1 rounded italic uppercase">Skipped</span> : 
                    <span className="text-red-500 font-black text-[10px] bg-red-50 px-2 py-1 rounded italic uppercase">Incorrect</span>
                  }
                </div>

                <p className="font-bold text-slate-800 text-base mb-6 leading-relaxed">
                  {q?.[`q_${lang}`]}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Selection */}
                  <div className={`p-4 rounded-xl border-2 ${
                    !answers[i] ? 'bg-slate-50 border-slate-100' : 
                    answers[i] === q.correctAnswer ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                  }`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Your Response</p>
                    <p className="font-bold text-sm">
                        {answers[i] ? `${answers[i]}. ${q?.[`${answers[i].toLowerCase()}_${lang}`]}` : 'Not Answered'}
                    </p>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
                    <p className="text-[9px] font-black text-green-400 uppercase mb-2">Correct Answer</p>
                    <p className="font-bold text-sm text-green-800">
                      {q.correctAnswer}. {q?.[`${q.correctAnswer.toLowerCase()}_${lang}`]}
                    </p>
                  </div>
                </div>

                {q.explanation && (
                  <div className="mt-5 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-600 italic">
                    <span className="font-black text-blue-600 not-italic uppercase mr-2 underline">Note:</span> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={() => window.location.href='/'} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-all uppercase tracking-widest shadow-xl mb-20">Close Analysis</button>
        </div>
      </div>
    );
  }

  // --- MAIN EXAM UI ---
  const q = questions[currentQ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans select-none relative">
      
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-[100]">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-black text-sm tracking-tighter">SNP</div>
          <span className="hidden sm:inline text-[10px] font-bold uppercase text-slate-400 border-l pl-2">{testId}</span>
        </div>
        <div className="flex items-center gap-3">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-slate-100 text-[10px] font-black px-3 py-1.5 rounded-full border-none outline-none uppercase shadow-inner">
            <option value="hi">Hindi</option><option value="en">English</option><option value="hg">Hinglish</option>
          </select>
          <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-mono font-black text-sm shadow-lg">
            {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Question Panel */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden border-r">
          <div className="bg-slate-50/50 px-6 py-2 border-b text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>+1.0 Correct | -0.0 Wrong</span>
          </div>
          
          <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-10 leading-snug">
                {q?.[`q_${lang}`]}
                </h2>
                <div className="space-y-4">
                {['a', 'b', 'c', 'd'].map(opt => (
                    <label key={opt} className={`group flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${answers[currentQ] === opt.toUpperCase() ? 'bg-blue-50 border-blue-600 shadow-md ring-1 ring-blue-600' : 'hover:bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                    <input type="radio" checked={answers[currentQ] === opt.toUpperCase()} onChange={() => setAnswers({...answers, [currentQ]: opt.toUpperCase()})} className="hidden" />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQ] === opt.toUpperCase() ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white'}`}>
                        {answers[currentQ] === opt.toUpperCase() && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className={`text-sm font-black ${answers[currentQ] === opt.toUpperCase() ? 'text-blue-600' : 'text-slate-300'}`}>{opt.toUpperCase()}.</span>
                    <span className="text-sm md:text-base font-semibold text-slate-700">{q?.[`${opt}_${lang}`]}</span>
                    </label>
                ))}
                </div>
            </div>
          </div>
          
          {/* Controls */}
          <footer className="p-4 bg-white border-t flex justify-between items-center px-6 lg:px-12">
            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Previous</button>
            <div className="flex gap-4">
                <button onClick={() => setAnswers({...answers, [currentQ]: null})} className="hidden md:block text-[10px] font-black text-red-400 uppercase hover:text-red-600">Clear</button>
                <button onClick={handleSaveAndNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all transform active:scale-95">Save & Next</button>
            </div>
          </footer>
        </div>

        {/* SIDEBAR PALETTE (Desktop default, Mobile hidden) */}
        <div className={`
          fixed lg:relative top-0 right-0 h-full lg:h-auto z-[110] lg:z-0
          w-72 md:w-80 bg-slate-50 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out border-l
          ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          <div className="p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">YS</div>
                    <div><p className="font-black text-xs text-slate-800 leading-none mb-1 uppercase">Candidate</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Mock Series #01</p></div>
                </div>
                <button onClick={() => setIsPaletteOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-400 font-bold shadow-sm">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
                <p className="text-[10px] font-black text-slate-300 uppercase mb-4 tracking-widest">Question Palette</p>
                <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => (
                    <button 
                    key={i} 
                    onClick={() => { setCurrentQ(i); setIsPaletteOpen(false); }} 
                    className={`h-10 w-10 rounded-xl font-black text-[11px] transition-all flex items-center justify-center border-2 ${currentQ === i ? 'border-blue-600 ring-2 ring-blue-100 bg-white text-blue-600' : status[i] === 'answered' ? 'bg-green-500 border-green-500 text-white shadow-md' : status[i] === 'not_answered' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                    {i + 1}
                    </button>
                ))}
                </div>
            </div>

            <button onClick={calculateScore} className="mt-6 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all">Submit Final Exam</button>
          </div>
        </div>

        {/* Mobile Backdrop */}
        {isPaletteOpen && (
          <div onClick={() => setIsPaletteOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[105]" />
        )}
      </div>

      {/* Floating Toggle Button (Mobile Only) */}
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
  return <Suspense fallback={<div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse text-sm uppercase">Loading Secure Portal...</div>}><TestContent /></Suspense>;
}
