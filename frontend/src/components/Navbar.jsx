import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  const [activeSection, setActiveSection] = useState('platform');

  useEffect(() => {
    if (!isLanding) {
      setActiveSection('');
      return;
    }

    const sections = ['platform', 'architecture', 'verification', 'fraud-detection'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
      }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isLanding]);

  const NavLink = ({ to, sectionId, children }) => {
    const isActive = activeSection === sectionId;
    
    const content = (
      <span className="relative z-10 px-4 py-1.5">{children}</span>
    );

    const pill = isActive && (
      <motion.div
        layoutId="navPill"
        className="absolute inset-0 rounded-full z-0"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 0 20px rgba(139,92,246,0.2)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    );

    if (to.startsWith('#')) {
      const href = isLanding ? to : `/${to}`;
      return (
        <a 
          href={href} 
          className={`relative flex items-center justify-center transition-all duration-300 font-bold text-[13px] tracking-wide rounded-full px-1 ${
            isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
          onClick={(e) => {
            if (isLanding) {
              e.preventDefault();
              const element = document.getElementById(sectionId);
              if (element) {
                 element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                 setActiveSection(sectionId);
              }
            }
          }}
        >
          {pill}
          {content}
        </a>
      );
    }
    return (
      <a href={to} className="relative flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 font-bold text-sm">
        <span className="relative z-10 px-4 py-1.5">{children}</span>
      </a>
    );
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto w-[92%] max-w-[1500px] h-[64px] rounded-full flex items-center px-6 relative transition-all"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 0 40px rgba(99,102,241,0.1), 0 10px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 group w-max">
            <Brain className="w-5 h-5 text-white group-hover:text-[#8B5CF6] transition-colors" />
            <span className="font-bold tracking-tight text-white hidden sm:block">TalentForge AI</span>
          </Link>
        </div>
        
        {/* Centered Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 text-sm absolute left-1/2 -translate-x-1/2">
          <NavLink to="#platform" sectionId="platform">Platform</NavLink>
          <NavLink to="#architecture" sectionId="architecture">Architecture</NavLink>
          <NavLink to="#verification" sectionId="verification">Verification</NavLink>
          <NavLink to="#fraud-detection" sectionId="fraud-detection">Fraud Detection</NavLink>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 transition-colors">Sign In</Link>
              <Link to="/register" className="bg-[#6366F1]/20 border border-[#6366F1]/50 hover:bg-[#6366F1] text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                Get Started
              </Link>
            </>
          ) : (
            <Link to={user.role === 'student' ? '/dashboard' : '/recruiter'} className="bg-[#6366F1]/20 border border-[#6366F1]/50 hover:bg-[#6366F1] text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              Dashboard
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
