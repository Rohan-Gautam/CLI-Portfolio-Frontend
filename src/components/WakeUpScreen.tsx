import React, { useState, useEffect } from 'react';

// A collection of humorous, developer-centric loading logs displayed to the user
// while waiting for a cold backend instance (like Render's free tier) to spin up.
const LOGS = [
    "☕ Delivering espresso to the Spring Boot server...",
    "📢 Politely asking Render to stop napping...",
    "🐢 JVM is stretching before today's marathon...",
    "🔌 Plugging caffeine directly into Tomcat...",
    "🧹 Cleaning stack traces from yesterday...",
    "🧠 Convincing the garbage collector everything is okay...",
    "🛌 Backend says 'five more minutes'...",
    "🚪 Knocking on port 8080...",
    "📞 Calling localhost... nobody answered...",
    "📨 Sending motivational emails to Spring...",
    "🧊 Defrosting frozen microservices...",
    "🐧 Linux is pretending this is normal...",
    "🔥 Heating JVM with premium electricity...",
    "⚙ Rotating gears clockwise for extra FPS...",
    "🚀 Attaching rockets to the REST API...",
    "📚 Hibernate is looking for its glasses...",
    "☁ Asking Render nicely to wake up...",
    "🦥 Server currently operating at sloth speed...",
    "🔍 Searching for lost packets under the sofa...",
    "🧼 Washing dirty cache entries...",
    "🎩 Pulling API responses from a magical hat...",
    "🦆 Debugging ducks have entered the meeting...",
    "📦 Unboxing freshly compiled Java bytecode...",
    "🍕 Feeding pizza to the compiler...",
    "🧙 Summoning backend spirits with ancient annotations...",
    "⚡ Charging electrons...",
    "💤 Server detected. Snooze button also detected...",
    "🤝 Negotiating peace between React and Spring...",
    "🛰 Sending satellite ping toward Render...",
    "🎮 Loading 16 chunks... almost there..."
];

export const WakeUpScreen: React.FC = () => {
    // currentIdx: Tracks which humorous message from the LOGS array is currently visible.
    const [currentIdx, setCurrentIdx] = useState(0);

    // progress: Tracks the simulated loading percentage. Starts at 5% to feel like it's already working.
    const [progress, setProgress] = useState(5);

    useEffect(() => {
        // Interval 1: Cycle through the loading logs array sequentially every 3000ms (3 seconds).
        const logInterval = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % LOGS.length);
        }, 3000);

        // Interval 2: Fake progress incrementing every 1500ms (1.5 seconds).
        // It increases by a random step (0 to 3 percent) but deliberately caps at 95% 
        // to prevent reaching 100% before the actual server responds.
        const progressInterval = setInterval(() => {
            setProgress((prev) => (prev < 95 ? prev + Math.floor(Math.random() + Math.random() +
                Math.random() + Math.random() + Math.random()) : 95));
        }, 500);

        // Cleanup function: Clears both intervals when the component unmounts to prevent memory leaks.
        return () => {
            clearInterval(logInterval);
            clearInterval(progressInterval);
        };
    }, []);

    // NEW: Refresh the page automatically if progress exceeds 90%
    useEffect(() => {
        if (progress > 94) {
            window.location.reload();
        }
    }, [progress]);

    /**
     * Generates a retro, CLI-style visual text progress bar using Unicode block characters.
     * @param percent - The current progress percentage (0 - 100)
     * @returns A string representing the progress bar (e.g., "██████░░░░░░░░░░░░")
     */
    const getProgressBar = (percent: number) => {
        const totalBlocks = 25; // Length of the loading bar in characters
        const filledBlocks = Math.floor((percent / 100) * totalBlocks);

        // Combines filled blocks (█) and empty blocks (░) to draw the current state
        return '█'.repeat(filledBlocks) + '░'.repeat(totalBlocks - filledBlocks);
    };

    return (
        // Fullscreen highly classified terminal environment (Matrix/Spy aesthetic)
        <div className="relative w-screen h-screen flex flex-col items-center justify-center font-mono bg-[#050505] text-green-500 select-none overflow-hidden p-4 md:p-8">

            {/* CRT Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

            {/* Main Terminal Window */}
            <div className="max-w-2xl w-full border border-green-500/30 bg-black/80 shadow-[0_0_30px_rgba(0,255,0,0.1)] p-1 rounded-sm relative z-10 backdrop-blur-sm">

                {/* HUD Corner Decorators */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500"></div>

                <div className="p-6 md:p-10 flex flex-col justify-center">

                    {/* Header Section */}
                    <div className="flex justify-between items-start md:items-end border-b border-green-500/30 pb-3 mb-4">
                        <div>
                            <h1 className="text-lg md:text-xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                                UPLINK_ESTABLISHED
                            </h1>
                            <p className="text-[9px] md:text-xs text-green-600 mt-1 uppercase tracking-[0.2em]">
                                Clearance Level: Omega // Classified
                            </p>
                        </div>
                        <div className="text-[9px] md:text-[10px] text-red-500 animate-pulse text-right">
                            <p>WARNING: THE SERVER IS DOWN</p>
                            <p>TRYING TO REVIVE IT</p>
                            <p>SYS_TRACE: ACTIVE</p>
                        </div>
                    </div>

                    {/* NEW: Center ASCII Art (Responsive & Glowing) */}
                    <div className="flex justify-center w-full my-6 md:my-8 overflow-hidden select-text">
                        <pre className="text-green-400 text-[10px] sm:text-[12px] md:text-sm font-bold leading-tight drop-shadow-[0_0_15px_rgba(34,197,94,0.9)] animate-pulse">
                            {` ____       _                 
|  _ \\ ___ | |__   __ _ _ __  
| |_) / _ \\| '_ \\ / _\` | '_ \\ 
|  _ < (_) | | | | (_| | | | |
|_| \\_\\___/|_| |_|\\__,_|_| |_|`}
                        </pre>
                    </div>

                    {/* Target Data Grid */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6 text-[10px] md:text-xs mb-8 bg-green-950/20 p-4 border-l-2 border-green-500 shadow-inner">
                        <div>
                            <p className="text-green-700 uppercase tracking-widest mb-1">Target_Host</p>
                            <p className="text-green-300 font-bold tracking-wider">render.com <span className="text-green-700 font-normal hidden sm:inline">:: port_8080</span></p>
                        </div>
                        <div>
                            <p className="text-green-700 uppercase tracking-widest mb-1">Service_Node</p>
                            <p className="text-green-300 font-bold tracking-wider">CLI-Portfolio-backend</p>
                        </div>
                        <div>
                            <p className="text-green-700 uppercase tracking-widest mb-1">Encryption</p>
                            <p className="text-green-300 font-bold tracking-wider">RSA-4096 <span className="text-green-500 animate-pulse">[SECURE]</span></p>
                        </div>
                        <div>
                            <p className="text-green-700 uppercase tracking-widest mb-1">Node_Status</p>
                            <p className="text-amber-500 font-bold animate-pulse flex items-center gap-1.5 md:gap-2">
                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full inline-block shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                                OFFLINE_HIBERNATION
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar Display */}
                    <div className="mb-6">
                        <div className="flex justify-between text-[9px] md:text-xs mb-2 text-green-600 uppercase tracking-widest">
                            <span>Executing_Wake_Protocol...</span>
                            <span className="text-green-400 font-bold">SYS.PROGRESS: {progress}%</span>
                        </div>
                        <div className="text-green-500 text-xs md:text-lg w-full flex items-center gap-1 md:gap-2">
                            <span className="text-green-800 font-bold">[</span>
                            <span className="tracking-[0.1em] w-full text-center drop-shadow-[0_0_5px_rgba(34,197,94,0.4)]">
                                {getProgressBar(progress)}
                            </span>
                            <span className="text-green-800 font-bold">]</span>
                        </div>
                    </div>

                    {/* Intercepted Logs (Command Line Style) */}
                    <div className="relative bg-black border border-green-500/20 p-3 md:p-4 h-14 md:h-16 flex items-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-green-500/30 shadow-[0_0_8px_rgba(0,255,0,0.8)]"></div>

                        <span className="text-green-700 mr-2 md:mr-3 text-xs md:text-sm font-bold">guest@rohan-os:~$</span>
                        <span className="text-green-400 text-[10px] md:text-xs tracking-wide">
                            {LOGS[currentIdx]}
                            <span className="animate-[pulse_1s_steps(2,start)_infinite] inline-block w-2 md:w-2.5 h-3 md:h-4 bg-green-400 ml-2 align-middle"></span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Background Hex Noise / Coordinates (Decorative) */}
            <div className="absolute bottom-4 right-6 text-green-900/40 text-[10px] text-right pointer-events-none hidden md:block font-bold tracking-widest">
                <p>0x7A99F • 0x11B4C • 0x9900A</p>
                <p>SAT_LINK: 34.0522° N, 118.2437° W</p>
            </div>
        </div>
    );
};