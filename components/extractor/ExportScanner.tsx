interface ScannedFile {
  filePath: string;
  relativePath: string;
  size: number;
  isLikelyInstagramExport: boolean;
}

interface ExportScannerProps {
  files: ScannedFile[];
  onScan: () => void;
  isScanning: boolean;
}

export function ExportScanner({ files, onScan, isScanning }: ExportScannerProps) {
  const instagramFiles = files.filter(f => f.isLikelyInstagramExport);

  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold">Instagram Export Scanner</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Scanning directory for Instagram export files...
        </p>
      </div>

      <button
        onClick={onScan}
        disabled={isScanning}
        className="mb-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {isScanning ? 'Scanning...' : 'Scan Directory'}
      </button>

      {files.length > 0 && (
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Found {files.length} files, {instagramFiles.length} Instagram exports
          </p>
          <div className="max-h-40 overflow-y-auto">
            {files.slice(0, 5).map((file, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-sm truncate">{file.relativePath}</span>
                {file.isLikelyInstagramExport && (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}