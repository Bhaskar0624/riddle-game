/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  BarChart3
} from 'lucide-react';
import { DB, ThemeName } from './gameDatabase';

// Sound Effects URLs
const SOUNDS = {
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  CORRECT: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  WRONG: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  TRANSITION: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
};

const TIMER_DURATION = 15; // Fixed timer duration

interface GameState {
  score: number;
  questionCount: number;
  currentQuestion: {
    theme: ThemeName;
    item: { name: string; hint: string; img: string };
    options: string[];
    answered: boolean;
    selectedOption: string | null;
    isCorrect: boolean | null;
  } | null;
  status: 'START' | 'PLAYING' | 'FINISHED' | 'STATS';
  askedQuestions: Set<string>; // Track asked questions to prevent repeats
  hintsRemaining: number; // Track remaining hints
}

interface Statistics {
  totalQuestions: number;
  correctAnswers: number;
  totalHintsUsed: number;
  categoryStats: {
    [key in ThemeName]?: {
      attempted: number;
      correct: number;
    };
  };
}

// Load statistics from localStorage
const loadStats = (): Statistics => {
  const saved = localStorage.getItem('nepGameStats');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    totalQuestions: 0,
    correctAnswers: 0,
    totalHintsUsed: 0,
    categoryStats: {}
  };
};

// Save statistics to localStorage
const saveStats = (stats: Statistics) => {
  localStorage.setItem('nepGameStats', JSON.stringify(stats));
};

export default function App() {
  const [state, setState] = useState<GameState>({
    score: 0,
    questionCount: 0,
    currentQuestion: null,
    status: 'START',
    askedQuestions: new Set(),
    hintsRemaining: 3,
  });

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [selectedThemes, setSelectedThemes] = useState<Set<ThemeName>>(new Set(Object.keys(DB) as ThemeName[]));
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>(loadStats());
  const [hintsUsedThisGame, setHintsUsedThisGame] = useState(0);

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Aggressive image preloading - preload next 10 images on start
  useEffect(() => {
    if (state.status === 'START') {
      const allImages: string[] = [];
      (Object.keys(DB) as ThemeName[]).forEach(theme => {
        if (selectedThemes.has(theme)) {
          DB[theme].items.forEach(item => allImages.push(item.img));
        }
      });
      
      // Shuffle and preload first 10 images
      const shuffled = allImages.sort(() => Math.random() - 0.5).slice(0, 10);
      shuffled.forEach(img => {
        const image = new Image();
        image.src = img;
      });
    }
  }, [state.status, selectedThemes]);

  const playSound = useCallback((soundUrl: string, volume = 0.4) => {
    if (isMuted) return;
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    audio.play().catch(() => {
      // Ignore autoplay restrictions errors
    });
  }, [isMuted]);

  const generateQuestion = useCallback(() => {
    playSound(SOUNDS.TRANSITION);
    
    // Filter themes based on selection
    const availableThemes: ThemeName[] = Array.from(selectedThemes);
    if (availableThemes.length === 0) {
      // If no themes selected, use all themes
      availableThemes.push(...(Object.keys(DB) as ThemeName[]));
    }
    
    // Collect all available questions that haven't been asked
    const availableQuestions: Array<{ theme: ThemeName; item: typeof DB[ThemeName]['items'][0] }> = [];
    availableThemes.forEach(theme => {
      DB[theme].items.forEach(item => {
        const questionKey = `${theme}-${item.name}`;
        if (!state.askedQuestions.has(questionKey)) {
          availableQuestions.push({ theme, item });
        }
      });
    });
    
    // If all questions have been asked, reset and show completion message
    if (availableQuestions.length === 0) {
      setState(prev => ({
        ...prev,
        status: 'FINISHED'
      }));
      return;
    }
    
    // Pick a random question from available ones
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    const { theme: randomThemeName, item: randomItem } = randomQuestion;
    const themeData = DB[randomThemeName];
    const correctAnswer = randomItem.name;
    const questionKey = `${randomThemeName}-${randomItem.name}`;

    // Get wrong options from the SAME theme to make them relatable
    const sameThemeItems = themeData.items
      .filter(i => i.name !== correctAnswer)
      .map(i => i.name);

    // Pick 3 unique wrong answers from the same theme
    const options = [correctAnswer];
    const shuffledSameTheme = [...sameThemeItems].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(3, shuffledSameTheme.length); i++) {
      options.push(shuffledSameTheme[i]);
    }

    // If for some reason we need more options (shouldn't happen with current DB), 
    // pull from other categories as fallback
    if (options.length < 4) {
      const allOtherItems: string[] = [];
      const themes = Object.keys(DB) as ThemeName[];
      themes.forEach(t => {
        DB[t].items.forEach(i => {
          if (!options.includes(i.name)) allOtherItems.push(i.name);
        });
      });
      while (options.length < 4 && allOtherItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * allOtherItems.length);
        options.push(allOtherItems.splice(randomIndex, 1)[0]);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    setTimeLeft(TIMER_DURATION);
    setIsImageLoading(false);
    setImageError(false);
    setShowImage(false); // Hide image for new question
    
    setState(prev => ({
      ...prev,
      questionCount: prev.questionCount + 1,
      askedQuestions: new Set(prev.askedQuestions).add(questionKey),
      currentQuestion: {
        theme: randomThemeName,
        item: randomItem,
        options,
        answered: false,
        selectedOption: null,
        isCorrect: null,
      }
    }));
  }, [playSound, selectedThemes, state.askedQuestions]);

  const startGame = () => {
    playSound(SOUNDS.CLICK);
    setShowThemeSelector(false);
    setHintsUsedThisGame(0);
    setState({
      score: 0,
      questionCount: 0,
      currentQuestion: null,
      status: 'PLAYING',
      askedQuestions: new Set(), // Reset asked questions
      hintsRemaining: 3, // Reset hints
    });
    generateQuestion();
  };

  const toggleTheme = (theme: ThemeName) => {
    playSound(SOUNDS.CLICK, 0.2);
    setSelectedThemes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(theme)) {
        newSet.delete(theme);
      } else {
        newSet.add(theme);
      }
      return newSet;
    });
  };

  const selectAllThemes = () => {
    playSound(SOUNDS.CLICK, 0.2);
    setSelectedThemes(new Set(Object.keys(DB) as ThemeName[]));
  };

  const deselectAllThemes = () => {
    playSound(SOUNDS.CLICK, 0.2);
    setSelectedThemes(new Set());
  };

  const handleAnswer = useCallback((option: string | null) => {
    if (!state.currentQuestion || state.currentQuestion.answered) return;

    const isCorrect = option === state.currentQuestion.item.name;
    const points = isCorrect ? 10 : 0;

    if (isCorrect) {
      playSound(SOUNDS.CORRECT, 0.8);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
    } else {
      playSound(SOUNDS.WRONG);
    }

    // Update statistics
    const newStats = { ...statistics };
    newStats.totalQuestions++;
    if (isCorrect) newStats.correctAnswers++;
    
    const theme = state.currentQuestion.theme;
    if (!newStats.categoryStats[theme]) {
      newStats.categoryStats[theme] = { attempted: 0, correct: 0 };
    }
    newStats.categoryStats[theme]!.attempted++;
    if (isCorrect) newStats.categoryStats[theme]!.correct++;
    
    setStatistics(newStats);
    saveStats(newStats);

    setState(prev => ({
      ...prev,
      score: prev.score + points,
      currentQuestion: prev.currentQuestion ? {
        ...prev.currentQuestion,
        answered: true,
        selectedOption: option,
        isCorrect,
      } : null
    }));
  }, [state.currentQuestion, playSound, statistics]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.status === 'PLAYING' && state.currentQuestion && !state.currentQuestion.answered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && state.currentQuestion && !state.currentQuestion.answered) {
      handleAnswer(null);
    }
    return () => clearInterval(timer);
  }, [state.status, state.currentQuestion, timeLeft, handleAnswer]);

  const restartGame = () => {
    playSound(SOUNDS.CLICK);
    setState({
      score: 0,
      questionCount: 0,
      currentQuestion: null,
      status: 'START',
      askedQuestions: new Set(), // Reset asked questions
      hintsRemaining: 3, // Reset hints
    });
  };

  return (
    <div className={`w-full max-w-xl mx-auto relative transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Control Buttons */}
      <div className="absolute -top-12 right-0 z-50 flex gap-2">
        {/* Statistics Button */}
        <button
          onClick={() => {
            playSound(SOUNDS.CLICK, 0.2);
            setState(prev => ({ ...prev, status: 'STATS' }));
          }}
          className={`p-3 rounded-full shadow-lg transition-all border ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700' 
              : 'bg-white/80 hover:bg-white text-cyan-600 border-white/20'
          } backdrop-blur-sm`}
          title="View Statistics"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            playSound(SOUNDS.CLICK, 0.2);
            setIsDarkMode(!isDarkMode);
          }}
          className={`p-3 rounded-full shadow-lg transition-all border ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 border-slate-700' 
              : 'bg-white/80 hover:bg-white text-slate-600 border-white/20'
          } backdrop-blur-sm`}
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {/* Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-full shadow-lg transition-all border ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
              : 'bg-white/80 hover:bg-white text-slate-600 border-white/20'
          } backdrop-blur-sm`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {state.status === 'STATS' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`rounded-3xl shadow-2xl p-8 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-white/20'
            }`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDarkMode ? 'bg-cyan-900/50' : 'bg-cyan-100'
            }`}>
              <BarChart3 className={`w-12 h-12 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </div>
            <h1 className={`text-4xl font-bold mb-6 tracking-tight text-center ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Statistics
            </h1>

            {/* Overall Stats */}
            <div className={`grid grid-cols-3 gap-4 mb-6 p-4 rounded-2xl ${
              isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
            }`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                  {statistics.totalQuestions}
                </div>
                <div className={`text-xs font-semibold mt-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Total Questions
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {statistics.totalQuestions > 0 
                    ? Math.round((statistics.correctAnswers / statistics.totalQuestions) * 100) 
                    : 0}%
                </div>
                <div className={`text-xs font-semibold mt-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  {statistics.totalHintsUsed}
                </div>
                <div className={`text-xs font-semibold mt-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Hints Used
                </div>
              </div>
            </div>

            {/* Category Stats */}
            <div className={`mb-6 p-4 rounded-2xl max-h-80 overflow-y-auto ${
              isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
            }`}>
              <h3 className={`text-sm font-bold mb-4 ${
                isDarkMode ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Performance by Category
              </h3>
              <div className="space-y-3">
                {(Object.keys(DB) as ThemeName[]).map((theme) => {
                  const stats = statistics.categoryStats[theme];
                  const attempted = stats?.attempted || 0;
                  const correct = stats?.correct || 0;
                  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
                  
                  return (
                    <div key={theme} className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-slate-600' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`${DB[theme].color} text-white px-2 py-1 rounded text-xs font-bold`}>
                            {DB[theme].icon}
                          </span>
                          <span className={`text-sm font-semibold ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-700'
                          }`}>
                            {theme}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {correct}/{attempted}
                          </span>
                          <span className={`text-sm font-bold ${
                            accuracy >= 70 
                              ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                              : accuracy >= 50
                                ? isDarkMode ? 'text-amber-400' : 'text-amber-600'
                                : isDarkMode ? 'text-rose-400' : 'text-rose-600'
                          }`}>
                            {accuracy}%
                          </span>
                        </div>
                      </div>
                      {attempted > 0 && (
                        <div className={`w-full h-2 rounded-full overflow-hidden ${
                          isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                        }`}>
                          <div 
                            className={`h-full transition-all ${
                              accuracy >= 70 ? 'bg-emerald-500' 
                              : accuracy >= 50 ? 'bg-amber-500' 
                              : 'bg-rose-500'
                            }`}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  playSound(SOUNDS.CLICK);
                  if (window.confirm('Are you sure you want to reset all statistics?')) {
                    const emptyStats: Statistics = {
                      totalQuestions: 0,
                      correctAnswers: 0,
                      totalHintsUsed: 0,
                      categoryStats: {}
                    };
                    setStatistics(emptyStats);
                    saveStats(emptyStats);
                  }
                }}
                className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Reset Stats
              </button>
              <button
                onClick={() => {
                  playSound(SOUNDS.CLICK);
                  setState(prev => ({ ...prev, status: 'START' }));
                }}
                className="flex-[2] px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:scale-105"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        )}

        {state.status === 'FINISHED' && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`rounded-3xl shadow-2xl p-8 text-center border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-white/20'
            }`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'
            }`}>
              <Trophy className={`w-12 h-12 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <h1 className={`text-4xl font-bold mb-4 tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              All Questions Completed!
            </h1>
            <p className={`mb-6 max-w-xs mx-auto text-lg ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              You've answered all available questions in the selected themes.
            </p>
            
            <div className={`mb-8 p-6 rounded-2xl ${
              isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
            }`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <Trophy className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`text-5xl font-bold ${
                  isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  {state.score}
                </span>
              </div>
              <p className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Total Points
              </p>
              <p className={`text-xs mt-2 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {state.questionCount} Questions Answered
              </p>
            </div>

            <button
              onClick={restartGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-orange-500 to-amber-500 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-200 hover:scale-105"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Back to Start
            </button>
          </motion.div>
        )}

        {state.status === 'START' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`rounded-3xl shadow-2xl p-8 text-center border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-white/20'
            }`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDarkMode ? 'bg-orange-900/50' : 'bg-orange-100'
            }`}>
              <ImageIcon className={`w-12 h-12 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
            <h1 className={`text-4xl font-bold mb-4 tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Smart Picture Riddle
            </h1>
            <p className={`mb-6 max-w-xs mx-auto text-lg ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Test your knowledge with unlimited fun riddles and beautiful pictures!
            </p>

            {/* Theme Selector Toggle */}
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className={`mb-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full transition-colors ${
                isDarkMode
                  ? 'text-orange-400 bg-orange-900/30 hover:bg-orange-900/50'
                  : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {selectedThemes.size === Object.keys(DB).length 
                ? 'All Themes Selected' 
                : `${selectedThemes.size} Theme${selectedThemes.size !== 1 ? 's' : ''} Selected`}
            </button>

            {/* Theme Selector Panel */}
            <AnimatePresence>
              {showThemeSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className={`rounded-2xl p-4 text-left ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-sm font-bold ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}>Select Themes</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllThemes}
                          className={`text-xs px-3 py-1 rounded-full transition-colors font-semibold ${
                            isDarkMode
                              ? 'bg-orange-900/50 text-orange-300 hover:bg-orange-900/70'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={deselectAllThemes}
                          className={`text-xs px-3 py-1 rounded-full transition-colors font-semibold ${
                            isDarkMode
                              ? 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          None
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {(Object.keys(DB) as ThemeName[]).map((theme) => {
                        const isSelected = selectedThemes.has(theme);
                        const themeData = DB[theme];
                        return (
                          <button
                            key={theme}
                            onClick={() => toggleTheme(theme)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
                              isSelected
                                ? `${themeData.color} text-white shadow-sm`
                                : isDarkMode
                                  ? 'bg-slate-600 text-slate-200 border border-slate-500 hover:border-slate-400'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                              {themeData.icon}
                            </span>
                            <span className="truncate">{theme}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={startGame}
              disabled={selectedThemes.size === 0}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-orange-500 to-amber-500 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              Start Game
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {selectedThemes.size === 0 && (
              <p className="text-xs text-rose-500 mt-3">Please select at least one theme</p>
            )}
          </motion.div>
        )}

        {state.status === 'PLAYING' && state.currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-3xl shadow-2xl p-6 md:p-8 border min-h-[600px] flex flex-col transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-white/20'
            }`}
          >
            {/* HUD */}
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                <HelpCircle className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm font-semibold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  Q {state.questionCount}
                </span>
              </div>
              
              {/* Hints Counter */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-amber-900/50' : 'bg-amber-50'
              }`}>
                <ImageIcon className={`w-4 h-4 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  {state.hintsRemaining} Hints
                </span>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-violet-900/50' : 'bg-violet-50'
              }`}>
                <Trophy className={`w-4 h-4 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                <motion.span 
                  key={state.score}
                  initial={{ scale: 1.2, color: isDarkMode ? '#a78bfa' : '#7c3aed' }}
                  animate={{ scale: 1, color: isDarkMode ? '#a78bfa' : '#7c3aed' }}
                  className={`text-sm font-bold ${
                    isDarkMode ? 'text-violet-400' : 'text-violet-600'
                  }`}
                >
                  {state.score}
                </motion.span>
              </div>
            </div>

            {/* Theme Tag */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mb-6"
            >
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm ${DB[state.currentQuestion.theme].color}`}>
                {DB[state.currentQuestion.theme].icon}
                {state.currentQuestion.theme}
              </div>
            </motion.div>

            {/* Timer Bar */}
            <div className={`w-full h-2 rounded-full overflow-hidden mb-6 ${
              isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
            }`}>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
                className={`h-full transition-colors ${
                  timeLeft < 5 
                    ? 'bg-rose-500' 
                    : timeLeft < 10 
                      ? 'bg-orange-500' 
                      : 'bg-emerald-500'
                }`}
              />
            </div>

            {/* Riddle Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 min-h-[80px] flex items-center justify-center"
            >
              <p className={`text-xl font-medium leading-relaxed italic ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                "{state.currentQuestion.item.hint}"
              </p>
            </motion.div>

            {/* Hint Button */}
            {!showImage && !state.currentQuestion.answered && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-6"
              >
                <button
                  onClick={() => {
                    if (state.hintsRemaining > 0) {
                      playSound(SOUNDS.CLICK, 0.3);
                      setShowImage(true);
                      setHintsUsedThisGame(prev => prev + 1);
                      const newStats = { ...statistics };
                      newStats.totalHintsUsed++;
                      setStatistics(newStats);
                      saveStats(newStats);
                      setState(prev => ({
                        ...prev,
                        hintsRemaining: prev.hintsRemaining - 1
                      }));
                    }
                  }}
                  disabled={state.hintsRemaining === 0}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-lg ${
                    state.hintsRemaining === 0
                      ? isDarkMode
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-105'
                        : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105'
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  {state.hintsRemaining === 0 ? 'No Hints Left' : `Show Picture Hint (${state.hintsRemaining} left)`}
                </button>
              </motion.div>
            )}

            {/* Image Container - Only shown after clicking hint */}
            {showImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border-4 shadow-inner group ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-600' 
                    : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-slate-50'
                }`}
              >
                {!imageError ? (
                  <img
                    key={state.currentQuestion.item.name}
                    src={state.currentQuestion.item.img}
                    alt={state.currentQuestion.item.name}
                    loading="eager"
                    decoding="async"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 blur-md group-hover:blur-sm"
                    referrerPolicy="no-referrer"
                    style={{ filter: 'blur(8px) brightness(0.9)' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                    <div className="text-center p-6">
                      <ImageIcon className="w-16 h-16 text-white/80 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white capitalize">
                        {state.currentQuestion.item.name}
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                {/* Difficulty indicator */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-white">Blurred Challenge</span>
                </div>
              </motion.div>
            )}

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 flex-grow">
              {state.currentQuestion.options.map((option, index) => {
                const isCorrect = option === state.currentQuestion?.item.name;
                const isSelected = option === state.currentQuestion?.selectedOption;
                const showResult = state.currentQuestion?.answered;

                let buttonClass = "w-full p-4 rounded-xl font-semibold transition-all duration-200 text-left flex items-center justify-between border-2 ";
                
                if (!showResult) {
                  if (isDarkMode) {
                    buttonClass += "bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-violet-500 hover:shadow-md text-slate-200 hover:scale-[1.02]";
                  } else {
                    buttonClass += "bg-slate-50 border-slate-100 hover:bg-white hover:border-orange-400 hover:shadow-md text-slate-700 hover:scale-[1.02]";
                  }
                } else {
                  if (isCorrect) {
                    buttonClass += isDarkMode 
                      ? "bg-emerald-900/50 border-emerald-500 text-emerald-300 shadow-sm" 
                      : "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm";
                  } else if (isSelected) {
                    buttonClass += isDarkMode 
                      ? "bg-rose-900/50 border-rose-500 text-rose-300 shadow-sm" 
                      : "bg-rose-50 border-rose-500 text-rose-700 shadow-sm";
                  } else {
                    buttonClass += isDarkMode 
                      ? "bg-slate-700 border-slate-600 text-slate-500 opacity-60" 
                      : "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                  }
                }

                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <span className="capitalize">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback & Next */}
            <AnimatePresence>
              {state.currentQuestion.answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className={`text-xl font-bold flex items-center gap-2 ${
                    state.currentQuestion.isCorrect 
                      ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      : isDarkMode ? 'text-rose-400' : 'text-rose-600'
                  }`}>
                    {state.currentQuestion.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        Correct! +10 Points
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        {state.currentQuestion.selectedOption === null ? "Time's Up! " : "Oops! "}
                        It was {state.currentQuestion.item.name.toUpperCase()}
                      </>
                    )}
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={restartGame}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-colors ${
                        isDarkMode
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restart
                    </button>
                    <button
                      onClick={generateQuestion}
                      className={`flex-[2] flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-colors shadow-lg ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-violet-900/50'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-100'
                      }`}
                    >
                      Next Question
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
