import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Radio, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation des vagues
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let t = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const drawWaves = () => {
      ctx.clearRect(0, 0, W, H);
      const waves = [
        { y: H * 0.25, amp: 18, freq: 0.008, speed: 0.008, color: '#007A8A' },
        { y: H * 0.45, amp: 24, freq: 0.006, speed: 0.006, color: '#00C8D8' },
        { y: H * 0.65, amp: 16, freq: 0.010, speed: 0.009, color: '#007A8A' },
        { y: H * 0.82, amp: 20, freq: 0.007, speed: 0.007, color: '#0A2A42' },
      ];

      waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, w.y);
        for (let x = 0; x <= W; x += 4) {
          const y = w.y + Math.sin(x * w.freq + t * w.speed * 60) * w.amp;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      t += 0.015;
      requestAnimationFrame(drawWaves);
    };

    window.addEventListener('resize', resize);
    resize();
    drawWaves();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="min-h-screen bg-[#071824] text-[#E0F4F8] font-light overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
        body { font-family: 'Jost', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .animate-fade-up { animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #071824; }
        ::-webkit-scrollbar-thumb { background: #007A8A; border-radius: 2px; }
      `}</style>

      {/* Canvas de vagues en arrière-plan */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.18] z-0"
      />

      {/* Header */}
      <header className="relative z-10">
        {/* Bandes tricolores */}
        <div className="flex h-[5px]">
          <span className="flex-1 bg-[#007A8A]" />
          <span className="flex-1 bg-[#00C8D8]" />
          <span className="flex-1 bg-[#FF4D8F]" />
        </div>

        {/* Top bar */}
        <div className="flex justify-between items-center px-6 md:px-12 pt-7">
          <div className="font-serif text-[13px] font-bold tracking-[6px] text-[#00C8D8] uppercase">
            Waves Festival
          </div>
          <div className="hidden lg:block text-[11px] tracking-[3px] text-[#4A8898] font-normal">
            17 — 19 Juillet 2026 · Plufur, Bretagne
          </div>
          {/* Burger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#00C8D8] p-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation tabs - Desktop */}
        <nav className="hidden lg:flex gap-0 px-6 md:px-12 pt-6 border-b border-[#1A3A4A] relative z-10">
          {['home', 'surplace', 'camping', 'covoiturage', 'lineup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-3 text-[11px] tracking-[4px] font-medium uppercase transition-all border-b-2 relative -mb-[1px] ${
                activeTab === tab
                  ? 'text-[#00C8D8] border-[#00C8D8]'
                  : 'text-[#4A8898] border-transparent hover:text-[#E0F4F8]'
              }`}
            >
{tab === 'home' ? 'Infos pratiques' : tab === 'surplace' ? 'Bouffe & boissons' : tab === 'camping' ? 'Plan & camping' : tab === 'covoiturage' ? 'Covoiturage' : 'Lineup'}
            </button>
          ))}
        </nav>

        {/* Navigation menu - Mobile/Tablet */}
        {mobileMenuOpen && (
          <nav className="lg:hidden px-6 pt-4 pb-6 border-b border-[#1A3A4A] bg-[#071824]">
            {['home', 'surplace', 'camping', 'covoiturage', 'lineup'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-[11px] tracking-[4px] font-medium uppercase transition-all rounded-lg ${
                  activeTab === tab
                    ? 'text-[#00C8D8] bg-[#00C8D8]/10'
                    : 'text-[#4A8898] hover:text-[#E0F4F8] hover:bg-[#1A3A4A]/50'
                }`}
              >
{tab === 'home' ? 'Infos pratiques' : tab === 'surplace' ? 'Bouffe & boissons' : tab === 'camping' ? 'Plan & camping' : tab === 'covoiturage' ? 'Covoiturage' : 'Lineup'}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Pages */}
      <main className="relative z-5">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'surplace' && <SurPlacePage />}
        {activeTab === 'camping' && <CampingPage />}
        {activeTab === 'covoiturage' && <CovoituragePage />}
        {activeTab === 'lineup' && <LineupPage />}
      </main>

      {/* Footer */}
      <footer className="relative z-5 px-6 md:px-12 py-10 border-t border-[#1A3A4A]">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="font-serif text-xl font-bold text-[#00C8D8] tracking-[2px]">
            Waves Festival
          </div>
          <div className="flex flex-col gap-2 text-[11px] tracking-[2px] text-[#4A8898]">
            <div>Plufur · Bretagne · 17-19 Juillet 2026 · Accès privé</div>
            <div className="flex flex-wrap gap-6">
              <div>
                <span className="text-[#00C8D8]">Paulo :</span> 07.78.32.82.11
              </div>
              <div>
                <span className="text-[#00C8D8]">Lola :</span> 06.51.89.77.49
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const festivalDate = new Date('2026-07-17T19:00:00').getTime();
      const now = new Date().getTime();
      const difference = festivalDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-up px-6 md:px-12 pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-[clamp(52px,8vw,96px)] font-bold leading-[0.95] mb-2 text-[#E0F4F8]">
            Waves<br />
            <em className="text-[#00C8D8] italic">Festival</em>
          </h1>
          <p className="font-serif text-xl italic text-[#4A8898] mb-6">
            Lola et Paul · Festival d'anniversaire
          </p>
          <p className="text-[15px] leading-[1.8] opacity-75 max-w-[560px] mx-auto mb-8">
            Trois jours, deux nuits, une scène. Une maison de vacances bretonne transformée en mini-festival pour fêter les 25 ans et les 27 ans comme il se doit.
          </p>

          {/* Compte à rebours */}
          <div className="mb-8">
            <h3 className="text-center text-[11px] tracking-[5px] text-[#007A8A] font-medium uppercase mb-8">
              ✦ Compte à rebours
            </h3>
            <div className="bg-gradient-to-br from-[#091F2E] to-[#0A2A3A] border-2 border-[#00C8D8]/30 rounded-2xl p-6 max-w-[600px] mx-auto">
              <div className="flex justify-center items-center gap-2">
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-[#00C8D8]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] tracking-[2px] text-[#4A8898] font-medium uppercase mt-1">
                    Jours
                  </div>
                </div>
                <span className="font-serif text-4xl text-[#4A8898] opacity-50 mb-4">:</span>
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-[#FF4D8F]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] tracking-[2px] text-[#4A8898] font-medium uppercase mt-1">
                    Heures
                  </div>
                </div>
                <span className="font-serif text-4xl text-[#4A8898] opacity-50 mb-4">:</span>
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-[#F6CC45]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] tracking-[2px] text-[#4A8898] font-medium uppercase mt-1">
                    Minutes
                  </div>
                </div>
                <span className="font-serif text-4xl text-[#4A8898] opacity-50 mb-4">:</span>
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-[#5DB87E]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] tracking-[2px] text-[#4A8898] font-medium uppercase mt-1">
                    Secondes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info grid - Plus grande et centrée */}
        <h3 className="text-center text-[11px] tracking-[5px] text-[#007A8A] font-medium uppercase mb-8">
          ✦ À retenir
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            { label: 'Dates', value: '17–19\nJuillet 2026', color: '#007A8A', Icon: Calendar, link: null },
            { label: 'Lieu', value: 'Morin, Plufur\nBretagne', color: '#FF4D8F', Icon: MapPin, link: 'https://www.google.com/maps/place/Morin,+22310+Plufur/@48.5924785,-3.582648,15z/data=!3m1!4b1!4m6!3m5!1s0x48117ec8bd898feb:0xa9bf00dd46603f6b!8m2!3d48.592479!4d-3.582648!16s%2Fg%2F1tqtx8pg?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D' },
            { label: 'Format', value: '3 jours\n2 nuits', color: '#F6CC45', Icon: Clock, link: null },
            { label: 'Scène', value: '1 scène\nintérieure', color: '#5DB87E', Icon: Radio, link: null }
          ].map((info, idx) => {
            const content = (
              <div className="flex flex-col items-center text-center gap-3">
                <info.Icon className="w-10 h-10 opacity-70" style={{ color: info.color }} />
                <div>
                  <div className="text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                    {info.label}
                  </div>
                  <div className="font-serif text-[24px] font-bold text-[#E0F4F8] leading-[1.2] whitespace-pre-line">
                    {info.value}
                  </div>
                </div>
              </div>
            );

            return info.link ? (
              <a
                key={idx}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#091F2E] p-6 rounded-lg border-2 border-[#1A3A4A] hover:border-opacity-60 transition-all cursor-pointer"
                style={{ borderColor: info.color + '40' }}
              >
                {content}
              </a>
            ) : (
              <div key={idx} className="bg-[#091F2E] p-6 rounded-lg border-2 border-[#1A3A4A] hover:border-opacity-60 transition-all" style={{ borderColor: info.color + '40' }}>
                {content}
              </div>
            );
          })}
        </div>

        {/* L'essentiel */}
        <div className="bg-[#F6CC451F] border-l-[3px] border-[#F6CC45] p-6 rounded-r">
          <p className="text-[13px] leading-[1.7] opacity-80">
            <strong className="text-[#F6CC45] font-medium">L'essentiel :</strong> Personne dans les maisons, tout le monde dehors. Waves Festival est un festival privé qui va se dérouler chez papi Michel et chez maman Charlotte Desoblin, donc cette règle est à respecter pour que Paulo ne soit pas déshérité.
          </p>
        </div>
      </div>
    </div>
  );
}

function SurPlacePage() {
  return (
    <div className="animate-fade-up px-6 md:px-12 py-16 pb-20">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-serif text-5xl font-bold text-[#E0F4F8] mb-3 leading-[1.1]">
          Bouffe<em className="text-[#00C8D8] italic"> & boissons</em>
        </h2>
        <p className="text-sm text-[#4A8898] leading-[1.7] mb-12">
          Tout ce qu'il faut savoir pour bien manger et bien boire ce week-end
        </p>

        <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            num: '01',
            title: 'Nourriture',
            text: 'Prévois de quoi te nourrir tout le week-end. Pioche dans les tup de ta mère, on est sûrs que tu y trouveras ton bonheur pour te préparer tes meilleurs plats',
            color: '#00C8D8'
          },
          {
            num: '02',
            title: 'BBQ',
            text: 'BBQ à dispo. De la grosse côte de boeuf à la petite chipo, tout y est autorisé (même les poivrons grillés...)',
            color: '#FF4D8F'
          },
          {
            num: '03',
            title: 'Boissons',
            text: 'Boissons personnelles autorisées uniquement dans des bouteilles en plastique. Prépare tes meilleures potions et ramène tes écocups',
            color: '#F6CC45'
          }
        ].map((item) => (
          <div key={item.num} className="bg-[#091F2E] border-l-[3px] p-6 rounded-lg" style={{ borderLeftColor: item.color }}>
            <div className="flex items-baseline gap-3 mb-3">
              <div className="font-serif text-3xl font-bold opacity-30" style={{ color: item.color }}>
                {item.num}
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#E0F4F8]">
                {item.title}
              </h3>
            </div>
            <p className="text-sm leading-[1.7] opacity-75">
              {item.text}
            </p>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

function CampingPage() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleCheck = (index: number) => {
    setChecked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const columns = [
    {
      title: 'Dormir & camper',
      color: '#007A8A',
      items: [
        'Tente',
        'Sac de couchage et oreiller',
        'Tapis de sol ou matelas gonflable',
        'Lampe frontale ou petite lampe'
      ]
    },
    {
      title: 'Pratique & festif',
      color: '#F6CC45',
      items: [
        'Gourde réutilisable',
        'Tasse ou écocup',
        'Chargeur téléphone + batterie externe',
        'Tes culottes et ta brosse à dent... on ne va pas te faire la liste, t\'es grand maintenant'
      ]
    }
  ];

  let itemIndex = 0;

  return (
    <div className="animate-fade-up px-6 md:px-12 py-16 pb-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Plan */}
        <div className="mb-20">
          <h2 className="font-serif text-5xl font-bold text-[#E0F4F8] mb-3 leading-[1.1]">
            Plan du <em className="text-[#00C8D8] italic">site</em>
          </h2>
          <p className="text-sm text-[#4A8898] leading-[1.7] mb-12">
            Vue d'ensemble du festival — scènes, maisons, camping et parking
          </p>

          {/* Plan SVG */}
          <div className="bg-gradient-to-br from-[#0A2A3A] to-[#071824] border border-[#1A3A4A] rounded-xl p-2 md:p-8 mb-8">
            <svg viewBox="0 0 700 550" className="w-full h-auto min-h-[400px] md:min-h-0">
              {/* Fond terrain */}
              <path d="M 120 80 Q 150 60 200 70 Q 280 85 380 90 Q 480 95 560 110 Q 610 125 630 180 Q 640 250 620 330 Q 600 400 550 440 Q 480 480 390 490 Q 300 495 220 480 Q 150 460 120 400 Q 90 340 100 260 Q 105 180 120 80 Z"
                    fill="#0A4A5E" opacity="0.2" />

              {/* Route à gauche - organique */}
              <path d="M 40 120 Q 50 180 45 250 Q 42 320 48 390 Q 52 430 55 460 L 90 460 Q 85 400 88 340 Q 92 260 85 190 Q 80 130 75 100 Z"
                    fill="#1A7A8A" opacity="0.3" />

              {/* Espace Chill (rose) - forme organique en haut à gauche */}
              <ellipse cx="200" cy="120" rx="100" ry="75" fill="#FF4D8F" opacity="0.15" />
              <path d="M 120 120 Q 150 80 200 85 Q 250 90 280 110 Q 295 130 285 155 Q 270 175 230 180 Q 180 185 140 165 Q 110 145 120 120 Z"
                    fill="none" stroke="#FF4D8F" strokeWidth="5" opacity="0.9" />

              {/* Icône espace chill */}
              <circle cx="200" cy="120" r="8" fill="#FF4D8F" opacity="0.5" />
              <circle cx="185" cy="125" r="6" fill="#FF4D8F" opacity="0.4" />
              <circle cx="215" cy="125" r="6" fill="#FF4D8F" opacity="0.4" />

              <text x="200" y="150" textAnchor="middle" fill="#FF4D8F" fontSize="15" fontWeight="bold" fontFamily="serif">Espace Chill</text>

              {/* Maison (jaune) - ovale horizontal organique */}
              <g>
                <ellipse cx="270" cy="250" rx="110" ry="50" fill="#F6CC45" opacity="0.15" />
                <path d="M 180 245 Q 210 220 270 225 Q 340 230 370 250 Q 380 265 370 280 Q 340 295 270 290 Q 210 285 180 265 Q 170 255 180 245 Z"
                      fill="none" stroke="#F6CC45" strokeWidth="4" opacity="0.9" />

                {/* Icône maison simple */}
                <g transform="translate(270, 245)">
                  <polygon points="0,-8 -10,0 10,0" fill="#F6CC45" opacity="0.5" />
                  <rect x="-7" y="0" width="14" height="12" rx="1" fill="#F6CC45" opacity="0.5" />
                  <rect x="-3" y="4" width="3" height="4" fill="#F6CC45" opacity="0.3" />
                  <rect x="1" y="4" width="3" height="4" fill="#F6CC45" opacity="0.3" />
                </g>

                <text x="270" y="275" textAnchor="middle" fill="#F6CC45" fontSize="13" fontWeight="bold" fontFamily="serif">Maison</text>
              </g>

              {/* Scène Vague (cyan) - à droite de la maison, allongée vers le haut, décalée à gauche, réduite en largeur */}
              <g>
                <ellipse cx="410" cy="220" rx="45" ry="80" fill="#00C8D8" opacity="0.15" />
                <path d="M 375 195 Q 390 160 410 165 Q 435 170 450 200 Q 455 240 450 275 Q 435 300 410 295 Q 390 290 375 260 Q 368 225 375 195 Z"
                      fill="none" stroke="#00C8D8" strokeWidth="4" opacity="0.9" />

                {/* Icône scène */}
                <polygon points="410,200 400,215 420,215" fill="#00C8D8" opacity="0.6" />
                <rect x="397" y="215" width="26" height="3" fill="#00C8D8" opacity="0.6" />

                <text x="410" y="250" textAnchor="middle" fill="#00C8D8" fontSize="13" fontWeight="bold" fontFamily="serif">Scène Vague</text>
              </g>

              {/* Parking (vert clair) - forme organique en bas */}
              <ellipse cx="350" cy="410" rx="120" ry="60" fill="#5DB87E" opacity="0.15" />
              <path d="M 250 405 Q 280 380 350 385 Q 420 390 460 410 Q 475 425 465 445 Q 450 460 400 465 Q 330 468 270 450 Q 240 435 250 405 Z"
                    fill="none" stroke="#5DB87E" strokeWidth="5" opacity="0.9" />

              {/* Icônes voitures */}
              <g transform="translate(320, 405)">
                <rect x="0" y="0" width="20" height="12" rx="3" fill="#5DB87E" opacity="0.5" />
                <circle cx="5" cy="12" r="2" fill="#5DB87E" opacity="0.7" />
                <circle cx="15" cy="12" r="2" fill="#5DB87E" opacity="0.7" />
              </g>
              <g transform="translate(360, 410)">
                <rect x="0" y="0" width="20" height="12" rx="3" fill="#5DB87E" opacity="0.5" />
                <circle cx="5" cy="12" r="2" fill="#5DB87E" opacity="0.7" />
                <circle cx="15" cy="12" r="2" fill="#5DB87E" opacity="0.7" />
              </g>

              <text x="350" y="435" textAnchor="middle" fill="#5DB87E" fontSize="15" fontWeight="bold" fontFamily="serif">Parking</text>

              {/* Toilettes (violet) - au-dessus du camping */}
              <ellipse cx="530" cy="160" rx="50" ry="40" fill="#B565D8" opacity="0.15" />
              <path d="M 490 155 Q 510 135 530 138 Q 560 142 575 160 Q 580 175 570 185 Q 555 195 530 192 Q 505 188 490 170 Q 482 160 490 155 Z"
                    fill="none" stroke="#B565D8" strokeWidth="4" opacity="0.9" />

              {/* Icône toilettes */}
              <g transform="translate(530, 155)">
                <rect x="-8" y="-5" width="16" height="18" rx="2" fill="#B565D8" opacity="0.4" />
                <circle cx="0" cy="-12" r="4" fill="#B565D8" opacity="0.5" />
              </g>

              <text x="530" y="185" textAnchor="middle" fill="#B565D8" fontSize="13" fontWeight="bold" fontFamily="serif">Toilettes</text>

              {/* Camping (vert foncé) - forme organique à droite */}
              <ellipse cx="530" cy="310" rx="95" ry="135" fill="#2D5F3F" opacity="0.15" />
              <path d="M 510 210 Q 550 190 580 215 Q 610 245 615 300 Q 618 360 605 410 Q 590 450 560 465 Q 520 480 490 455 Q 465 425 460 370 Q 455 310 470 260 Q 485 225 510 210 Z"
                    fill="none" stroke="#2D5F3F" strokeWidth="5" opacity="0.9" />

              {/* Icônes tentes */}
              <g transform="translate(500, 290)">
                <polygon points="0,15 8,0 16,15" fill="#2D5F3F" opacity="0.5" />
                <line x1="8" y1="0" x2="8" y2="15" stroke="#2D5F3F" strokeWidth="0.5" opacity="0.7" />
              </g>
              <g transform="translate(540, 310)">
                <polygon points="0,15 8,0 16,15" fill="#2D5F3F" opacity="0.5" />
                <line x1="8" y1="0" x2="8" y2="15" stroke="#2D5F3F" strokeWidth="0.5" opacity="0.7" />
              </g>
              <g transform="translate(520, 350)">
                <polygon points="0,15 8,0 16,15" fill="#2D5F3F" opacity="0.5" />
                <line x1="8" y1="0" x2="8" y2="15" stroke="#2D5F3F" strokeWidth="0.5" opacity="0.7" />
              </g>

              {/* Arbres décoratifs */}
              <g transform="translate(460, 240)">
                <circle cx="0" cy="0" r="8" fill="#2D5F3F" opacity="0.4" />
                <rect x="-1.5" y="8" width="3" height="8" fill="#5DB87E" opacity="0.4" />
              </g>
              <g transform="translate(590, 370)">
                <circle cx="0" cy="0" r="6" fill="#2D5F3F" opacity="0.4" />
                <rect x="-1" y="6" width="2" height="6" fill="#5DB87E" opacity="0.4" />
              </g>

              <text x="530" y="335" textAnchor="middle" fill="#2D5F3F" fontSize="15" fontWeight="bold" fontFamily="serif">Camping</text>

             
            </svg>
          </div>

        </div>

        {/* Section Bagages */}
        <div>
          <h2 className="font-serif text-5xl font-bold text-[#E0F4F8] mb-2 leading-[1.1]">
            Camping<em className="text-[#00C8D8] italic"> & bagages</em>
          </h2>
          <p className="text-sm text-[#4A8898] leading-[1.7] mt-2 mb-10 italic">
            Tout ce qu'il faut savoir pour se sentir à l'aise pendant 3 jours. Ramène tes sardines, on t'a réservé un petit espace douillet pour poser ta tente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mb-12">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="bg-[#091F2E] p-7">
                <h3 className="text-[10px] tracking-[4px] font-semibold uppercase mb-5" style={{ color: col.color }}>
                  {col.title}
                </h3>
                {col.items.map((item) => {
                  const currentIndex = itemIndex++;
                  return (
                    <div
                      key={currentIndex}
                      onClick={() => toggleCheck(currentIndex)}
                      className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] text-[13px] opacity-80 leading-[1.5] cursor-pointer group"
                    >
                      <div className={`w-4 h-4 min-w-[16px] border rounded-[3px] mt-0.5 transition-all ${
                        checked.has(currentIndex)
                          ? 'bg-[#00C8D8] border-[#00C8D8]'
                          : 'border-[#1A3A4A] group-hover:border-[#00C8D8]'
                      }`} />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Point météo */}
          <div className="bg-[#091F2E] border border-[#1A3A4A] rounded-xl p-6 mt-12">
            <h3 className="text-[10px] tracking-[4px] text-[#00C8D8] font-semibold uppercase mb-3">
              Point météo
            </h3>
            <p className="text-sm text-[#E0F4F8] mb-1 italic">
              La Bretagne en juillet, c'est beau. Et humide...
            </p>
            <p className="text-xs text-[#4A8898] mb-6 italic">
              Données basées sur un doigt mouillé
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#071824] border border-[#1A3A4A] rounded-lg p-4 text-center">
                <div className="text-[9px] tracking-[3px] text-[#4A8898] font-medium uppercase mb-2">Jour</div>
                <div className="font-serif text-3xl font-bold text-[#F6CC45] mb-1">20-22°</div>
                <div className="text-[10px] text-[#4A8898]">max. normale</div>
              </div>

              <div className="bg-[#071824] border border-[#1A3A4A] rounded-lg p-4 text-center">
                <div className="text-[9px] tracking-[3px] text-[#4A8898] font-medium uppercase mb-2">Nuit</div>
                <div className="font-serif text-3xl font-bold text-[#00C8D8] mb-1">13°</div>
                <div className="text-[10px] text-[#4A8898]">min. normale</div>
              </div>

              <div className="bg-[#071824] border border-[#1A3A4A] rounded-lg p-4 text-center">
                <div className="text-[9px] tracking-[3px] text-[#4A8898] font-medium uppercase mb-2">Pluie</div>
                <div className="font-serif text-3xl font-bold text-[#FF4D8F] mb-1">3-8j</div>
                <div className="text-[10px] text-[#4A8898]">sur le mois</div>
              </div>

              <div className="bg-[#071824] border border-[#1A3A4A] rounded-lg p-4 text-center">
                <div className="text-[9px] tracking-[3px] text-[#4A8898] font-medium uppercase mb-2">Vent</div>
                <div className="font-serif text-2xl font-bold text-[#E0F4F8] mb-1">fréquent</div>
                <div className="text-[10px] text-[#4A8898]">côte atlantique</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CovoituragePage() {
  const [userType, setUserType] = useState<'conducteur' | 'passager' | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [selectedPassengerForJoin, setSelectedPassengerForJoin] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedDrivers, setExpandedDrivers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildDriversWithPassengers = (driversData: any[], passengersData: any[]) => {
    const normalizedPassengers = passengersData.map((p: any) => ({
      ...p,
      driverId: p.driver_id,
    }));

    return driversData.map((driver: any) => ({
      ...driver,
      lieuDepart: driver.lieu_depart,
      lieuArrivee: driver.lieu_arrivee,
      dateDepart: driver.date_depart,
      dateArrivee: driver.date_arrivee,
      heureDepart: driver.heure_depart,
      heureArrivee: driver.heure_arrivee,
      places: typeof driver.places === 'number' ? driver.places : parseInt(driver.places ?? '0', 10),
      passagers: normalizedPassengers.filter((p: any) => p.driverId === driver.id),
    }));
  };

  const loadCovoiturage = async () => {
    setLoading(true);
    setError(null);

    const [driversResult, passengersResult] = await Promise.all([
      supabase
        .from('covoiturage_drivers')
        .select('*')
        .order('date_depart', { ascending: true })
        .order('heure_depart', { ascending: true }),
      supabase.from('covoiturage_passengers').select('*'),
    ]);

    if (driversResult.error || passengersResult.error) {
      setError(driversResult.error?.message ?? passengersResult.error?.message ?? 'Impossible de charger les covoiturages.');
      setLoading(false);
      return;
    }

    const driversData = driversResult.data ?? [];
    const passengersData = passengersResult.data ?? [];

    setDrivers(buildDriversWithPassengers(driversData, passengersData));
    setPassengers(passengersData.map((p: any) => ({
      ...p,
      driverId: p.driver_id,
    })));
    setLoading(false);
  };

  useEffect(() => {
    loadCovoiturage();
  }, []);

  const handleDriverSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('covoiturage_drivers').insert([
      {
        nom: formData.get('nom')?.toString() ?? '',
        prenom: formData.get('prenom')?.toString() ?? '',
        instagram: formData.get('instagram')?.toString() ?? '',
        telephone: formData.get('telephone')?.toString() ?? '',
        date_depart: formData.get('dateDepart')?.toString() ?? '',
        heure_depart: formData.get('heureDepart')?.toString() ?? '',
        lieu_depart: formData.get('lieuDepart')?.toString() ?? '',
        date_arrivee: formData.get('dateArrivee')?.toString() ?? '',
        heure_arrivee: formData.get('heureArrivee')?.toString() ?? '',
        lieu_arrivee: formData.get('lieuArrivee')?.toString() ?? '',
        places: parseInt(formData.get('places')?.toString() ?? '0', 10),
      },
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    await loadCovoiturage();
    setUserType(null);
  };

  const handlePassengerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedDriverId = formData.get('driverId');

    const { error } = await supabase.from('covoiturage_passengers').insert([
      {
        nom: formData.get('nom')?.toString() ?? '',
        prenom: formData.get('prenom')?.toString() ?? '',
        instagram: formData.get('instagram')?.toString() ?? '',
        telephone: formData.get('telephone')?.toString() ?? '',
        driver_id: selectedDriverId ? parseInt(selectedDriverId.toString(), 10) : null,
      },
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    await loadCovoiturage();
    setUserType(null);
  };

  const joinDriver = async (driverId: number, passengerId: number) => {
    const { error } = await supabase
      .from('covoiturage_passengers')
      .update({ driver_id: driverId })
      .eq('id', passengerId);

    if (error) {
      setError(error.message);
      return;
    }

    await loadCovoiturage();
  };

  const copyCarContacts = (driver: any, type: 'all' | 'instagram' | 'telephone') => {
  const allMembers = [driver, ...driver.passagers];
  let contactText = `🚗 Voiture ${driver.prenom} ${driver.nom}\n${driver.lieuDepart} → ${driver.lieuArrivee}\n\n`;

  if (type === 'instagram') {
  contactText = allMembers.map((m: any) => m.instagram || '').filter(Boolean).join(' / ');
} else if (type === 'telephone') {
  contactText = allMembers.map((m: any) => m.telephone || '').filter(Boolean).join(' / ');
} else {
  contactText = allMembers.map((m: any) =>
    `${m.instagram || ''} ${m.telephone || ''}`
  ).join('\n');
}

  navigator.clipboard.writeText(contactText).then(() => {
    setCopiedId(driver.id);
    setTimeout(() => setCopiedId(null), 2000);
  });
};

  const toggleDriverExpansion = (driverId: number) => {
    setExpandedDrivers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(driverId)) {
        newSet.delete(driverId);
      } else {
        newSet.add(driverId);
      }
      return newSet;
    });
  };

  const formatInstagramUrl = (instagram: string) => {
    const username = instagram.replace('@', '');
    return `https://instagram.com/${username}`;
  };

  const removePassenger = async (driverId: number, passengerId: number) => {
    const { error } = await supabase
      .from('covoiturage_passengers')
      .update({ driver_id: null })
      .eq('id', passengerId);

    if (error) {
      setError(error.message);
      return;
    }

    await loadCovoiturage();
  };

  const removeDriver = async (driverId: number) => {
    const passengersUpdate = await supabase
      .from('covoiturage_passengers')
      .update({ driver_id: null })
      .eq('driver_id', driverId);

    if (passengersUpdate.error) {
      setError(passengersUpdate.error.message);
      return;
    }

    const driverDelete = await supabase
      .from('covoiturage_drivers')
      .delete()
      .eq('id', driverId);

    if (driverDelete.error) {
      setError(driverDelete.error.message);
      return;
    }

    await loadCovoiturage();
  };

  const deletePassenger = async (passengerId: number) => {
    const { error } = await supabase
      .from('covoiturage_passengers')
      .delete()
      .eq('id', passengerId);

    if (error) {
      setError(error.message);
      return;
    }

    await loadCovoiturage();
  };

  return (
    <div className="animate-fade-up px-6 md:px-12 py-16 pb-20">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-serif text-5xl font-bold text-[#E0F4F8] mb-2 leading-[1.1]">
          Covoitu<em className="text-[#00C8D8] italic">rage</em>
        </h2>
        <p className="text-sm text-[#4A8898] leading-[1.7] mt-2 mb-10 italic">
          Organise tes trajets, partage ta voiture ou trouve une place ! Attention, on n'oublie personne sur l'aire d'autoroute
        </p>

        {!userType && (
        <div className="mb-12">
          <p className="text-[10px] tracking-[5px] text-[#007A8A] font-medium uppercase mb-6">
            ✦ Je suis...
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            <button
              onClick={() => setUserType('conducteur')}
              className="bg-[#091F2E] border-2 border-[#00C8D8] hover:bg-[#00C8D8]/10 p-8 rounded-lg transition-all text-left group"
            >
              <div className="font-serif text-3xl font-bold text-[#00C8D8] mb-3">Conducteur</div>
              <p className="text-sm opacity-70 leading-relaxed">
                Je propose des places dans ma voiture
              </p>
            </button>

            <button
              onClick={() => setUserType('passager')}
              className="bg-[#091F2E] border-2 border-[#FF4D8F] hover:bg-[#FF4D8F]/10 p-8 rounded-lg transition-all text-left group"
            >
              <div className="font-serif text-3xl font-bold text-[#FF4D8F] mb-3">Passager</div>
              <p className="text-sm opacity-70 leading-relaxed">
                Je cherche une place dans une voiture
              </p>
            </button>
          </div>
        </div>
      )}

      {userType === 'conducteur' && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] tracking-[4px] text-[#00C8D8] font-semibold uppercase">
              ✦ Proposer un trajet
            </h3>
            <button
              onClick={() => setUserType(null)}
              className="text-xs text-[#4A8898] hover:text-[#E0F4F8] transition-colors"
            >
              Annuler
            </button>
          </div>

          <form onSubmit={handleDriverSubmit} className="bg-[#091F2E] border border-[#1A3A4A] p-8 rounded-lg max-w-3xl">
            <div className="mb-6 p-4 bg-[#00C8D8]/10 border-l-[3px] border-[#00C8D8] rounded-r">
              <p className="text-xs text-[#E0F4F8] leading-relaxed">
                <strong className="text-[#00C8D8]">Pourquoi Instagram et téléphone ?</strong> Pour faciliter la création d'une conversation de groupe avec tous les membres de la voiture et organiser le trajet ensemble.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  required
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Instagram *
                </label>
                <input
                  type="text"
                  name="instagram"
                  required
                  placeholder="@votre_pseudo"
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors placeholder:text-[#4A8898]/50"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  placeholder="06 12 34 56 78"
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors placeholder:text-[#4A8898]/50"
                />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] tracking-[3px] text-[#00C8D8] font-medium mb-4 uppercase">Départ</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="dateDepart"
                    required
                    className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                    Heure *
                  </label>
                  <input
                    type="time"
                    name="heureDepart"
                    required
                    className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    name="lieuDepart"
                    required
                    placeholder="ex: Paris Gare Montparnasse"
                    className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors placeholder:text-[#4A8898]/50"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] tracking-[3px] text-[#00C8D8] font-medium mb-4 uppercase">Arrivée</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="dateArrivee"
                    required
                    className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                    Heure *
                  </label>
                  <input
                    type="time"
                    name="heureArrivee"
                    required
                    className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    name="lieuArrivee"
                    required
                    placeholder="ex: Plufur"
                    className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors placeholder:text-[#4A8898]/50"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                Nombre de places disponibles (sans compter le conducteur) *
              </label>
              <input
                type="number"
                name="places"
                min="1"
                max="8"
                required
                className="w-full max-w-[200px] bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#00C8D8] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00C8D8] hover:bg-[#00C8D8]/90 text-[#071824] font-semibold py-4 rounded transition-colors text-sm tracking-[2px] uppercase"
            >
              Proposer ce trajet
            </button>
          </form>
        </div>
      )}

      {userType === 'passager' && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] tracking-[4px] text-[#FF4D8F] font-semibold uppercase">
              ✦ S'inscrire comme passager
            </h3>
            <button
              onClick={() => setUserType(null)}
              className="text-xs text-[#4A8898] hover:text-[#E0F4F8] transition-colors"
            >
              Annuler
            </button>
          </div>

          <form onSubmit={handlePassengerSubmit} className="bg-[#091F2E] border border-[#1A3A4A] p-8 rounded-lg max-w-2xl">
            <div className="mb-6 p-4 bg-[#FF4D8F]/10 border-l-[3px] border-[#FF4D8F] rounded-r">
              <p className="text-xs text-[#E0F4F8] leading-relaxed">
                <strong className="text-[#FF4D8F]">Pourquoi Instagram et téléphone ?</strong> Pour faciliter la création d'une conversation de groupe avec tous les membres de la voiture et organiser le trajet ensemble.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#FF4D8F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  required
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#FF4D8F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Instagram *
                </label>
                <input
                  type="text"
                  name="instagram"
                  required
                  placeholder="@votre_pseudo"
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#FF4D8F] focus:outline-none transition-colors placeholder:text-[#4A8898]/50"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-2 uppercase">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  placeholder="06 12 34 56 78"
                  className="w-full bg-[#071824] border border-[#1A3A4A] rounded px-4 py-3 text-sm text-[#E0F4F8] focus:border-[#FF4D8F] focus:outline-none transition-colors placeholder:text-[#4A8898]/50"
                />
              </div>
            </div>

            {/* Choix de voiture si des trajets sont disponibles */}
            {drivers.filter(d => d.passagers.length < parseInt(d.places)).length > 0 && (
              <div className="mb-6">
                <label className="block text-[10px] tracking-[3px] text-[#4A8898] font-medium mb-3 uppercase">
                  Choisir un trajet (optionnel)
                </label>
                <p className="text-xs text-[#4A8898] mb-4 leading-relaxed">
                  Vous pouvez sélectionner directement un trajet ou le faire plus tard.
                </p>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 bg-[#071824] border border-[#1A3A4A] rounded cursor-pointer hover:border-[#FF4D8F] transition-colors">
                    <input
                      type="radio"
                      name="driverId"
                      value=""
                      defaultChecked
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-[#E0F4F8] font-medium">Je choisis plus tard</div>
                      <div className="text-xs text-[#4A8898] mt-1">Je consulte tous les trajets disponibles</div>
                    </div>
                  </label>

                  {drivers.filter(d => d.passagers.length < parseInt(d.places)).map((driver) => (
                    <label key={driver.id} className="flex items-start gap-3 p-4 bg-[#071824] border border-[#1A3A4A] rounded cursor-pointer hover:border-[#FF4D8F] transition-colors">
                      <input
                        type="radio"
                        name="driverId"
                        value={driver.id}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-[#E0F4F8] font-medium mb-2">
                          {driver.prenom} {driver.nom}
                        </div>
                        <div className="text-xs text-[#4A8898] space-y-1">
                          <div>📍 {driver.lieuDepart} → {driver.lieuArrivee}</div>
                          <div>🕐 {driver.dateDepart} à {driver.heureDepart}</div>
                          <div className="text-[#00C8D8]">
                            {parseInt(driver.places) - driver.passagers.length} place{parseInt(driver.places) - driver.passagers.length > 1 ? 's' : ''} restante{parseInt(driver.places) - driver.passagers.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF4D8F] hover:bg-[#FF4D8F]/90 text-[#071824] font-semibold py-4 rounded transition-colors text-sm tracking-[2px] uppercase"
            >
              M'inscrire comme passager
            </button>
          </form>
        </div>
      )}

      {/* Liste des trajets disponibles */}
      {drivers.length > 0 && (
        <div className="mb-12">
          <h3 className="text-[10px] tracking-[4px] text-[#00C8D8] font-semibold uppercase mb-6">
            ✦ Trajets disponibles ({drivers.length})
          </h3>

          <div className="grid gap-4">
            {drivers.map((driver) => {
              const availablePassengers = passengers.filter(p => !p.driverId);
              const hasPlaces = driver.passagers.length < parseInt(driver.places);
              const isExpanded = expandedDrivers.has(driver.id);

              return (
                <div key={driver.id} className="bg-[#091F2E] border-l-[3px] border-[#00C8D8] rounded-lg overflow-hidden">
                  {/* Bannière cliquable */}
                  <button
                    onClick={() => toggleDriverExpansion(driver.id)}
                    className="w-full p-6 text-left hover:bg-[#071824]/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="font-serif text-2xl font-bold text-[#E0F4F8] mb-1">
                          {driver.prenom} {driver.nom}
                        </div>
                        <div className="text-xs text-[#4A8898] tracking-[2px]">CONDUCTEUR</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#E0F4F8] mb-1">
                          {driver.passagers.length} / {driver.places} places occupées
                        </div>
                        <div className={`text-xs ${!hasPlaces ? 'text-[#FF4D8F]' : 'text-[#00C8D8]'}`}>
                          {!hasPlaces ? 'COMPLET' : `${parseInt(driver.places) - driver.passagers.length} places restantes`}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[#071824]/50 p-4 rounded">
                        <div className="text-[10px] tracking-[2px] text-[#00C8D8] font-medium mb-2 uppercase">Départ</div>
                        <div className="text-sm text-[#E0F4F8] mb-1">{driver.lieuDepart}</div>
                        <div className="text-xs text-[#4A8898]">{driver.dateDepart} à {driver.heureDepart}</div>
                      </div>

                      <div className="bg-[#071824]/50 p-4 rounded">
                        <div className="text-[10px] tracking-[2px] text-[#00C8D8] font-medium mb-2 uppercase">Arrivée</div>
                        <div className="text-sm text-[#E0F4F8] mb-1">{driver.lieuArrivee}</div>
                        <div className="text-xs text-[#4A8898]">{driver.dateArrivee} à {driver.heureArrivee}</div>
                      </div>
                    </div>

                    <div className="text-center mt-4 text-xs text-[#4A8898]">
                      {isExpanded ? '▲ Masquer les détails' : '▼ Voir les détails et les passagers'}
                    </div>
                  </button>

                  {/* Détails et passagers - affichés seulement si expanded */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      {driver.passagers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#1A3A4A]">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[10px] tracking-[2px] text-[#4A8898] font-medium uppercase">Passagers confirmés</div>
                           <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={(e) => { e.stopPropagation(); copyCarContacts(driver, 'instagram'); }}
                              className="text-xs bg-[#FF4D8F]/20 hover:bg-[#FF4D8F]/30 text-[#FF4D8F] px-3 py-1.5 rounded transition-colors"
                            >
                              📷 Instagrams
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyCarContacts(driver, 'telephone'); }}
                              className="text-xs bg-[#00C8D8]/20 hover:bg-[#00C8D8]/30 text-[#00C8D8] px-3 py-1.5 rounded transition-colors"
                            >
                              📱 Téléphones
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyCarContacts(driver, 'all'); }}
                              className="text-xs bg-[#F6CC45]/20 hover:bg-[#F6CC45]/30 text-[#F6CC45] px-3 py-1.5 rounded transition-colors"
                            >
                              {copiedId === driver.id ? '✓ Copié !' : '📋 Tout'}
                            </button>
                          </div>
                          </div>

                          <div className="space-y-2">
                            {driver.passagers.map((p: any) => (
                              <div key={p.id} className="bg-[#FF4D8F]/10 border border-[#FF4D8F]/30 px-4 py-3 rounded-lg">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="text-sm text-[#E0F4F8] font-medium">
                                      {p.prenom} {p.nom}
                                    </div>
                                    <div className="text-xs text-[#4A8898] mt-1 flex flex-wrap gap-3">
                                      {p.instagram && (
                                        <a
                                          href={formatInstagramUrl(p.instagram)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="hover:text-[#FF4D8F] transition-colors"
                                        >
                                          📷 {p.instagram}
                                        </a>
                                      )}
                                      {p.telephone && <span>📱 {p.telephone}</span>}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removePassenger(driver.id, p.id);
                                    }}
                                    className="text-[#FF4D8F] hover:text-[#E0F4F8] hover:bg-[#FF4D8F]/20 w-8 h-8 rounded-full flex items-center justify-center transition-all text-lg font-bold"
                                    title="Retirer ce passager"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Infos du conducteur */}
                          <div className="mt-3 bg-[#00C8D8]/10 border border-[#00C8D8]/30 px-4 py-3 rounded-lg">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="text-sm text-[#E0F4F8] font-medium">
                                  {driver.prenom} {driver.nom} <span className="text-xs text-[#00C8D8]">(Conducteur)</span>
                                </div>
                                <div className="text-xs text-[#4A8898] mt-1 flex flex-wrap gap-3">
                                  {driver.instagram && (
                                    <a
                                      href={formatInstagramUrl(driver.instagram)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:text-[#00C8D8] transition-colors"
                                    >
                                      📷 {driver.instagram}
                                    </a>
                                  )}
                                  {driver.telephone && <span>📱 {driver.telephone}</span>}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 p-3 bg-[#F6CC45]/10 border border-[#F6CC45]/30 rounded-lg">
                            <p className="text-xs text-[#E0F4F8] leading-relaxed">
                              💡 <strong className="text-[#F6CC45]">Astuce :</strong> Utilisez le bouton "Instagram" ou "Téléphone" pour copier les contacts, puis créez un groupe avec tous les membres pour organiser le trajet !
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bouton supprimer le trajet */}
                      <div className="mt-6 pt-4 border-t border-[#1A3A4A]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce trajet ? ${driver.passagers.length > 0 ? `Les ${driver.passagers.length} passager(s) seront libéré(s).` : ''}`)) {
                              removeDriver(driver.id);
                            }
                          }}
                          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 px-4 py-3 rounded transition-all text-sm font-medium"
                        >
                          🗑️ Supprimer ce trajet
                        </button>
                      </div>

                  {/* Bouton pour rejoindre le trajet */}
                  {hasPlaces && availablePassengers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#1A3A4A]">
                      <div className="text-[10px] tracking-[2px] text-[#4A8898] font-medium mb-3 uppercase">
                        Rejoindre ce trajet
                      </div>

                      {selectedPassengerForJoin === driver.id ? (
                        <div className="space-y-3">
                          <p className="text-sm text-[#E0F4F8] mb-3">Sélectionnez le passager :</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {availablePassengers.map((passenger) => (
                              <button
                                key={passenger.id}
                                onClick={() => {
                                  joinDriver(driver.id, passenger.id);
                                  setSelectedPassengerForJoin(null);
                                }}
                                className="bg-[#071824] hover:bg-[#FF4D8F]/20 border border-[#1A3A4A] hover:border-[#FF4D8F] px-4 py-3 rounded text-sm text-[#E0F4F8] transition-all text-left"
                              >
                                <div className="font-medium">{passenger.prenom} {passenger.nom}</div>
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setSelectedPassengerForJoin(null)}
                            className="text-xs text-[#4A8898] hover:text-[#E0F4F8] transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedPassengerForJoin(driver.id)}
                          className="bg-[#FF4D8F] hover:bg-[#FF4D8F]/90 text-[#071824] font-semibold px-6 py-3 rounded transition-colors text-sm tracking-[2px] uppercase"
                        >
                          Je veux rejoindre ce trajet
                        </button>
                      )}
                    </div>
                  )}

                  {hasPlaces && availablePassengers.length === 0 && (
                    <div className="mt-4 pt-4 border-t border-[#1A3A4A]">
                      <p className="text-xs text-[#4A8898] italic">
                        Aucun passager disponible pour rejoindre ce trajet. Inscrivez-vous d'abord comme passager.
                      </p>
                    </div>
                  )}
                </div>
              )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des passagers en attente */}
      {passengers.filter(p => !p.driverId).length > 0 && (
        <div>
          <h3 className="text-[10px] tracking-[4px] text-[#FF4D8F] font-semibold uppercase mb-6">
            ✦ Passagers en attente ({passengers.filter(p => !p.driverId).length})
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passengers.filter(p => !p.driverId).map((passenger) => (
              <div key={passenger.id} className="bg-[#091F2E] border border-[#1A3A4A] p-5 rounded-lg relative">
                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer ${passenger.prenom} ${passenger.nom} de la liste des passagers ?`)) {
                      deletePassenger(passenger.id);
                    }
                  }}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 w-7 h-7 rounded-full flex items-center justify-center transition-all text-lg font-bold"
                  title="Supprimer ce passager"
                >
                  ×
                </button>
                <div className="text-sm text-[#E0F4F8] font-medium mb-2 pr-6">
                  {passenger.prenom} {passenger.nom}
                </div>
                <div className="text-xs text-[#4A8898] space-y-1">
                  <div className="flex items-center gap-2">
                    <span>📷</span>
                    <span>{passenger.instagram || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📱</span>
                    <span>{passenger.telephone || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="text-xs text-[#FF4D8F] mt-3 font-medium">Cherche un trajet</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {drivers.length === 0 && passengers.filter(p => !p.driverId).length === 0 && !userType && (
        <div className="text-center py-16 opacity-50">
          <p className="text-sm">Aucun trajet ou passager inscrit pour le moment.</p>
          <p className="text-xs mt-2">Soyez le premier à proposer un covoiturage !</p>
        </div>
      )}
      </div>
    </div>
  );
}

function LineupPage() {
  const lineup = [
    {
      day: 'Vendredi 17',
      date: '19H00 → 05H00',
      artists: [
        { name: 'À venir', genre: 'Lineup en cours de préparation', scene: 'vague' }
      ]
    },
    {
      day: 'Samedi 18',
      date: '19H00 → 05H00',
      artists: [
        { name: 'À venir', genre: 'Lineup en cours de préparation', scene: 'vague' }
      ]
    }
  ];

  return (
    <div className="animate-fade-up px-6 md:px-12 py-16 pb-20">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-serif text-5xl font-bold text-[#E0F4F8] mb-2 leading-[1.1]">
          Line<em className="text-[#00C8D8] italic">up</em>
        </h2>
        <p className="text-sm text-[#4A8898] leading-[1.7] mt-2 mb-12">
          Tout doux, tout doux, ça arrive...
        </p>

        {lineup.map((day, dayIdx) => (
          <div key={dayIdx} className="mb-16">
            <div className="bg-[#091F2E] border border-[#1A3A4A] rounded-2xl p-6 mb-6">
              <div className="flex items-baseline gap-5">
                <div className="font-serif text-4xl font-bold text-[#E0F4F8]">{day.day}</div>
                <div className="text-[11px] tracking-[3px] text-[#00C8D8] font-medium">{day.date}</div>
              </div>
            </div>

            <div>
              {day.artists.map((artist, idx) => (
                <div
                  key={idx}
                  className="bg-[#091F2E] border-2 border-[#1A3A4A] p-8 rounded-2xl max-w-md"
                >
                  <div className="font-serif font-bold text-[#E0F4F8] mb-2 leading-[1.1] text-[26px]">
                    {artist.name}
                  </div>

                  <div className="text-[12px] text-[#4A8898] leading-relaxed">{artist.genre}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
