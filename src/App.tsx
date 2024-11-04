import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Barcode, Download, RefreshCw, Copy, ChevronDown } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import { DynamicBackground } from './components/DynamicBackground';
import { BarcodeScanner } from './components/BarcodeScanner';

type BarcodeFormat = 'CODE128' | 'EAN13' | 'UPC' | 'CODE39' | 'ITF14';

const formats: { value: BarcodeFormat; label: string }[] = [
  { value: 'CODE128', label: 'Code 128' },
  { value: 'EAN13', label: 'EAN-13' },
  { value: 'UPC', label: 'UPC' },
  { value: 'CODE39', label: 'Code 39' },
  { value: 'ITF14', label: 'ITF-14' }
];

function App() {
  const [input, setInput] = useState('1234567890');
  const [format, setFormat] = useState<BarcodeFormat>('CODE128');
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    generateBarcode();
  }, [input, format]);

  const generateBarcode = () => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, input, {
        format,
        width: 2,
        height: 100,
        displayValue: true,
        background: 'transparent',
        lineColor: "#fff",
        fontSize: 16,
        font: 'Inter, sans-serif',
        margin: 10
      });
      setError('');
    } catch (err) {
      setError('Invalid input for selected barcode format');
    }
  };

  const downloadBarcode = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${format}-${input}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!svgRef.current) return;
    try {
      await navigator.clipboard.writeText(input);
      alert('Barcode value copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const handleScan = (result: string) => {
    setInput(result);
  };

  return (
    <DynamicBackground>
      <div className="p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8 sm:mb-12">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-lg">
              <Barcode className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Barcode Generator
            </h1>
          </div>

          <div className="relative backdrop-blur-xl bg-white/[0.02] rounded-2xl p-4 sm:p-8 shadow-2xl border border-white/10 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-2xl">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Barcode Format</label>
                <div className="relative">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                  >
                    {formats.map((f) => (
                      <option key={f.value} value={f.value} className="bg-gray-900">
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Barcode Value</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                    placeholder="Enter barcode value"
                  />
                  <button
                    onClick={() => setInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isMobile && (
                <div className="pt-2">
                  <BarcodeScanner onScan={handleScan} />
                </div>
              )}

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  {error}
                </div>
              )}

              <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-xl p-6 sm:p-10 flex items-center justify-center border border-white/5">
                <svg ref={svgRef} className="max-w-full filter drop-shadow-lg"></svg>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadBarcode}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                >
                  <Download className="w-5 h-5" />
                  Download SVG
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <Copy className="w-5 h-5" />
                  Copy Value
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DynamicBackground>
  );
}

export default App;