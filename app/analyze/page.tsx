'use client';

import { useState, useEffect } from 'react';

interface ScannedFile {
  filePath: string;
  relativePath: string;
  size: number;
  isLikelyInstagramExport: boolean;
}

interface FileAnalysis {
  file: ScannedFile;
  rawContent: any[];
  parsedContent: any[];
  error?: string;
  structure: string;
}

interface AnalysisResponse {
  success: boolean;
  files: FileAnalysis[];
  totalFiles: number;
}

export default function AnalyzePage() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileAnalysis | null>(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const response = await fetch('/api/analyze-files');
      const result: AnalysisResponse = await response.json();
      if (result.success) {
        setAnalysis(result);
      }
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p>Analyzing Instagram export files...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Failed to analyze files.</p>
        <button
          onClick={fetchAnalysis}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Instagram Export Analysis</h1>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="text-gray-600">
          Found {analysis.totalFiles} files total. Click on any file to see detailed analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* File List */}
        <div className="rounded-lg border bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">Files</h2>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {analysis.files.map((fileAnalysis, index) => (
              <div
                key={index}
                className={`p-3 rounded border cursor-pointer hover:bg-gray-50 ${
                  selectedFile?.file.filePath === fileAnalysis.file.filePath
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedFile(fileAnalysis)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileAnalysis.file.relativePath}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileAnalysis.file.size / 1024).toFixed(1)} KB • {fileAnalysis.structure}
                    </p>
                  </div>
                  <div className="ml-2 flex items-center space-x-2">
                    {fileAnalysis.parsedContent.length > 0 && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        {fileAnalysis.parsedContent.length} items
                      </span>
                    )}
                    {fileAnalysis.error && (
                      <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                        Error
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Details */}
        <div className="rounded-lg border bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">File Details</h2>
          {selectedFile ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">File Info</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Path:</strong> {selectedFile.file.relativePath}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Size:</strong> {(selectedFile.file.size / 1024).toFixed(1)} KB
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Structure:</strong> {selectedFile.structure}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Parsed Items:</strong> {selectedFile.parsedContent.length}
                </p>
              </div>

              {selectedFile.error && (
                <div className="rounded bg-red-50 p-3">
                  <h4 className="font-medium text-red-800 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{selectedFile.error}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Raw Content (First Item)</h3>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-40 overflow-y-auto">
                  {JSON.stringify(selectedFile.rawContent[0], null, 2)}
                </pre>
              </div>

              {selectedFile.parsedContent.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Parsed Content (First Item)</h3>
                  <pre className="text-xs bg-green-50 p-3 rounded overflow-x-auto max-h-40 overflow-y-auto">
                    {JSON.stringify(selectedFile.parsedContent[0], null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Summary</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Raw items:</strong> {selectedFile.rawContent.length}</p>
                  <p><strong>Successfully parsed:</strong> {selectedFile.parsedContent.length}</p>
                  <p><strong>Parse success rate:</strong> {selectedFile.rawContent.length > 0 ? ((selectedFile.parsedContent.length / selectedFile.rawContent.length) * 100).toFixed(1) : 0}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a file to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}