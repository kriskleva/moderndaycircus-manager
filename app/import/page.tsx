'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScannedFile {
  filePath: string;
  relativePath: string;
  size: number;
  isLikelyInstagramExport: boolean;
}

interface ScanResult {
  success: boolean;
  files: ScannedFile[];
  totalFiles: number;
  instagramFiles: number;
  error?: string;
}

export default function ImportPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/scan-instagram-export');
      const result = await response.json();
      setScanResult(result);
    } catch (error) {
      setScanResult({
        success: false,
        files: [],
        totalFiles: 0,
        instagramFiles: 0,
        error: 'Failed to scan directory',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Import Instagram Export</h1>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h2 className="mb-2 text-lg font-semibold">Export Directory</h2>
        <p className="text-gray-600">
          Scanning: /Users/kriskleva/Documents/ModernDayCircusManager
        </p>
        <p className="text-sm text-gray-500 mt-1">
          This directory contains your Instagram export files.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan Export Directory'}
        </button>
      </div>

      {scanResult && (
        <div className="mb-6">
          {scanResult.success ? (
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="text-green-800">Scan Complete</h3>
              <p className="text-green-700">
                Found {scanResult.totalFiles} files, {scanResult.instagramFiles} likely Instagram exports
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-red-50 p-4">
              <h3 className="text-red-800">Scan Failed</h3>
              <p className="text-red-700">{scanResult.error}</p>
            </div>
          )}
        </div>
      )}

      {scanResult?.success && scanResult.instagramFiles > 0 && (
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 text-blue-800">Ready to Continue</h3>
          <p className="mb-4 text-blue-700">
            {scanResult.instagramFiles} Instagram export files detected. Ready to extract and classify content.
          </p>
          <Link
            href="/library"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            View Content Library →
          </Link>
        </div>
      )}

      {scanResult?.files && scanResult.files.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Detected Files</h3>
          <div className="space-y-2">
            {scanResult.files.slice(0, 10).map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">{file.relativePath}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {file.isLikelyInstagramExport && (
                  <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-800">
                    Instagram Export
                  </span>
                )}
              </div>
            ))}
            {scanResult.files.length > 10 && (
              <p className="text-gray-500">... and {scanResult.files.length - 10} more files</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}