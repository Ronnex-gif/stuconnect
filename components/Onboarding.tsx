
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Building2, User, Mail, GraduationCap, ChevronRight, BrainCircuit, Sparkles, Lock, Eye, EyeOff, Instagram, Loader2, LogIn, Globe } from 'lucide-react';
import { signUpUser, signInUser, signInWithGoogle } from '../services/firebase';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onVisitorClick: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onVisitorClick }) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Student',
    schoolName: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        if (isLoginMode) {
            // Login Flow
            await signInUser(formData.email, formData.password);
            // Auth listener in App.tsx will handle state update
        } else {
            // Registration Flow
            if (!formData.firstName || !formData.schoolName) {
                setError("Please fill in all fields.");
                setIsLoading(false);
                return;
            }

            const profile: UserProfile = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                role: formData.role,
                schoolName: formData.schoolName,
                avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=5B21B6&color=fff`
            };

            await signUpUser(formData.email, formData.password, profile);
            // Auth listener in App.tsx will handle state update
        }
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
            setError("Invalid email or password.");
        } else if (err.code === 'auth/email-already-in-use') {
            setError("Email is already registered.");
        } else if (err.code === 'auth/weak-password') {
            setError("Password should be at least 6 characters.");
        } else if (err.message && err.message.includes("API key")) {
            setError("Missing Firebase Configuration. Please check services/firebase.ts");
        } else {
            setError("An error occurred. Please try again.");
        }
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
      setError(null);
      setIsLoading(true);
      try {
          await signInWithGoogle();
          // Auth listener in App.tsx will handle state update
      } catch (err: any) {
          console.error(err);
          if (err.code === 'auth/popup-closed-by-user') {
              setError("Sign in cancelled.");
          } else if (err.message && err.message.includes("API key")) {
              setError("Missing Firebase Configuration. Please check services/firebase.ts");
          } else {
              setError("Google Sign-In failed. Please try again.");
          }
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-fade-in relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">
        
        {/* Left Side - Visual */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#5B21B6] to-[#9333EA] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <BrainCircuit size={32} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Chatrx Stuconnect</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
                {isLoginMode ? "Welcome Back!" : "Your AI-Powered Learning Companion"}
            </h2>
            <p className="text-purple-100 text-lg">
              {isLoginMode 
                ? "Sign in to continue your learning journey and connect with peers."
                : "Connect with your school, manage your curriculum, and boost your co-curricular life with intelligent tools."}
            </p>
          </div>

          {!isLoginMode && (
             <div className="relative z-10 mt-10 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="bg-white/20 p-3 rounded-full">
                      <Building2 size={20} />
                   </div>
                   <div>
                      <p className="font-bold">School Integration</p>
                      <p className="text-sm text-purple-200">Access specific resources for your institution</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bg-white/20 p-3 rounded-full">
                      <Sparkles size={20} />
                   </div>
                   <div>
                      <p className="font-bold">Gemini Intelligence</p>
                      <p className="text-sm text-purple-200">Smart tutoring and content generation</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bg-white/20 p-3 rounded-full">
                      <Instagram size={20} />
                   </div>
                   <div>
                      <p className="font-bold">ChatRX Insta</p>
                      <p className="text-sm text-purple-200">Boost connections & share campus moments</p>
                   </div>
                </div>
             </div>
          )}

          {/* Abstract Shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-10 flex flex-col">
           <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="text-2xl font-bold text-gray-800">{isLoginMode ? "Sign In" : "Get Started"}</h3>
                 <p className="text-gray-500 text-sm mt-1">
                     {isLoginMode ? "Enter your credentials to access." : "Create your account to access your dashboard."}
                 </p>
               </div>
               <div className="text-right">
                   <button 
                     onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }} 
                     className="text-sm font-bold text-primary hover:underline"
                   >
                       {isLoginMode ? "Create Account" : "Login instead"}
                   </button>
               </div>
           </div>

           {error && (
               <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-red-500"></span>
                   {error}
               </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              
              {!isLoginMode && (
                  <div className="grid grid-cols-2 gap-4 animate-fade-in">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                           <input 
                              type="text" 
                              required={!isLoginMode}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-gray-900"
                              placeholder="Jane"
                              value={formData.firstName}
                              onChange={e => setFormData({...formData, firstName: e.target.value})}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input 
                           type="text" 
                           required={!isLoginMode}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-gray-900"
                           placeholder="Doe"
                           value={formData.lastName}
                           onChange={e => setFormData({...formData, lastName: e.target.value})}
                        />
                     </div>
                  </div>
              )}

              <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                       type="email" 
                       required
                       className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-gray-900"
                       placeholder="jane.doe@school.edu"
                       value={formData.email}
                       onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                       type={showPassword ? "text" : "password"}
                       required
                       className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-gray-900"
                       placeholder="••••••••"
                       value={formData.password}
                       onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>
              </div>

              {!isLoginMode && (
                  <>
                    <div className="space-y-2 animate-fade-in">
                        <label className="text-sm font-medium text-gray-700">School / University Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                            type="text" 
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-gray-900"
                            placeholder="e.g. Suconnect University"
                            value={formData.schoolName}
                            onChange={e => setFormData({...formData, schoolName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 animate-fade-in">
                        <label className="text-sm font-medium text-gray-700">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'Student'})}
                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${formData.role === 'Student' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            >
                            <GraduationCap size={20} /> Student
                            </button>
                            <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'Educator'})}
                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${formData.role === 'Educator' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            >
                            <User size={20} /> Educator
                            </button>
                        </div>
                    </div>
                  </>
              )}

              <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                 {isLoading ? (
                     <Loader2 className="animate-spin" />
                 ) : isLoginMode ? (
                     <>Sign In <LogIn size={20} /></>
                 ) : (
                     <>Create Account <ChevronRight size={20} /></>
                 )}
              </button>

              <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
              </div>

              <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                 Google
              </button>
           </form>

           {/* Visitor Button */}
           <div className="mt-4 text-center">
              <button 
                onClick={onVisitorClick}
                className="text-sm text-gray-500 hover:text-primary flex items-center justify-center gap-1 mx-auto transition"
              >
                <Globe size={16} /> Explore as Visitor / Public Access
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
