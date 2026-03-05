// References to help setup Supabase and React integration:
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import { Routes, Route, Link } from 'react-router-dom';
import { Users, Code2, Monitor } from 'lucide-react';
import HomeView from '@/HomeView.jsx';
import Form from '@/Form.jsx';
import ReviewPage from '@/ReviewPage.jsx';
import Header from '@/Header.jsx';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* --- TOP NAVIGATION BAR --- */}
      <Header />
      {/* --- PERSISTENT HEADER --- */}
      <header className="py-6 sm:py-10 bg-secondary">
        <h1 className="text-center font-heading">
          <Link to="/" className="inline-block hover:scale-[1.02] transition-transform">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-foreground">Project Experience </span>
              <span className="text-primary">Explorer</span>
            </span>
          </Link>
        </h1>
        <div className="flex justify-center gap-4 mt-2 sm:mt-4 text-muted-fg">
          <Users size={22} />
          <Code2 size={22} />
          <Monitor size={22} />
        </div>
        <p className="text-center text-sm sm:text-base text-muted-fg mt-2 sm:mt-3 max-w-md mx-auto">
          Browse real student reviews of current OSU capstone projects.
        </p>
      </header>
      {/* --- DYNAMIC CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 py-8">
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
