export default function App() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-4xl font-extrabold text-cyan-400 tracking-tight">
        Sprint 1: Mobile Web App
      </h1>
      <p className="text-slate-300 text-lg">
        Tailwind is working. Ready to build mock screens!
      </p>
      <button 
        type="button" 
        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-slate-950 font-semibold rounded-lg shadow-md transition-all cursor-pointer"
        onClick={() => alert('Dynamic click works!')}
      >
        Test Dynamic Button
      </button>
    </main>
  );
}