import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronLeft, Play, Pause, RotateCcw, RotateCw, FileDown } from 'lucide-react';
import Navbar from '../components/Navbar';
// We might need a video player library, but for now I'll build a custom UI wrapper around a standard video element or just the UI mock.
// Since the user wants "The same design", I will focus on the UI.

const Explanation = () => {
    const { questionId } = useParams();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(35); // Mock progress

    // Mock Data
    const explanationData = {
        title: "لوريم ايبسوم دولار سيت",
        description: `لوريم ايبسوم دولار سيت أميت كويرات إي، تيبور سيت. ديواس أوت بوت لابوريس نوسترو دو نويس ليجاتوس أليكويب مينيم إت لابورام لامبور إت أيت سيت.
بيريتيتيس. سيد أميت، لامبور نويس ماغنيت، ديتيكتورمي سيت إت كويرات كونسيفيكات لومينيير ماجنا دو نيسيوت نويس ماغنيت، إي ديواس سيت. إنيم لابوريس سيت دولار سيت
إيليت، توب ايبسوم إن تيت فوليام إنتيرديكتوم أليكويب أيت كويرات أيوتي نويس سيت دولار يوت لومينيير إنفيدونت إنتيروليكيشن أوت لومينيير أد أد ريبيوديامت كونسيكتيتور سيت
ريبيوديامت ديكتوم كويرات إي لومينيير دونك، دولار أليكويب ماغنيت، كويس كويرات فينيام. فوليام إنفيدونت ماجنا نويس لابوري إنتيرديكتوم كويرات. ماجنا سيت، فوليام نويس سيت
نيسي فوليام أليكويب إنتيروليكيشن إيليت، لامبور سيت فينيام، كويرات يوت أليكوي أيت فوليام كونسيكتيتور كونسيفيكات ماغنيت، توب إنفيدونت أدبييسشينج أيوبي إت إنتيرديكتوم
ايبسوم لابوريس سيت كونسيفيكات كونسيكتيتور سيت، أليكوي إنفيدونت أولامكو إيليت. تيمبور نويس كونسين ديتيكتورمي تيت إت إي كلارينتي كونسيكتيتور أميت، أ`,
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" // Placeholder
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20" dir="rtl">
            <Navbar /> {/* Assuming Navbar is used, though not strictly in the screenshot provided which only shows content. But easier to navigate. Wait, the screenshot HAS a navbar. */}

            <Container className="pt-32">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-slate-400 mb-8 text-lg font-bold">
                    <Link to="/" className="hover:text-slate-900 transition-colors">الرئيسية</Link>
                    <ChevronLeft size={20} />
                    <Link to="/topics" className="hover:text-slate-900 transition-colors">المواضيع</Link>
                    <ChevronLeft size={20} />
                    <span className="text-slate-900">{explanationData.title}</span>
                </div>

                {/* Video Player Container */}
                <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-12 group">
                    <video
                        src={explanationData.videoUrl}
                        className="w-full h-full object-cover opacity-60"
                        poster="/api/placeholder/1200/600"
                    />

                    {/* Custom Controls Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                        <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Top controls if any */}
                        </div>

                        {/* Center Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all pointer-events-auto transform hover:scale-110 active:scale-95"
                            >
                                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl">
                                    {isPlaying ? (
                                        <Pause size={40} className="fill-white" />
                                    ) : (
                                        <Play size={40} className="fill-white translate-x-1" />
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Bottom Controls */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center justify-center gap-12 mb-6">
                                <button className="hover:text-[#FFD131] transition-colors bg-black/20 rounded-full p-3 backdrop-blur-sm">
                                    <RotateCw size={32} />
                                    <span className="sr-only">Forward 15s</span>
                                    <span className="absolute text-[10px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-1">15</span>
                                </button>

                                <div className="flex gap-12">
                                    <button className="hover:text-[#FFD131] transition-colors"><ChevronLeft size={40} /></button>
                                    <button className="hover:text-[#FFD131] transition-colors"><ChevronLeft size={40} className="rotate-180" /></button>
                                </div>

                                <button className="hover:text-[#FFD131] transition-colors bg-black/20 rounded-full p-3 backdrop-blur-sm relative">
                                    <RotateCcw size={32} />
                                    <span className="sr-only">Rewind 15s</span>
                                    <span className="absolute text-[10px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-1">15</span>
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex items-center gap-4">
                                <span className="font-bold font-mono">1:25</span>
                                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer relative">
                                    <div className="absolute top-0 left-0 h-full bg-[#FFD131] w-[35%]"></div>
                                </div>
                                <span className="font-bold font-mono">3:15</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Text */}
                <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 mb-8">
                    <p className="text-lg lg:text-xl font-bold text-slate-700 leading-loose text-justify">
                        {explanationData.description}
                    </p>
                </div>

                {/* Download Button */}
                <div className="flex justify-end">
                    <button className="flex items-center gap-3 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-black text-xl transition-all shadow-sm hover:shadow-md group">
                        <FileDown size={28} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                        <span>تحميل المحتوي PDF</span>
                    </button>
                </div>

            </Container>
        </div>
    );
};

export default Explanation;
