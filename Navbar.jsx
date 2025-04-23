function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#00ff9d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-[#00ff9d] text-xl font-mono font-bold animate-pulse">
              CyberLearn
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="#home">Home</NavLink>
              <NavLink href="#news">News</NavLink>
              <NavLink href="#notes">Notes</NavLink>
              <NavLink href="#blog">Blog</NavLink>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black transition-all"
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-[#00ff9d] px-3 py-2 rounded-md text-sm font-medium transition-all hover:shadow-[0_0_10px_#00ff9d]"
    >
      {children}
    </a>
  );
}

export default Navbar; 