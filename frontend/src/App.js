import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import FocusAreas from "@/pages/FocusAreas";
import GetInvolved from "@/pages/GetInvolved";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import KnowledgeCentre from "@/pages/KnowledgeCentre";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/AdminLogin";
import AdminBlogs from "@/pages/AdminBlogs";
import AdminBlogEditor from "@/pages/AdminBlogEditor";

function ChromeWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ChromeWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/focus-areas" element={<FocusAreas />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            {/* Knowledge Centre */}
            <Route path="/knowledge-centre" element={<KnowledgeCentre />} />
            <Route path="/blogs" element={<Navigate to="/knowledge-centre" replace />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />

            {/* Admin */}
            <Route path="/admin" element={<Navigate to="/admin/blogs" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/blogs/new" element={<AdminBlogEditor />} />
            <Route path="/admin/blogs/:id" element={<AdminBlogEditor />} />
          </Routes>
        </ChromeWrapper>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
