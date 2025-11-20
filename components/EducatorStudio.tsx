
import React, { useState } from 'react';
import { Presentation, PenTool, Users, FileText, Sparkles, CheckCircle2, Loader2, BarChart3, TrendingUp, AlertCircle, Copy } from 'lucide-react';
import { generateLessonPlan, gradeEssay } from '../services/geminiService';

const EducatorStudio: React.FC = () => {
  const activeTabClass = "border-blue-600 text-blue-600";
  const inactiveTabClass = "border-transparent text-gray-500 hover:text-gray-800";
  
  const [activeTab, setActiveTab] = useState<'planner' | 'grading' | 'analytics'>('planner');
  
  // Planner State
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('University Year 1');
  const [duration, setDuration] = useState('60 minutes');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Grading State
  const [gradingTopic, setGradingTopic] = useState('');
  const [studentWork, setStudentWork] = useState('');
  const [gradingResult, setGradingResult] = useState('');
  const [loadingGrade, setLoadingGrade] = useState(false);

  const handleGeneratePlan = async () => {
      if (!topic) return;
      setLoadingPlan(true);
      try {
          const plan = await generateLessonPlan(topic, gradeLevel, duration);
          setGeneratedPlan(plan);
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingPlan(false);
      }
  };

  const handleGradeWork = async () => {
      if (!gradingTopic || !studentWork) return;
      setLoadingGrade(true);
      try {
          const result = await gradeEssay(gradingTopic, studentWork);
          setGradingResult(result);
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingGrade(false);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-2xl text-white">
            <Presentation size={32} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Educator Studio</h2>
            <p className="text-gray-500">AI-powered tools for modern teaching.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('planner')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'planner' ? activeTabClass : inactiveTabClass}`}
          >
              Lesson Planner
          </button>
          <button 
            onClick={() => setActiveTab('grading')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'grading' ? activeTabClass : inactiveTabClass}`}
          >
              Grading Assistant
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'analytics' ? activeTabClass : inactiveTabClass}`}
          >
              Student Analytics
          </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
          {/* LESSON PLANNER TAB */}
          {activeTab === 'planner' && (
              <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                      <div>
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                              <Sparkles className="text-yellow-500" /> Generate Lesson Plan
                          </h3>
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Introduction to Quantum Mechanics"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                      <select 
                                        className="w-full p-3 border border-gray-300 rounded-xl outline-none"
                                        value={gradeLevel}
                                        onChange={(e) => setGradeLevel(e.target.value)}
                                      >
                                          <option>High School</option>
                                          <option>University Year 1</option>
                                          <option>University Year 2</option>
                                          <option>University Year 3</option>
                                          <option>Masters</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                      <select 
                                        className="w-full p-3 border border-gray-300 rounded-xl outline-none"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                      >
                                          <option>30 minutes</option>
                                          <option>45 minutes</option>
                                          <option>60 minutes</option>
                                          <option>90 minutes</option>
                                      </select>
                                  </div>
                              </div>
                              <button 
                                onClick={handleGeneratePlan}
                                disabled={loadingPlan || !topic}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
                              >
                                  {loadingPlan ? <Loader2 className="animate-spin" /> : 'Generate Plan'}
                              </button>
                          </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <h4 className="font-bold text-blue-800 mb-2">Quick Tips</h4>
                          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                              <li>Be specific with your topic for better results.</li>
                              <li>You can copy the output to your clipboard.</li>
                              <li>Use the 'Quiz Gen' in Chat RX to create assessments based on this plan.</li>
                          </ul>
                      </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-y-auto max-h-[600px]">
                      {generatedPlan ? (
                          <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap">{generatedPlan}</div>
                          </div>
                      ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
                              <FileText size={48} className="mb-4 opacity-20" />
                              <p>Generated lesson plan will appear here.</p>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* GRADING ASSISTANT TAB */}
          {activeTab === 'grading' && (
              <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                       <div>
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                              <PenTool className="text-blue-500" /> Grade Student Work
                          </h3>
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Topic / Prompt</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Analyze the themes in Hamlet"
                                    value={gradingTopic}
                                    onChange={(e) => setGradingTopic(e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Submission</label>
                                  <textarea 
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-48"
                                    placeholder="Paste student text here..."
                                    value={studentWork}
                                    onChange={(e) => setStudentWork(e.target.value)}
                                  />
                              </div>
                              <button 
                                onClick={handleGradeWork}
                                disabled={loadingGrade || !gradingTopic || !studentWork}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
                              >
                                  {loadingGrade ? <Loader2 className="animate-spin" /> : 'Analyze & Grade'}
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-y-auto max-h-[600px]">
                      {gradingResult ? (
                          <div className="prose prose-sm max-w-none">
                              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                  <h4 className="text-blue-800 font-bold m-0">AI Feedback</h4>
                                  <button className="text-gray-400 hover:text-blue-600" onClick={() => navigator.clipboard.writeText(gradingResult)}><Copy size={16}/></button>
                              </div>
                              <div className="whitespace-pre-wrap">{gradingResult}</div>
                          </div>
                      ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
                              <CheckCircle2 size={48} className="mb-4 opacity-20" />
                              <p>Enter assignment details and student text to generate instant feedback and a suggested grade.</p>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
              <div className="space-y-8">
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-medium text-gray-500">Class Attendance</p>
                              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-lg flex items-center gap-1"><TrendingUp size={12}/> +2.4%</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">94%</p>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{width: '94%'}}></div>
                          </div>
                      </div>
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                               <p className="text-sm font-medium text-gray-500">Avg Grade (Physics)</p>
                               <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg flex items-center gap-1"><TrendingUp size={12} className="rotate-180"/> -1.2%</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">76%</p>
                           <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '76%'}}></div>
                          </div>
                      </div>
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                               <p className="text-sm font-medium text-gray-500">Assignments Submitted</p>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">142<span className="text-sm text-gray-400 font-normal">/150</span></p>
                           <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
                              <div className="bg-orange-500 h-1.5 rounded-full" style={{width: '92%'}}></div>
                          </div>
                      </div>
                  </div>
                  
                  {/* Detailed Charts Section */}
                  <div className="grid lg:grid-cols-2 gap-6">
                      
                      {/* Performance Distribution */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                          <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                              <BarChart3 size={20} className="text-blue-500" /> Grade Distribution
                          </h4>
                          <div className="flex items-end justify-between h-48 gap-2 px-2">
                              {[
                                  { label: 'A', val: 15, h: '40%' },
                                  { label: 'B', val: 35, h: '70%' },
                                  { label: 'C', val: 25, h: '50%' },
                                  { label: 'D', val: 15, h: '30%' },
                                  { label: 'F', val: 10, h: '20%' },
                              ].map((bar, i) => (
                                  <div key={i} className="flex flex-col items-center w-full group">
                                      <div className="relative w-full max-w-[40px] bg-blue-100 rounded-t-lg hover:bg-blue-200 transition-all duration-500" style={{ height: bar.h }}>
                                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">{bar.val}%</div>
                                      </div>
                                      <span className="mt-2 text-sm font-bold text-gray-600">{bar.label}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* At Risk Students */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <AlertCircle size={20} className="text-red-500" /> Needs Attention
                          </h4>
                          <div className="space-y-4">
                              {[
                                  { name: 'James Carter', issue: 'Missed 3 assignments', risk: 'High', color: 'text-red-600 bg-red-50' },
                                  { name: 'Emily Blunt', issue: 'Attendance below 70%', risk: 'Medium', color: 'text-orange-600 bg-orange-50' },
                                  { name: 'Michael Scott', issue: 'Failed Mid-Term', risk: 'High', color: 'text-red-600 bg-red-50' },
                              ].map((student, i) => (
                                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                              {student.name.charAt(0)}
                                          </div>
                                          <div>
                                              <p className="font-bold text-sm text-gray-900">{student.name}</p>
                                              <p className="text-xs text-gray-500">{student.issue}</p>
                                          </div>
                                      </div>
                                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${student.color}`}>
                                          {student.risk} Risk
                                      </span>
                                  </div>
                              ))}
                          </div>
                          <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                              View All Students
                          </button>
                      </div>

                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default EducatorStudio;
