
import React, { useState } from 'react';
import { LogIn, Zap, BrainCircuit, Shield, Globe, ChevronRight, Smartphone, Users, BookOpen, Star, Instagram, MessageSquare, Heart, CheckCircle2, HelpCircle, ArrowRight, Download, School } from 'lucide-react';

interface VisitorPageProps {
  onLoginClick: () => void;
}

const VisitorPage: React.FC<VisitorPageProps> = ({ onLoginClick }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans animate-fade-in scroll-smooth">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
               <div className="bg-primary text-white p-2 rounded-xl">
                 <BrainCircuit size={24} />
               </div>
               <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent hidden sm:block">
                 Chatrx Stuconnect
               </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition">How it Works</a>
              <a href="#features" className="text-gray-600 hover:text-primary font-medium transition">Features</a>
              <a href="#community" className="text-gray-600 hover:text-primary font-medium transition">Community</a>
              <a href="#faq" className="text-gray-600 hover:text-primary font-medium transition">FAQ</a>
            </div>
            <button 
              onClick={onLoginClick}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <LogIn size={18} /> <span className="hidden sm:inline">Login / Sign Up</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center md:text-left md:items-start">
           <div className="md:w-3/4 lg:w-2/3">
             <span className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/20 backdrop-blur-sm animate-pulse">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> Voted #1 Student App for 2025
             </span>
             <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
                The Ultimate <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">AI Student Companion</span>
             </h1>
             <p className="text-xl text-purple-100 mb-10 max-w-2xl leading-relaxed">
                Chatrx Connect bridges the gap between curricular goals and campus life. Experience real-time collaboration, Gemini-powered tutoring, and social networking in one super-app.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                    onClick={onLoginClick}
                    className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                   Get Started Free <ArrowRight size={20} />
                </button>
                <a href="#features" className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                   Explore Features
                </a>
             </div>
           </div>
        </div>
        
        {/* Stats Strip */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
           <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              <div className="text-center border-r border-white/10 last:border-0">
                 <div className="text-3xl md:text-4xl font-bold">50k+</div>
                 <div className="text-sm text-white/70 uppercase tracking-wide font-medium mt-1">Active Students</div>
              </div>
              <div className="text-center border-r border-white/10 last:border-0">
                 <div className="text-3xl md:text-4xl font-bold">1.2M+</div>
                 <div className="text-sm text-white/70 uppercase tracking-wide font-medium mt-1">AI Queries Solved</div>
              </div>
              <div className="text-center border-r border-white/10 last:border-0">
                 <div className="text-3xl md:text-4xl font-bold">500+</div>
                 <div className="text-sm text-white/70 uppercase tracking-wide font-medium mt-1">Universities</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl md:text-4xl font-bold">4.9</div>
                 <div className="text-sm text-white/70 uppercase tracking-wide font-medium mt-1 flex items-center justify-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> App Store Rating
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="bg-white border-b border-gray-100 py-8 overflow-hidden">
         <p className="text-center text-gray-400 text-sm font-bold uppercase tracking-widest mb-6">Trusted by Top Institutions Worldwide</p>
         <div className="flex justify-center items-center gap-12 md:gap-20 opacity-50 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><School size={28} /> Harvard</div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><School size={28} /> MIT</div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800"><School size={28} /> Stanford</div>
            <div className="flex items-center gap-2 font-bold text-xl text-gray-800 hidden md:flex"><School size={28} /> Oxford</div>
         </div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Journey to Success</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">Get set up in less than 60 seconds and transform the way you learn.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>

               {[
                  { title: 'Create Profile', desc: 'Sign up and select your role as a Student or Educator.', icon: <Users className="text-white" size={24} />, color: 'bg-blue-500' },
                  { title: 'Connect School', desc: 'Select your institution to sync courses and resources.', icon: <School className="text-white" size={24} />, color: 'bg-purple-500' },
                  { title: 'Start Learning', desc: 'Use AI tools, join clubs, and track your wellness.', icon: <Zap className="text-white" size={24} />, color: 'bg-orange-500' }
               ].map((step, i) => (
                  <div key={i} className="relative z-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:-translate-y-2 transition duration-300">
                     <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:rotate-6 transition`}>
                        {step.icon}
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                     <p className="text-gray-500">{step.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Comprehensive tools for academic excellence and social well-being.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition group">
                 <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition">
                    <BrainCircuit size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Gemini AI Tutor</h3>
                 <p className="text-gray-500 leading-relaxed">
                    24/7 academic support. Generate quizzes, visualize concepts with diagrams, and get grounded research answers instantly.
                 </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition group">
                 <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition">
                    <Instagram size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Chatrx Insta</h3>
                 <p className="text-gray-500 leading-relaxed">
                    A vibrant campus feed. Share stories, join clubs, and stay updated with campus events through an engaging social interface.
                 </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition group">
                 <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition">
                    <Smartphone size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Messaging</h3>
                 <p className="text-gray-500 leading-relaxed">
                    Connect instantly. Chat with study groups, classmates, and faculty in real-time with file sharing and status updates.
                 </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition group">
                 <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition">
                    <Heart size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Student Wellness</h3>
                 <p className="text-gray-500 leading-relaxed">
                    Prioritize mental health. Track your mood, use focus timers, and access relaxation soundscapes designed for students.
                 </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition group">
                 <div className="bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition">
                    <Zap size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Gamified Learning</h3>
                 <p className="text-gray-500 leading-relaxed">
                    Level up your education. Earn XP, unlock badges, and climb the global leaderboard by completing academic challenges.
                 </p>
              </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition group">
                 <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition">
                    <BookOpen size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Educator Studio</h3>
                 <p className="text-gray-500 leading-relaxed">
                    Powerful tools for teachers. Generate lesson plans, track attendance, and analyze student performance with AI.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="py-20 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
               <p className="text-gray-500">Join a community of over 50,000 students thriving with Chatrx.</p>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
                 {[
                     { name: "Alex R.", role: "CS Major", text: "The code visualization feature saved me during finals. Being able to see flowcharts generated instantly from my logic is a game changer.", img: "https://i.pravatar.cc/150?u=8" },
                     { name: "Sarah M.", role: "Medical Student", text: "I love the wellness section. The focus timer and calming sounds help me power through long study sessions without burning out.", img: "https://i.pravatar.cc/150?u=1" },
                     { name: "Mr. David K.", role: "High School Teacher", text: "Educator Studio allows me to create lesson plans in seconds. It gives me more time to actually interact with my students.", img: "https://i.pravatar.cc/150?u=5" }
                 ].map((t, i) => (
                     <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                         <div className="flex items-center gap-4 mb-4">
                             <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full" />
                             <div>
                                 <p className="font-bold text-gray-900">{t.name}</p>
                                 <p className="text-xs text-primary font-medium">{t.role}</p>
                             </div>
                         </div>
                         <p className="text-gray-600 italic">"{t.text}"</p>
                         <div className="flex gap-1 mt-4 text-yellow-400">
                             {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
         <div className="max-w-3xl mx-auto px-4">
             <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
             </div>
             <div className="space-y-4">
                 {[
                     { id: 1, q: "Is Chatrx Stuconnect free to use?", a: "Yes! The core features for students including dashboard, messaging, and basic AI assistance are completely free. Schools can upgrade for advanced analytics." },
                     { id: 2, q: "Can I use it if my school isn't listed?", a: "Absolutely. You can use Chatrx as an independent student to manage your own learning and connect with the global community." },
                     { id: 3, q: "How does the AI work?", a: "We use Google's advanced Gemini models to process your questions, generate quizzes, and analyze files. It's like having a super-smart tutor in your pocket." },
                     { id: 4, q: "Is my data safe?", a: "Security is our priority. We use industry-standard encryption and do not share your personal data with third parties without consent." }
                 ].map((faq) => (
                     <div key={faq.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                         <button 
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 hover:bg-gray-50 transition"
                         >
                             {faq.q}
                             <ChevronRight className={`transition-transform duration-300 ${activeFaq === faq.id ? 'rotate-90' : ''}`} />
                         </button>
                         {activeFaq === faq.id && (
                             <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
                                 {faq.a}
                             </div>
                         )}
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* Mobile App CTA */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-1/2">
                      <h2 className="text-4xl font-bold mb-6">Take Your Campus with You</h2>
                      <p className="text-gray-400 text-lg mb-8">
                          Download the Chatrx mobile app to get push notifications for assignments, chat on the go, and access offline study materials.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                          <button className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition">
                              <Smartphone size={24} /> 
                              <div className="text-left leading-none">
                                  <span className="block text-[10px] uppercase font-bold">Download on the</span>
                                  <span className="text-lg">App Store</span>
                              </div>
                          </button>
                          <button className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition">
                               <div className="text-left leading-none">
                                  <span className="block text-[10px] uppercase font-bold">Get it on</span>
                                  <span className="text-lg">Google Play</span>
                              </div>
                          </button>
                      </div>
                  </div>
                  <div className="md:w-1/2 flex justify-center relative">
                      <div className="absolute bg-primary/30 w-64 h-64 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      {/* Mock Phone */}
                      <div className="relative z-10 bg-black border-8 border-gray-800 rounded-[3rem] h-[500px] w-[280px] shadow-2xl flex flex-col overflow-hidden">
                          <div className="h-full w-full bg-white overflow-hidden relative">
                               <div className="absolute top-0 w-full h-24 bg-primary"></div>
                               <div className="mt-12 px-4">
                                   <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                                       <div className="h-2 w-12 bg-gray-200 rounded mb-2"></div>
                                       <div className="h-20 bg-gray-100 rounded-lg"></div>
                                   </div>
                                   <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                                       <div className="flex items-center gap-2 mb-2">
                                           <div className="h-8 w-8 rounded-full bg-purple-200"></div>
                                           <div className="h-2 w-20 bg-gray-200 rounded"></div>
                                       </div>
                                       <div className="h-24 bg-gray-100 rounded-lg"></div>
                                   </div>
                               </div>
                               <div className="absolute bottom-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center text-gray-300">
                                   <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                   <div className="w-6 h-6 bg-primary rounded-full"></div>
                                   <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16" id="contact">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 text-white mb-6">
                  <BrainCircuit className="text-primary" size={28} />
                  <span className="text-2xl font-bold">Chatrx Stuconnect</span>
               </div>
               <p className="max-w-xs mb-8 text-gray-500">
                  Empowering the next generation of learners with AI-driven tools, community support, and seamless academic integration.
               </p>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer"><Globe size={18}/></div>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer"><Instagram size={18}/></div>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer"><MessageSquare size={18}/></div>
               </div>
            </div>
            
            <div>
               <h4 className="text-white font-bold mb-6">Platform</h4>
               <ul className="space-y-4">
                  <li><button onClick={onLoginClick} className="hover:text-primary transition">Login / Sign Up</button></li>
                  <li><a href="#features" className="hover:text-primary transition">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-primary transition">How it Works</a></li>
                  <li><a href="#" className="hover:text-primary transition">For Educators</a></li>
                  <li><a href="#" className="hover:text-primary transition">Pricing</a></li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-6">Contact</h4>
               <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                     <Shield size={18} className="mt-0.5 shrink-0 text-primary"/> 
                     <span>Ronnex Techs HQ,<br/>Kabale, Uganda</span>
                  </li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-primary"/> support@ronnextechs.com</li>
                  <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-primary"/> +254 700 123 456</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 text-center text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 Chatrx Stuconnect. Made with <Heart size={12} className="inline text-red-500 fill-red-500" /> by Ronnex.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default VisitorPage;
