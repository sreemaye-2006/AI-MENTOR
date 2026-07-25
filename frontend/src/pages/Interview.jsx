import { useEffect, useState, useRef, useCallback } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { GlassCard } from "../components/GlassCards";
import { Mic, MicOff, Settings, Play, History, Star, TrendingUp, AlertCircle, Loader, Send, Clock, Video } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { getHistory, startInterview, submitAnswer } from "../services/interviewServices";
import { toast } from "react-hot-toast";

export default function Interview() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Active interview state
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [finalReport, setFinalReport] = useState(null);

  // Timer and Voice State
  const TIME_LIMIT = 180; // 3 minutes
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
  // Camera State
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  // Use a ref to access the latest answer in speech callback without recreating the object
  const answerRef = useRef(answer);
  
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await getHistory();
      if (res.data) {
        setHistory(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    
    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = false;
        reco.lang = 'en-US';

        reco.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setAnswer(prev => prev + (prev.endsWith(' ') ? '' : ' ') + finalTranscript.trim());
          }
        };

        reco.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          toast.error("Microphone error. Please check permissions.");
        };
        
        reco.onend = () => {
          setIsRecording(false);
        };

        setRecognition(reco);
      }
    }
  }, []);

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, isInterviewing]);

  const stopMediaStream = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, [stopMediaStream]);

  const handleStart = async () => {
    try {
      setProcessing(true);
      
      // Strict Camera & Mic requirement
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
      } catch (err) {
        console.error("Media devices error:", err);
        toast.error("Camera and Microphone access is strictly required to start the interview.");
        setProcessing(false);
        return; // Block interview from starting
      }

      toast.loading("Starting interview...", { id: "int" });
      const res = await startInterview();
      if (res.data && res.data.success) {
        setIsInterviewing(true);
        setActiveQuestion(res.data.response);
        setQuestionNumber(res.data.questionNumber);
        setFinalReport(null);
        setTimeLeft(TIME_LIMIT);
        toast.success("Interview started!", { id: "int" });
      } else {
        // If API fails after granting camera, stop it
        stopMediaStream();
        toast.error("Failed to start interview.", { id: "int" });
      }
    } catch (error) {
      console.error(error);
      stopMediaStream();
      toast.error("Failed to start interview.", { id: "int" });
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmitAnswer = useCallback(async () => {
    // If timer ran out and answer is empty, we still submit it to move forward
    if (!answerRef.current.trim() && timeLeft > 0) return; 
    
    // Stop recording if active
    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }

    try {
      setProcessing(true);
      toast.loading("Submitting answer...", { id: "ans" });
      const res = await submitAnswer({ answer: answerRef.current });
      if (res.data && res.data.success) {
        if (res.data.response) {
          // Next question
          setActiveQuestion(res.data.response);
          setQuestionNumber(res.data.questionNumber);
          setAnswer("");
          setTimeLeft(TIME_LIMIT);
          toast.success("Answer submitted!", { id: "ans" });
        } else if (res.data.totalScore !== undefined) {
          // Interview complete
          setIsInterviewing(false);
          setActiveQuestion(null);
          setAnswer("");
          setFinalReport(res.data);
          stopMediaStream(); // Stop camera when done
          fetchHistory(); // Refresh history
          toast.success("Interview completed!", { id: "ans" });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit answer.", { id: "ans" });
    } finally {
      setProcessing(false);
    }
  }, [isRecording, recognition, timeLeft, stopMediaStream]);

  // Timer Countdown Logic
  useEffect(() => {
    let timer;
    if (isInterviewing && activeQuestion && timeLeft > 0 && !processing) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isInterviewing && !processing) {
      // Auto-submit when time is up
      toast.error("Time is up! Submitting current answer.");
      handleSubmitAnswer();
    }
    return () => clearInterval(timer);
  }, [isInterviewing, activeQuestion, timeLeft, processing, handleSubmitAnswer]);

  const toggleRecording = () => {
    if (!recognition) {
      toast.error("Voice recognition not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / history.length) 
    : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Interview Prep</h1>
        <p className="text-slate-400">Practice your skills and get real-time feedback for {user?.currentRoleGoal || "Frontend Developer"} roles.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <GlassCard className="relative overflow-hidden group min-h-[400px] flex flex-col items-center justify-center text-center p-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-colors duration-1000" />
            
            <div className="relative z-10 w-full max-w-2xl mx-auto">
              {finalReport ? (
                <div className="text-left bg-slate-900/50 p-6 rounded-xl border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center text-green-400">Interview Completed!</h2>
                  <div className="mb-4">
                    <span className="text-slate-400">Total Score:</span>
                    <span className="text-white font-bold ml-2 text-xl">{finalReport.totalScore}</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-white mb-2">Overall Feedback:</h3>
                    <p className="text-slate-300 text-sm">{finalReport.overallFeedback}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-green-400 mb-2">Strengths:</h3>
                    <ul className="list-disc list-inside text-slate-300 text-sm">
                      {finalReport.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-semibold text-red-400 mb-2">Weaknesses:</h3>
                    <ul className="list-disc list-inside text-slate-300 text-sm">
                      {finalReport.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <button onClick={() => setFinalReport(null)} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">Done</button>
                  </div>
                </div>
              ) : isInterviewing ? (
                <div className="w-full text-left flex flex-col h-full relative">
                  
                  {/* Floating Camera Feed */}
                  <div className="absolute -right-8 -top-8 w-48 h-36 bg-slate-900 rounded-xl overflow-hidden border-2 border-violet-500/50 shadow-2xl z-20">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-[10px] text-white font-bold tracking-wider">REC</span>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between pr-44">
                    <h3 className="text-violet-400 font-bold">Question {questionNumber} / 5</h3>
                    <div className={`flex items-center gap-2 font-mono font-bold text-lg px-3 py-1 rounded-lg ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'}`}>
                      <Clock size={18} /> {formatTime(timeLeft)}
                    </div>
                  </div>
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-white/10 mb-4 shadow-inner">
                    <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">{activeQuestion}</p>
                  </div>
                  <div className="relative flex-grow">
                    <textarea 
                      className={`w-full bg-slate-900/50 border rounded-xl p-4 text-white focus:outline-none min-h-[160px] resize-none transition-colors ${isRecording ? 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-white/10 focus:border-cyan-500'}`}
                      placeholder={isRecording ? "Listening... Speak now" : "Type your answer here or click the microphone to speak..."}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      disabled={processing}
                    />
                    
                    {/* Controls */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        onClick={toggleRecording}
                        disabled={processing}
                        className={`p-3 rounded-lg transition-all ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
                        title={isRecording ? "Stop Recording" : "Start Recording"}
                      >
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>

                      <button 
                        onClick={handleSubmitAnswer}
                        disabled={processing || (!answer.trim() && timeLeft > 0)}
                        className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-lg"
                      >
                        {processing ? <Loader size={20} className="animate-spin" /> : <><Send size={20} /> Submit</>}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full border-4 border-violet-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-[pulse_3s_ease-in-out_infinite]">
                    <Video size={40} className="text-violet-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Strict Proctored Interview</h2>
                  <p className="text-slate-400 max-w-md mx-auto mb-8">
                    To start the interview, you must allow camera and microphone access. Your video feed will be active throughout the session.
                    <br/><b>5 Questions • 3 Minutes Each</b>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={handleStart}
                      disabled={processing}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {processing ? <Loader size={20} className="animate-spin" /> : <Play size={20} />} Start Interview
                    </button>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Quick Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Average Score</span>
                  <span className="text-white font-bold">{avgScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${avgScore}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Interviews Taken</span>
                  <span className="text-white font-bold">{history.length}</span>
                </div>
              </div>

              {history.length > 0 && (
                <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl mt-4">
                  <div className="flex gap-3">
                    <AlertCircle size={20} className="text-violet-400 shrink-0" />
                    <p className="text-sm text-violet-200/80">Keep practicing to improve your technical depth.</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <History size={24} className="text-violet-400" /> Past Interviews
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingHistory ? (
          <div className="col-span-full flex justify-center p-10"><Loader className="animate-spin text-violet-500" size={32} /></div>
        ) : history.length === 0 ? (
          <div className="col-span-full text-slate-400">No past interviews found. Start one above!</div>
        ) : (
          history.map((item) => (
            <GlassCard key={item._id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-3">{item.role} Interview</h3>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-current" />
                  <span className="font-bold">{item.totalScore || 0}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-400 flex-1 leading-relaxed line-clamp-3">
                "{item.overallFeedback || "No feedback available."}"
              </p>
              
              <button 
                onClick={() => {
                  setFinalReport(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-6 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold text-white transition-colors">
                View Detailed Report
              </button>
            </GlassCard>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
