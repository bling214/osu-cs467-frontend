// References to help setup Supabase and React integration: 
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import { Routes, Route, Link } from "react-router-dom";
import HomeView from "@/HomeView.jsx";
import Form from "@/Form.jsx";
import ReviewPage from "@/ReviewPage.jsx";

function App() {
return (
  <div className="min-h-screen bg-gray-50">
    {/* --- PERSISTENT HEADER --- */}
    <header className="py-16 bg-white border-b border-gray-100 mb-10">
      <h1 className="text-center">
        <Link to="/" className="inline-block hover:scale-[1.02] transition-transform">
          <span className="block text-7xl font-extrabold text-gray-900 leading-tight tracking-normal">
            Project Experience Explorer
          </span>
        </Link>
      </h1>
    </header>

    {/* --- DYNAMIC CONTENT --- */}
    <main className="max-w-6xl mx-auto px-4">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/form" element={<Form />} />
        <Route path="/review/:id" element={<ReviewPage />} /> 
      </Routes>
    </main>
  </div>
);
}

export default App;