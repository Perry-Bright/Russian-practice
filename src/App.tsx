import { AppProvider } from './context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Config from './pages/Config';
import Test from './pages/Test';
import Review from './pages/Review';
import Layout from './components/Layout';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/config" element={<Config />} />
            <Route path="/test" element={<Test />} />
            <Route path="/review/:resultId" element={<Review />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
