export default function Navbar({ uploads, scrollToSection }) {
  return (
    <nav className="sticky top-0 bg-white shadow z-10">
      <div className="flex flex-wrap gap-3 px-6 py-4 justify-center">
        {uploads.map((item) => (
          <button
            key={item.endpoint}
            onClick={() => scrollToSection(item.endpoint)}
            className="px-4 py-2 border rounded-lg text-gray-700 font-medium
            hover:bg-blue-600 hover:text-white transition"
          >
            {item.title}
          </button>
        ))}
      </div>
    </nav>
  );
}