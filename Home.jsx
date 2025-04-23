function Home() {
  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-[url('/images/hacker-dark.jpg')] bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/images/hacker-dark.jpg')"
        }}
      >
        {/* Matrix rain effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-mono font-bold text-[#00ff9d] mb-6 animate-glitch">
          Welcome to CyberLearn
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your journey into cybersecurity starts here
        </p>
        <div className="chatbot-container bg-black/50 backdrop-blur-md p-6 rounded-lg border border-[#00ff9d]/30">
          {/* Chatbot content */}
        </div>
      </div>
    </section>
  );
}

export default Home; 