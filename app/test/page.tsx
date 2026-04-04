"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Papa from "papaparse";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Legend, CartesianGrid 
} from 'recharts';

function TestContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("id") || "gandhi_era";

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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600 animate-pulse">LOADING TEST...</div>;

  // --- RESULT VIEW (Compact) ---
  if (isSubmitted) {
    const pieData = [
      { name: 'Correct', value: resultData.correct, color: '#22c55e' },
      { name: 'Wrong', value: resultData.incorrect, color: '#ef4444' },
      { name: 'Skip', value: resultData.unattended, color: '#94a3b8' },
    ];
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between border-b-4 border-blue-600">
            <div>
               <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Exam Analysis</h2>
               <p className="text-xs font-bold text-slate-400">TEST ID: {testId.toUpperCase()}</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
               <div className="text-center px-6 py-2 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-2xl font-black text-blue-600">{score}/{questions.length}</p>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Total Score</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
             <div className="bg-white p-6 rounded-2xl shadow-md h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={50} outerRadius={70} dataKey="value">
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-md overflow-y-auto h-72 scrollbar-hide">
                <table className="w-full text-xs text-left">
                   <thead className="bg-slate-50 sticky top-0">
                      <tr><th className="p-2">Q.</th><th className="p-2">Ans</th><th className="p-2">Yours</th><th className="p-2 text-right">Result</th></tr>
                   </thead>
                   <tbody>
                      {questions.map((q, i) => (
                        <tr key={i} className="border-b">
                           <td className="p-2 font-bold">{i+1}</td>
                           <td className="p-2"><span className="text-green-600 font-bold">{q.correctAnswer}</span></td>
                           <td className="p-2 font-bold">{answers[i] || '-'}</td>
                           <td className="p-2 text-right">{answers[i] === q.correctAnswer ? '✅' : !answers[i] ? '⚪' : '❌'}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
          <button onClick={() => window.location.href='/'} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition-all uppercase tracking-widest text-sm shadow-lg">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  // --- COMPACT EXAM INTERFACE ---
  const q = questions[currentQ];
  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans select-none text-slate-800">
      {/* Mini Header */}
      <header className="bg-white border-b px-4 py-2 flex justify-between items-center shadow-sm z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white px-2 py-1 rounded font-black text-xs">SNP</div>
          <span className="text-[11px] font-black uppercase tracking-tighter text-slate-500">{testId}</span>
        </div>
        <div className="flex items-center gap-3">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-slate-100 text-[10px] font-bold px-2 py-1 rounded border-none outline-none uppercase">
            <option value="hi">Hindi</option><option value="en">English</option><option value="hg">Hinglish</option>
          </select>
          <div className="bg-slate-900 text-white px-3 py-1 rounded-lg font-mono font-bold text-sm">
            {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Question Area (Clean & Focused) */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden border-r">
          <div className="bg-slate-50 px-6 py-2 border-b text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
            <span>Question Number: {currentQ + 1}</span>
            <span>Marks: +1, -0.0</span>
          </div>
          <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
            <p className="text-lg md:text-xl font-bold text-slate-800 mb-8 leading-relaxed">
              {q?.[`q_${lang}`]}
            </p>
            <div className="space-y-3 max-w-3xl">
              {['a', 'b', 'c', 'd'].map(opt => (
                <label key={opt} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${answers[currentQ] === opt.toUpperCase() ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'hover:bg-slate-50 border-slate-200'}`}>
                  <input type="radio" checked={answers[currentQ] === opt.toUpperCase()} onChange={() => setAnswers({...answers, [currentQ]: opt.toUpperCase()})} className="accent-blue-600 w-4 h-4" />
                  <span className={`text-sm font-black ${answers[currentQ] === opt.toUpperCase() ? 'text-blue-600' : 'text-slate-400'}`}>{opt.toUpperCase()}.</span>
                  <span className="text-sm font-semibold text-slate-700">{q?.[`${opt}_${lang}`]}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Action Footer (Sticky) */}
          <div className="p-4 bg-white border-t flex justify-between gap-4">
            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-xs text-slate-500 hover:bg-slate-50">PREVIOUS</button>
            <button onClick={handleSaveAndNext} className="px-10 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-md transition-all">Save & Next</button>
          </div>
        </div>

        {/* Right: Palette (TCS Style) */}
        <div className="w-full lg:w-72 bg-slate-50 p-4 flex flex-col shrink-0 border-l overflow-y-auto">
          <div className="bg-white p-3 rounded-xl border mb-4 flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">YS</div>
             <div className="leading-none"><p className="font-bold text-xs text-slate-800">Candidate Name</p><p className="text-[10px] text-slate-400 font-bold uppercase">Mock Exam</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
             <div className="bg-white p-2 rounded border flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Answered</span></div>
             <div className="bg-white p-2 rounded border flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Skipped</span></div>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)} className={`h-8 w-8 rounded-md font-bold text-[10px] transition-all flex items-center justify-center border ${currentQ === i ? 'ring-2 ring-blue-600 border-transparent' : ''} ${status[i] === 'answered' ? 'bg-green-500 text-white' : status[i] === 'not_answered' ? 'bg-red-500 text-white' : 'bg-white text-slate-400'}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={calculateScore} className="mt-auto bg-red-600 text-white py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-md">Submit Test</button>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold">PORTAL LOADING...</div>}><TestContent /></Suspense>;
}