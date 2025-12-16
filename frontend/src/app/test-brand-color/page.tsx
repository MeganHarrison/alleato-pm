export default function TestBrandColorPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-bold text-brand">
        This text uses the brand color (#DB802D)
      </h1>
      
      <p className="text-lg">
        Regular text color for comparison
      </p>
      
      <p className="text-brand">
        This paragraph also uses the brand color with text-brand class
      </p>
      
      <div className="space-y-2">
        <button className="px-4 py-2 bg-brand text-white rounded">
          Button with brand background
        </button>
        
        <button className="px-4 py-2 border-2 border-brand text-brand rounded">
          Button with brand border and text
        </button>
      </div>
      
      <div className="p-4 border-l-4 border-brand bg-brand/10">
        <p className="text-brand font-semibold">
          Note: The brand color (#DB802D) is now available as:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm">
          <li>text-brand - for text color</li>
          <li>bg-brand - for background color</li>
          <li>border-brand - for border color</li>
          <li>ring-brand - for ring color</li>
          <li>Can be combined with opacity: text-brand/50, bg-brand/20, etc.</li>
        </ul>
      </div>
    </div>
  );
}