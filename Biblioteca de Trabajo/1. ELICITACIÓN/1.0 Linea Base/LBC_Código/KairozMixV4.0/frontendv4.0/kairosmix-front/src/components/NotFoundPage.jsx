function NotFoundPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-900">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-red-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-100 h-100 bg-slate-500/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
                <div className="mb-8">
                    <h1 className="text-[150px] font-black text-white/10 leading-none select-none">
                        404
                    </h1>
                    <div className="relative -mt-20">
                        <div className="w-20 h-20 mx-auto flex items-center justify-center bg-linear-to-br from-red-400 to-red-600 rounded-2xl shadow-[0_8px_30px_-5px_rgba(239,68,68,0.5)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Página no encontrada
                </h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Lo sentimos, la página que buscas no existe o no tienes permisos para acceder a ella.
                </p>

                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Volver al inicio
                </a>
            </div>
        </div>
    );
}

export default NotFoundPage;
