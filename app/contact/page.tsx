export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 text-slate-800 bg-white my-10 shadow-sm border rounded-3xl text-center">
      <h1 className="text-3xl font-black mb-4 uppercase italic">Get In Touch</h1>
      <p className="text-slate-500 mb-12 font-medium uppercase tracking-widest text-xs">Aapki safalta, hamara prayas</p>
      
      <div className="max-w-md mx-auto space-y-4">
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Official Support</p>
          <p className="font-black text-xl text-slate-800">support@missionmerit.in</p>
        </div>
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Telegram Community</p>
          <p className="font-black text-xl text-slate-800">@missionmerit</p>
        </div>
      </div>
      
      <p className="mt-12 text-sm text-slate-400 font-medium italic">Note: We usually respond to all queries within 24-48 business hours.</p>
    </div>
  );
}
