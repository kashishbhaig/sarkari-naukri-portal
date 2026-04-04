export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 text-slate-800 bg-white my-10 shadow-sm border rounded-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black uppercase text-slate-900 italic tracking-tighter">About Our Mission</h1>
        <div className="w-20 h-2 bg-blue-600 mx-auto mt-2"></div>
      </div>
      
      <p className="text-lg font-medium mb-6 leading-relaxed">
        <strong>Sarkari Naukri Prayas (SNP)</strong> is a dedicated Ed-Tech platform designed to empower government job aspirants across India. Founded by <strong>Arrav Sir</strong>, we focus on delivering high-quality, TCS-pattern based mock tests for competitive exams like SSC, Railway, UP Police, and Bihar State Exams.
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-10">
        <div className="p-6 bg-slate-50 rounded-2xl border">
          <h3 className="font-black text-blue-600 uppercase mb-2">Our Expertise</h3>
          <p className="text-sm text-slate-600">Specialized content for Modern History, Indian Polity, and General Science, curated specifically for selection-oriented results.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border">
          <h3 className="font-black text-blue-600 uppercase mb-2">Technological Edge</h3>
          <p className="text-sm text-slate-600">Our portal provides a real-time exam simulation to help students overcome exam-hall anxiety and manage time effectively.</p>
        </div>
      </div>

      <p className="mb-6 font-medium">Since our inception, we have helped thousands of students through our YouTube channels (Exams Clear & Sarkari Naukri Prayas) and Telegram community (Mission Merit). This portal is our next step in making quality practice accessible to everyone for free.</p>
    </div>
  );
}
