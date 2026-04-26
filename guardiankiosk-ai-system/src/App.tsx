import { useState, useRef, useEffect } from 'react';
import { Mic, Send, AlertTriangle, ShieldAlert, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

interface CrisisData {
  severity: number;
  type: string;
  guest_instructions: string;
  staff_alert_code: string;
}

export default function App() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [crisisData, setCrisisData] = useState<CrisisData | null>(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isProcessing]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setInput('');
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === '""') {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an Emergency Crisis Coordinator for a 5-star hotel (GuardianKiosk AI). Your goal is to keep guests safe and assist them. 
When a user reports an issue, analyze it for 'Severity' on a scale of 1 to 10. 
If Severity > 7, switch to 'Emergency Mode'. 
Output ONLY valid JSON with the following keys: { "severity": number, "type": string, "guest_instructions": string, "staff_alert_code": string }.
For non-emergencies (severity <= 7), provide polite assistance or answers in the "guest_instructions" field, and "type" can be "General Inquiry" or similar.
Analyze this hospitality request: "${text}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text;
      if (responseText) {
        const data = JSON.parse(responseText) as CrisisData;
        if (data.severity > 7) {
          setIsEmergency(true);
          setCrisisData(data);
        } else {
          setChatHistory(prev => [...prev, { role: 'assistant', text: data.guest_instructions || "I understand. Staff has been notified." }]);
        }
      }
    } catch (error: any) {
      console.error("Error processing request:", error);
      const errorMsg = error.message.includes("GEMINI_API_KEY") 
        ? "My Gemini API Key is missing. Since you are running this locally, you must create a .env file containing GEMINI_API_KEY=your_api_key in the project root folder."
        : "I'm having trouble connecting to the network. Please find a staff member for assistance.";
      setChatHistory(prev => [...prev, { role: 'assistant', text: errorMsg }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSOS = () => {
    setIsEmergency(true);
    setCrisisData({
      severity: 10,
      type: "MANUAL SOS ACTIVATED",
      guest_instructions: "Please remain calm. Security and medical personnel have been immediately dispatched to this location.",
      staff_alert_code: "CODE RED - MANUAL SOS"
    });
  };

  const resetKiosk = () => {
    setIsEmergency(false);
    setCrisisData(null);
    setChatHistory([]);
  };

  const handleTestEmergency = () => {
    handleSend("There is a large fire in the main lobby! People are trapped!");
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Microphone not available", e);
        alert("Speech Recognition API is not supported in this browser or permission was denied. Try opening the preview in a new tab.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full font-sans bg-[#F1F5F9] text-[#0F172A] flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isEmergency && crisisData ? (
          <motion.div 
            key="emergency"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 bg-red-600 text-white z-50 flex flex-col items-center justify-center p-4 md:p-8 text-center overflow-hidden"
          >
            {/* Audio Siren */}
            <audio autoPlay loop className="hidden" src="/src/alarm-sound-effect.mp3" />

            {/* Visual Flashing Effect */}
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="fixed inset-0 border-[8px] md:border-[16px] border-yellow-400 pointer-events-none z-0"
            />
            
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center h-full gap-4 md:gap-6 z-10">
              <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-yellow-300 animate-[bounce_2s_infinite] shrink-0" />
              
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight drop-shadow-lg shrink-0 text-balance w-full px-2 break-words">
                {crisisData.type}
              </h1>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md border-2 md:border-4 border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-8 w-full flex-1 min-h-0 overflow-y-auto flex flex-col justify-center"
              >
                <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 text-yellow-300 text-balance shrink-0">EMERGENCY INSTRUCTIONS</h2>
                <p className="text-base sm:text-lg md:text-2xl font-medium leading-relaxed text-balance">
                  {crisisData.guest_instructions}
                </p>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 bg-black/40 rounded-2xl sm:rounded-full px-4 py-3 md:px-6 md:py-4 shrink-0 w-full sm:w-auto max-w-full"
              >
                <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-red-400 shrink-0" />
                <div className="text-center sm:text-left min-w-0">
                  <p className="text-[10px] md:text-xs text-gray-300 font-semibold uppercase tracking-wider truncate">Staff Alert Triggered</p>
                  <p className="text-base md:text-xl font-mono text-white truncate">{crisisData.staff_alert_code}</p>
                </div>
              </motion.div>

              <button 
                onClick={resetKiosk}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-red-600 rounded-full font-bold text-sm md:text-lg hover:bg-gray-100 transition shadow-xl shrink-0 w-full sm:w-auto"
              >
                Resolve / Return to Normal Desk
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen w-full relative z-10"
          >
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <ShieldAlert className="text-white w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">GuardianKiosk <span className="text-indigo-600">AI System</span></h1>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <button 
                  onClick={handleTestEmergency}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-orange-50 hover:text-orange-600 transition shadow-sm hidden sm:flex items-center gap-2 border border-slate-200"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Test Fire Event
                </button>
                <button 
                  onClick={handleSOS}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 transition flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  SOS
                </button>
              </div>
            </header>

            <div className="flex-1 p-6 flex flex-col gap-4 max-w-5xl mx-auto w-full overflow-hidden">
              {/* Chat Area */}
              <main className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-y-auto p-6 flex flex-col gap-6">
              {chatHistory.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">How can I help you today?</h2>
                  <p className="text-slate-500 mb-8 max-w-xl font-medium">
                    I am the virtual concierge for Guardian Hotel. I can assist you with directions, room service, or provide immediate crisis coordination.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <button onClick={() => setInput("Can I get an extra towel sent to Room 204?")} className="p-4 bg-slate-50 border border-slate-200 shadow-sm text-slate-700 rounded-2xl text-left hover:border-indigo-400 hover:text-indigo-600 transition text-sm font-medium">
                      "Can I get an extra towel sent to Room 204?"
                    </button>
                    <button onClick={() => setInput("Someone is having a heart attack in the lobby!")} className="p-4 bg-red-50 border border-red-200 shadow-sm text-red-700 rounded-2xl text-left hover:bg-red-100 transition text-sm font-medium">
                      "Someone is having a heart attack in the lobby!"
                    </button>
                  </div>
                </div>
              )}
              
              {chatHistory.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex items-end gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                      <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm' 
                      : 'bg-slate-50 border border-slate-200 text-[#0F172A] rounded-bl-sm shadow-sm'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {isProcessing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 max-w-3xl mr-auto">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-3 text-[#0F172A]">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-sm font-medium">Analyzing situation...</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} className="h-4" />
            </main>

              {/* Input Area */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 shrink-0 z-20 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleListening}
                    className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isListening ? 'bg-red-50 text-red-600 animate-pulse border border-red-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 shadow-sm'
                    }`}
                    aria-label="Voice Input via Web Speech API"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
                    className="flex-1 flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all overflow-hidden shadow-sm h-12"
                  >
                    <input 
                      type="text" 
                      placeholder={isListening ? "Listening (speak clearly)..." : "Type your request or report an emergency here..."}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isProcessing}
                      className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-[#0F172A] disabled:opacity-50 font-medium placeholder:text-slate-400 h-full"
                    />
                    <button 
                      type="submit" 
                      disabled={!input.trim() || isProcessing}
                      className="h-8 px-4 py-1 mr-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 text-sm font-bold shrink-0"
                    >
                      <span className="hidden sm:inline mr-2">Submit</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Powered by Google Gemini 2.5 Flash</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
