export default function Navbar({ uploads, scrollToSection }) {
  return (
    <nav className="sticky top-0 z-20 backdrop-blur-sm">
      <div className="flex flex-wrap gap-3 px-6 py-4 justify-center glass-panel">
        {uploads.map((item) => (
          <button
            key={item.endpoint}
            onClick={() => scrollToSection(item.endpoint)}
            className="px-4 py-2 rounded-full text-sm font-medium muted-text accent-outline hover:bg-[var(--accent)] hover:text-white transition"
          >
            {item.title}
          </button>
        ))}
      </div>
    </nav>
  );
}