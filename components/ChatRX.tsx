
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMode, ChatMessage, QuizData } from '../types';
import { 
  generateTextResponse, 
  generateGroundedResponse, 
  generateVisualization,
  createPcmBlob,
  base64ToFloat32Array,
  editImage,
  analyzeVideo,
  generateQuiz
} from '../services/geminiService';
import { 
  Send, 
  Mic, 
  MapPin, 
  Search, 
  Zap, 
  Loader2, 
  Upload, 
  Eye,
  MessageSquare,
  Network,
  Sparkles,
  X,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  BrainCircuit
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
// @ts-ignore
import mermaid from 'mermaid';

// Initialize Mermaid
mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });

const MermaidChart = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  
  useEffect(() => {
    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        if (await mermaid.parse(code)) {
            const { svg } = await mermaid.render(id, code);
            setSvg(svg);
        } else {
            setSvg('<p class="text-red-400 text-xs">Invalid Diagram Code</p>');
        }
      } catch (e) {
        console.error('Mermaid render error', e);
        setSvg(`<p class="text-red-500 text-xs">Failed to render diagram: ${(e as Error).message}</p>`);
      }
    };
    renderChart();
  }, [code]);

  return (
      <div 
        className="overflow-x-auto p-4 bg-white rounded-xl border border-gray-100 shadow-sm my-2" 
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
  );
};

const QuizCard = ({ data }: { data: QuizData }) => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!data || !data.questions) {
      return <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm">Error loading quiz data.</div>;
  }

  const handleSelect = (qId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = () => {
    let s = 0;
    data.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        s++;
      }
    });
    setScore(s);
    setSubmitted(true);
  };

  const progress = (score / data.questions.length) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 my-2 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <GraduationCap className="text-primary" size={20} /> Quiz: {data.topic}
        </h3>
        {submitted && (
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${progress >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            Score: {score}/{data.questions.length}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {data.questions.map((q, i) => (
          <div key={q.id} className="space-y-3">
            <p className="font-medium text-gray-800 text-sm"><span className="text-gray-400 mr-2">{i+1}.</span>{q.question}</p>
            <div className="space-y-2 pl-4">
              {q.options.map((opt, idx) => {
                const isSelected = answers[q.id] === idx;
                const isCorrect = q.correctAnswerIndex === idx;
                
                let styleClass = "border-gray-200 hover:bg-gray-50";
                if (submitted) {
                  if (isCorrect) styleClass = "bg-green-50 border-green-200 text-green-800";
                  else if (isSelected && !isCorrect) styleClass = "bg-red-50 border-red-200 text-red-800";
                } else if (isSelected) {
                  styleClass = "bg-primary/5 border-primary text-primary";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, idx)}
                    disabled={submitted}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${styleClass}`}
                  >
                    <span>{opt}</span>
                    {submitted && isCorrect && <CheckCircle2 size={16} className="text-green-600" />}
                    {submitted && isSelected && !isCorrect && <AlertCircle size={16} className="text-red-600" />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className="pl-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <span className="font-bold text-gray-600">Explanation:</span> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
           <button 
             onClick={handleSubmit}
             disabled={Object.keys(answers).length !== data.questions.length}
             className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
           >
             Submit Answers
           </button>
        </div>
      )}
    </div>
  );
};

const ChatRX: React.FC = () => {
  const [mode, setMode] = useState<ChatMode>(ChatMode.GENERAL);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Inputs for specific modes
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Live Preview State
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const [isLiveGenerating, setIsLiveGenerating] = useState(false);

  // Live API State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debounced Live Visualization
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (mode === ChatMode.VISUALIZE && input.length > 10) {
        setIsLiveGenerating(true);
        try {
           const result = await generateVisualization(input);
           if (result.visualCode) {
               setLivePreview(result.visualCode);
           }
        } catch (error) {
            // silent fail
        } finally {
            setIsLiveGenerating(false);
        }
      } else if (input.length < 10) {
          setLivePreview(null);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(delayDebounceFn);
  }, [input, mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
      }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    
    // Handle File preview in chat
    if(selectedFile) {
        // Create a local URL for preview
        const url = URL.createObjectURL(selectedFile);
        if (selectedFile.type.startsWith('image')) {
             userMsg.images = [url];
        }
    }

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLivePreview(null); // Clear preview on send
    setLoading(true);

    try {
      let responseText = '';
      let images: string[] = [];
      let videoUri: string | undefined;
      let visualCode: string | undefined;
      let quizData: QuizData | undefined;
      let grounding = undefined;

      switch (mode) {
        case ChatMode.GENERAL:
          // Gemini 3 Pro
          const genResult = await generateTextResponse(userMsg.text, 'gemini-3-pro-preview');
          responseText = genResult.text;
          break;

        case ChatMode.FAST:
          // Flash Lite
          const fastResult = await generateTextResponse(userMsg.text, 'gemini-2.5-flash-lite');
          responseText = fastResult.text;
          break;

        case ChatMode.RESEARCH:
          // Grounding (Search or Maps)
          const isMapQuery = userMsg.text.toLowerCase().includes('where') || userMsg.text.toLowerCase().includes('locate') || userMsg.text.toLowerCase().includes('near');
          let location = undefined;
          
          if (isMapQuery) {
             try {
                 // Simple inline geolocation for demo
                 const pos: GeolocationPosition = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
                 location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
             } catch (e) { console.log("Loc failed, proceeding without precise loc"); }
          }

          const researchResult = await generateGroundedResponse(userMsg.text, isMapQuery, location);
          responseText = researchResult.text;
          grounding = researchResult.grounding;
          break;

        case ChatMode.VISUALIZE:
            const vizResult = await generateVisualization(userMsg.text);
            responseText = vizResult.text;
            visualCode = vizResult.visualCode;
            break;

        case ChatMode.QUIZ:
            const quizResult = await generateQuiz(userMsg.text);
            responseText = quizResult.text;
            quizData = quizResult.quizData;
            break;

        case ChatMode.VISION_EDIT:
           if (selectedFile) {
               if (selectedFile.type.startsWith('image')) {
                   // Image Edit
                   // convert file to base64
                   const reader = new FileReader();
                   reader.readAsDataURL(selectedFile);
                   await new Promise(resolve => reader.onload = resolve);
                   const b64 = reader.result as string;
                   const edited = await editImage(userMsg.text, b64, selectedFile.type);
                   images = [edited];
                   responseText = "Here is your edited image:";
               } else if (selectedFile.type.startsWith('video')) {
                   // Video Understanding
                   responseText = await analyzeVideo(userMsg.text, selectedFile);
               }
           } else {
               responseText = "Please upload an image to edit or a video to analyze.";
           }
           break;

        default:
          responseText = "Mode not supported yet.";
      }

      setMessages(prev => [...prev, { 
          role: 'model', 
          text: responseText, 
          images, 
          videoUri,
          visualCode,
          quizData,
          groundingMetadata: grounding
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing your request.", isError: true }]);
      console.error(error);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  // --- LIVE API HANDLERS ---

  const startLiveSession = async () => {
    try {
        setIsLiveActive(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Audio Setup
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
        audioContextRef.current = audioCtx;
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        
        // Mic Stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        
        let nextStartTime = 0;

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                }
            },
            callbacks: {
                onopen: () => {
                    console.log("Live Session Open");
                    setMessages(prev => [...prev, { role: 'system', text: "Live Voice Session Connected. Speak now." }]);
                },
                onmessage: async (msg: LiveServerMessage) => {
                    const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio) {
                         const float32 = base64ToFloat32Array(base64Audio);
                         const audioBuffer = outputCtx.createBuffer(1, float32.length, 24000);
                         audioBuffer.getChannelData(0).set(float32);
                         
                         const node = outputCtx.createBufferSource();
                         node.buffer = audioBuffer;
                         node.connect(outputCtx.destination);
                         
                         const now = outputCtx.currentTime;
                         // Simple scheduling to prevent overlap/gaps
                         const start = Math.max(now, nextStartTime);
                         node.start(start);
                         nextStartTime = start + audioBuffer.duration;
                         currentSourceRef.current = node;
                    }
                },
                onclose: () => {
                    setIsLiveActive(false);
                    setMessages(prev => [...prev, { role: 'system', text: "Live Session Ended." }]);
                },
                onerror: (err) => {
                    console.error("Live Error", err);
                    setIsLiveActive(false);
                }
            }
        });

        sessionPromiseRef.current = sessionPromise;

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const blobInfo = createPcmBlob(inputData);
            
            sessionPromise.then(session => {
                session.sendRealtimeInput({
                    media: {
                        mimeType: blobInfo.mimeType,
                        data: blobInfo.data
                    }
                });
            });
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);

    } catch (err) {
        console.error("Failed to start live", err);
        setIsLiveActive(false);
    }
  };

  const stopLiveSession = () => {
      if (audioContextRef.current) {
          audioContextRef.current.close();
      }
      // Since we can't strictly "close" the session object from the SDK easily outside callbacks without storing it,
      // closing the AudioContext and refreshing state is a simple cleanup for this demo.
      setIsLiveActive(false);
      setMessages(prev => [...prev, { role: 'system', text: "Live Session Disconnected." }]);
  };


  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 relative">
      {/* Header / Mode Selector */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          <button 
            onClick={() => setMode(ChatMode.GENERAL)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${mode === ChatMode.GENERAL ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <MessageSquare size={16} /> Chat (Pro)
          </button>
          <button 
            onClick={() => setMode(ChatMode.FAST)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${mode === ChatMode.FAST ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <Zap size={16} /> Fast
          </button>
          <button 
            onClick={() => setMode(ChatMode.RESEARCH)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${mode === ChatMode.RESEARCH ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <Search size={16} /> Research
          </button>
          <button 
            onClick={() => setMode(ChatMode.QUIZ)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${mode === ChatMode.QUIZ ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <GraduationCap size={16} /> Quiz Gen
          </button>
           <button 
            onClick={() => setMode(ChatMode.VISUALIZE)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${mode === ChatMode.VISUALIZE ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <Network size={16} /> Visualize
          </button>
          <button 
            onClick={() => setMode(ChatMode.VISION_EDIT)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${mode === ChatMode.VISION_EDIT ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <Eye size={16} /> Vision/Edit
          </button>
          <button 
             onClick={() => setMode(ChatMode.LIVE)}
             className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${mode === ChatMode.LIVE ? 'bg-red-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <Mic size={16} /> Live Voice
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 relative">
        {mode === ChatMode.LIVE && !isLiveActive ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-8">
                 <div className="bg-red-100 p-6 rounded-full mb-4">
                     <Mic size={48} className="text-red-500" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Start a Live Voice Session</h3>
                 <p className="text-gray-500 mb-6 max-w-md">Talk naturally with Gemini in real-time. The model listens and responds instantly with human-like voice.</p>
                 <button onClick={startLiveSession} className="bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-red-600 transition">Connect Now</button>
             </div>
        ) : (
            messages.length === 0 && mode !== ChatMode.LIVE ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <BrainCircuit size={64} className="mb-4 opacity-20" />
                    <p>How can I help you with your studies today?</p>
                    {mode === ChatMode.QUIZ && <p className="text-xs mt-2">Try "Generate a quiz on Electromagnetic Waves"</p>}
                    {mode === ChatMode.VISUALIZE && <p className="text-xs mt-2">Try "Visualize the process of photosynthesis"</p>}
                </div>
            ) : (
                messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${
                        msg.role === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : msg.role === 'system'
                        ? 'bg-gray-200 text-gray-600 text-xs text-center w-full'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}>
                        {/* Images */}
                        {msg.images && msg.images.map((img, idx) => (
                            <img key={idx} src={img} alt="Generated or uploaded" className="rounded-lg mb-3 max-w-full" />
                        ))}
                        
                        {/* Quiz Render */}
                        {msg.quizData && (
                            <QuizCard data={msg.quizData} />
                        )}

                        {/* Visualization (Mermaid) */}
                        {msg.visualCode && (
                            <MermaidChart code={msg.visualCode} />
                        )}

                        {/* Video */}
                        {msg.videoUri && (
                            <div className="mb-3">
                                <p className="text-xs mb-1 font-semibold">Video Generated:</p>
                                <a href={msg.videoUri} target="_blank" rel="noreferrer" className="block bg-black/10 p-2 rounded text-blue-600 underline text-sm truncate">
                                    Download/View Video
                                </a>
                            </div>
                        )}

                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Grounding Sources */}
                        {msg.groundingMetadata && msg.groundingMetadata.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                                <p className="font-semibold text-gray-500 mb-1">Sources:</p>
                                <div className="flex flex-wrap gap-2">
                                    {msg.groundingMetadata.map((g, idx) => (
                                        <a 
                                            key={idx} 
                                            href={g.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 text-blue-600"
                                        >
                                            {g.source === 'maps' ? <MapPin size={10} /> : <Search size={10} />}
                                            {g.title || g.url.substring(0, 20)}...
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                ))
            )
        )}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                    <Loader2 className="animate-spin text-primary" size={20} />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />

        {/* Live Preview Panel */}
        {mode === ChatMode.VISUALIZE && (livePreview || isLiveGenerating) && (
            <div className="absolute bottom-2 right-4 left-4 md:left-auto md:w-96 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 z-20 animate-fade-in">
                <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-primary uppercase flex items-center gap-1">
                        <Sparkles size={12} /> Live Visualizer
                    </h4>
                    <div className="flex items-center gap-2">
                       {isLiveGenerating && <Loader2 size={12} className="animate-spin text-gray-400" />}
                       <button onClick={() => setLivePreview(null)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                     {livePreview ? (
                        <MermaidChart code={livePreview} />
                     ) : (
                         <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-2">
                            <Sparkles size={24} className="animate-pulse text-purple-200" />
                            <p className="text-xs italic">Analyzing text structure...</p>
                         </div>
                     )}
                </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      {mode === ChatMode.LIVE ? (
          isLiveActive && (
            <div className="p-4 bg-white border-t flex justify-center">
                <button onClick={stopLiveSession} className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-black">End Session</button>
            </div>
          )
      ) : (
        <div className="p-4 bg-white border-t border-gray-200 relative z-30">
            
            {/* File Preview */}
            {selectedFile && (
                <div className="mb-2 flex items-center gap-2 bg-gray-100 p-2 rounded-lg text-sm w-fit">
                   <span className="truncate max-w-xs">{selectedFile.name}</span>
                   <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500">×</button>
                </div>
            )}

            <div className="flex gap-2">
            {(mode === ChatMode.VISION_EDIT) && (
                <label className="cursor-pointer p-3 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors">
                    <Upload size={20} />
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                </label>
            )}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={
                    mode === ChatMode.VISUALIZE ? "Type to visualize (e.g., Flowchart of login process)..." :
                    mode === ChatMode.RESEARCH ? "Ask about current events or places..." :
                    mode === ChatMode.QUIZ ? "Enter a topic (e.g., Calculus, History, Biology)..." :
                    mode === ChatMode.VISION_EDIT ? "Upload a file and ask to edit/analyze..." :
                    "Message Chat RX..."
                }
                className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 border-0 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all"
                disabled={loading}
            />
            <button 
                onClick={handleSend}
                disabled={loading || (!input.trim() && !selectedFile)}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-3 rounded-xl transition-colors"
            >
                <Send size={20} />
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatRX;
