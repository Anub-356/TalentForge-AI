import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit, ArrowRight, Github, Code, Globe,
  ShieldCheck, TriangleAlert, Users, Trophy, Briefcase, UserCheck, 
  BarChart2, Copy, Clock, AlertTriangle, Mic, Menu, FileText, BarChart3, Shield
} from 'lucide-react';

import './Landing.css';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('platform');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    const sections = document.querySelectorAll("section");
    const handleScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute("id");
        }
      });
      if (current) setActiveNav(current);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="landing-wrapper">

<nav className="navbar" id="navbar">
  <a href="#platform" className="navbar-logo">
    <BrainCircuit className="lucide" style={{color: 'var(--indigo-bright)'}} />
    <span className="navbar-logo-text">TalentForge AI</span>
  </a>
  <div className="navbar-nav" id="nav-links">
    <a href="#platform" className={`nav-link ${activeNav === 'platform' ? 'active-platform' : ''}`}>Platform</a>
    <a href="#arch" className={`nav-link ${activeNav === 'arch' ? 'active-arch' : ''}`}>Architecture</a>
    <a href="#vf" className={`nav-link ${activeNav === 'vf' ? 'active-verify' : ''}`}>Verification</a>
    <a href="#workspace" className={`nav-link ${activeNav === 'workspace' ? 'active-workspace' : ''}`}>Intelligence</a>
  </div>
  <div className="navbar-actions">
    <Link to="/login" className="btn-signin">Sign In</Link>
    <Link to="/register" className="btn-getstarted">Get Started</Link>
    <button className="mobile-menu-btn" onClick={() => toggleMenu()}><Menu className="lucide" /></button>
  </div>
</nav>

<main>
  {/* SECTION 1: HERO */}
  <section id="platform" className="reveal">
    <div className="platform-hero">
      <div className="hero-left">
        <div className="hero-company-name">
          <span className="text-white">Talent</span><span className="text-gradient">Forge AI</span>
        </div>
        
        <p className="hero-subtitle">Stop Hiring on Keywords.<br/>Start Hiring on Verified Output.</p>
        
        <p className="hero-body">
          Verify technical claims.<br/>
          Detect hiring fraud.<br/>
          Generate explainable trust scores.<br/><br/>
          Built for engineering teams that hire on evidence, not assumptions.
        </p>
        
        <div className="hero-metrics">
          <div className="metric-col">
            <Users className="lucide metric-icon" style={{color: '#a855f7'}} />
            <div className="metric-text">
              <span className="m-val">50+</span>
              <span className="m-lbl">SOURCES</span>
              <span className="m-desc">Trusted Talent Sources</span>
            </div>
          </div>
          <div className="metric-col">
            <BrainCircuit className="lucide metric-icon" style={{color: '#3b82f6'}} />
            <div className="metric-text">
              <span className="m-val">5</span>
              <span className="m-lbl">ENGINES</span>
              <span className="m-desc">Verification Engines</span>
            </div>
          </div>
          <div className="metric-col">
            <Globe className="lucide metric-icon" style={{color: '#3b82f6'}} />
            <div className="metric-text">
              <span className="m-val">CROSS</span>
              <span className="m-lbl">PLATFORM</span>
              <span className="m-desc">Evidence Verification</span>
            </div>
          </div>
        </div>

        <div className="hero-ctas">
          <Link to="/register" className="cta-primary">Deploy Intelligence <ArrowRight className="lucide" style={{width: '16px', height: '16px'}} /></Link>
          <a href="#arch" className="cta-secondary">View Architecture <ArrowRight className="lucide" style={{width: '16px', height: '16px'}} /></a>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 2: ACTUAL ARCHITECTURE PIPELINE */}
  <section id="arch" className="reveal" style={{paddingTop: '60px'}}>
    <div className="arch-hero reveal" style={{transitionDelay: '0.1s'}}>
      <h1 className="arch-title">HOW TALENTFORGE <span className="highlight">WORKS</span></h1>
      <p className="arch-subtitle">From raw candidate data to recruiter-ready hiring intelligence.</p>
    </div>

    <div className="pipe reveal" id="pipe" style={{transitionDelay: '0.2s'}}>
      <div className="pn" id="p0">
        <div className="pico pi-i"><Users className="lucide"/></div>
        <div>
          <div className="plbl">1. Candidate Data</div>
          <div className="psub">Resume • GitHub • LinkedIn • Projects • Assessments</div>
        </div>
      </div>
      
      <div className="parr" id="a0">↓</div>

      <div className="pn pn-c" id="p1" style={{borderColor: 'rgba(59, 130, 246, 0.4)', background: 'rgba(59, 130, 246, 0.05)'}}>
        <div className="pico pi-c" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa'}}><BarChart2 className="lucide"/></div>
        <div>
          <div className="plbl">2. Signal Extraction</div>
          <div className="psub">Technical Skills • Experience • Projects • Behavior</div>
        </div>
      </div>
      
      <div className="parr" id="a1">↓</div>
      
      <div className="pn pn-a" id="p2">
        <div className="pico pi-a"><ShieldCheck className="lucide"/></div>
        <div>
          <div className="plbl">3. Evidence Verification</div>
          <div className="psub">Repository Validation • Assessment Matching • Experience Validation</div>
        </div>
      </div>
      
      <div className="parr" id="a2">↓</div>
      
      <div className="pn pn-f" id="p3" style={{borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.05)'}}>
        <div className="pico pi-f" style={{background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber-bright)'}}><TriangleAlert className="lucide"/></div>
        <div>
          <div className="plbl">4. Fraud Detection</div>
          <div className="psub">Keyword Stuffing • Timeline Analysis • Skill Inflation</div>
        </div>
      </div>
      
      <div className="parr" id="a3">↓</div>

      <div className="pn" id="p4" style={{borderColor: 'rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.05)'}}>
        <div className="pico" style={{background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc'}}><BrainCircuit className="lucide"/></div>
        <div>
          <div className="plbl">5. Trust Engine</div>
          <div className="psub">Trust Score • Evidence Ledger • Risk Assessment</div>
        </div>
      </div>

      <div className="parr" id="a4">↓</div>
      
      <div className="pn pn-y" id="p5">
        <div className="pico pi-y"><Trophy className="lucide"/></div>
        <div>
          <div className="plbl">6. Recruiter Intelligence</div>
          <div className="psub">Hiring Recommendation • Interview Intelligence • Explainable Ranking</div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 3 & 4: VERIFICATION & FRAUD */}
  <section id="vf" className="reveal">
    <div className="arch-hero reveal" style={{transitionDelay: '0.1s', paddingBottom: '20px'}}>
      <h1 className="arch-title">EVIDENCE & <span style={{color: 'var(--amber-bright)'}}>TRUST</span></h1>
      <p className="arch-subtitle">Continuous verification and automated risk assessment.</p>
    </div>

    <div className="vf-row reveal" style={{transitionDelay: '0.2s'}}>
      {/* VERIFICATION */}
      <div className="vcard">
        <h2 className="vc-tit"><ShieldCheck className="lucide" style={{color: 'var(--emerald-bright)'}} /> Evidence Verification Engine</h2>
        <div className="vc-items">
          <div className="vci"><Github className="lucide" style={{color: '#a855f7'}}/> <span>GitHub Validation</span></div>
          <div className="vci"><Code className="lucide" style={{color: '#60a5fa'}}/> <span>Project Verification</span></div>
          <div className="vci"><Briefcase className="lucide" style={{color: '#34d399'}}/> <span>Experience Validation</span></div>
          <div className="vci"><UserCheck className="lucide" style={{color: '#fbbf24'}}/> <span>Identity Verification</span></div>
        </div>
      </div>
      
      {/* FRAUD */}
      <div className="vcard">
        <h2 className="vc-tit"><TriangleAlert className="lucide" style={{color: 'var(--amber-bright)'}} /> Fraud Detection Engine</h2>
        <div className="vc-items">
          <div className="vci"><AlertTriangle className="lucide" style={{color: '#f87171'}}/> <span>Skill Inflation Detection</span></div>
          <div className="vci"><Copy className="lucide" style={{color: '#f87171'}}/> <span>Portfolio Plagiarism Detection</span></div>
          <div className="vci"><Clock className="lucide" style={{color: '#a855f7'}}/> <span>Timeline Analysis</span></div>
          <div className="vci"><Shield className="lucide" style={{color: '#34d399'}}/> <span>Identity Consistency</span></div>
        </div>
      </div>
    </div>
  </section>

  {/* SECTION 5: WORKSPACE (RECRUITER DASHBOARD) */}
  <section id="workspace" className="reveal">
    <div className="arch-hero reveal" style={{transitionDelay: '0.1s'}}>
      <h1 className="arch-title">RECRUITER INTELLIGENCE <span className="highlight">DASHBOARD</span></h1>
      <p className="arch-subtitle">The command center for evidence-based hiring decisions.</p>
    </div>
    
    <div className="bento reveal" style={{transitionDelay: '0.2s'}}>
      <div className="bm bm-l">
        <div className="bmi"><UserCheck className="lucide"/></div>
        <div className="bmt">Verified Profiles</div>
        <div className="bmd" style={{fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px'}}>247 <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>Reviewed</span></div>
      </div>
      <div className="bm">
        <div className="bmi"><ShieldCheck className="lucide"/></div>
        <div className="bmt">Average Trust Score</div>
        <div className="bmd" style={{fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px'}}>94%</div>
      </div>
      <div className="bm">
        <div className="bmi" style={{color: 'var(--amber-bright)', background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)'}}><TriangleAlert className="lucide"/></div>
        <div className="bmt">Risk Assessment</div>
        <div className="bmd" style={{fontSize: '28px', fontWeight: '800', color: 'var(--amber-bright)', marginTop: '8px'}}>Active</div>
      </div>
      <div className="bm bm-l">
        <div className="bmi"><FileText className="lucide"/></div>
        <div className="bmt">Evidence Reports</div>
        <div className="bmd" style={{fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px'}}>100% <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>Explainable</span></div>
      </div>
      <div className="bm bm-l">
        <div className="bmi"><Mic className="lucide"/></div>
        <div className="bmt">Interview Intelligence</div>
        <div className="bmd" style={{fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px'}}>Evidence-based questions</div>
      </div>
      <div className="bm">
        <div className="bmi" style={{color: 'var(--emerald-bright)', background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)'}}><Trophy className="lucide"/></div>
        <div className="bmt">Hiring Recommendations</div>
        <div className="bmd" style={{fontSize: '24px', fontWeight: '800', color: 'var(--emerald-bright)', marginTop: '8px'}}>Strong Hire</div>
      </div>
    </div>
  </section>

  {/* SECTION 6: CTA + WHY WE BUILT TALENTFORGE */}
  <section id="cta" className="reveal">
    <div className="cta-glass-panel" style={{maxWidth: '1000px'}}>
      <div className="cta-badge">✦ TalentForge AI</div>
      <h2 className="cta-headline">Ready to Hire on Evidence?</h2>
      
      <p className="cta-body" style={{marginBottom: '32px'}}>
        Replace assumptions with verified engineering evidence.<br/>
        Hire faster, reduce fraud, and make every technical hiring decision explainable.
      </p>

      {/* WHY WE BUILT TALENTFORGE TABLE */}
      <div style={{background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px 32px', margin: '0 auto 36px', textAlign: 'left', maxWidth: '800px'}}>
        <h3 style={{fontSize: '16px', fontWeight: '700', textAlign: 'center', marginBottom: '20px', color: '#fff', letterSpacing: '0.04em'}}>WHY WE BUILT TALENTFORGE AI</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px', fontWeight: '600', color: '#94a3b8', fontSize: '13px'}}>
          <div>TRADITIONAL ATS</div>
          <div style={{color: 'var(--indigo-bright)'}}>TALENTFORGE AI</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px', fontSize: '14px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={{color: '#f87171'}}>❌ Keyword Matching</div>
            <div style={{color: '#34d399', fontWeight: '600'}}>✅ Evidence Verification</div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={{color: '#f87171'}}>❌ Resume Claims</div>
            <div style={{color: '#34d399', fontWeight: '600'}}>✅ Technical Proof</div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={{color: '#f87171'}}>❌ Manual Screening</div>
            <div style={{color: '#34d399', fontWeight: '600'}}>✅ AI Trust Score</div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={{color: '#f87171'}}>❌ Black-box Ranking</div>
            <div style={{color: '#34d399', fontWeight: '600'}}>✅ Explainable Ranking</div>
          </div>
        </div>
      </div>
      
      <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
        <Link to="/register" className="cta-btn">Hire Better <ArrowRight className="lucide" style={{width: '18px', height: '18px'}} /></Link>
        <Link to="/register" className="cta-btn" style={{background: 'transparent', border: '1px solid var(--purple-light)', color: '#fff'}}>Book Demo</Link>
      </div>
    </div>
  </section>

  {/* PREMIUM ENTERPRISE FOOTER WITH NEURAL STARS */}
  <footer className="footer reveal" style={{
    position: 'relative',
    background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(88, 28, 135, 0.45), rgba(15, 23, 42, 0.95), #060913)',
    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
    padding: '70px 24px 50px',
    overflow: 'hidden'
  }}>
    {/* Subtle floating neural stars background */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(2px 2px at 30px 40px, rgba(255,255,255,0.4), rgba(0,0,0,0)), radial-gradient(2px 2px at 80px 90px, rgba(168,85,247,0.5), rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 30px, rgba(96,165,250,0.5), rgba(0,0,0,0)), radial-gradient(2.5px 2.5px at 220px 140px, rgba(255,255,255,0.25), rgba(0,0,0,0))',
      backgroundRepeat: 'repeat', backgroundSize: '250px 250px',
      opacity: 0.7, animation: 'floatNeuralStars 18s linear infinite'
    }} />
    <style>{`
      @keyframes floatNeuralStars {
        0% { transform: translateY(0px); opacity: 0.5; }
        50% { transform: translateY(-12px); opacity: 0.8; }
        100% { transform: translateY(0px); opacity: 0.5; }
      }
    `}</style>

    <div className="footer-logo" style={{position: 'relative', zIndex: 1}}>
      <BrainCircuit className="lucide" style={{color: 'var(--indigo-bright)'}} />
      <span className="footer-logo-text">TalentForge AI</span>
    </div>
    <p className="footer-tagline" style={{position: 'relative', zIndex: 1}}>Evidence-Based Hiring Intelligence Platform<br/>Trust Infrastructure for Technical Recruiting</p>
    <div className="footer-nav" style={{position: 'relative', zIndex: 1}}>
      <a href="#arch">Platform</a><span className="dot">·</span>
      <a href="#vf">Verification</a><span className="dot">·</span>
      <a href="#arch">Trust Layer</a><span className="dot">·</span>
      <a href="#workspace">Dashboard</a>
    </div>
  </footer>
</main>

    </div>
  );
}
