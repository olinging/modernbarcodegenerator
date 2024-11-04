import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const codeReader = useRef(new BrowserMultiFormatReader());

  const startScanning = async () => {
    if (!videoRef.current) return;
    
    try {
      setIsScanning(true);
      setError('');
      
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            onScan(result.getText());
            stopScanning();
          }
          if (err && err?.message !== 'No MultiFormat Readers were able to detect the code.') {
            setError('Error scanning barcode. Please try again.');
          }
        }
      );
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    codeReader.current.reset();
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      codeReader.current.reset();
    };
  }, []);

  return (
    <div className="space-y-4">
      {!isScanning ? (
        <button
          onClick={startScanning}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
        >
          <Camera className="w-5 h-5" />
          Scan Barcode
        </button>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded-xl overflow-hidden"
          ></video>
          <button
            onClick={stopScanning}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
          >
            Stop Scanning
          </button>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
};