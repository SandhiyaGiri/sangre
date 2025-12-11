'use client';

import { useState, useRef } from 'react';
import { Language, getTranslation } from '@/lib/translations';

interface ReportUploaderProps {
  onUploadSuccess: (reportId: string, patientName: string) => void;
  onUploadError: (error: string) => void;
  language: Language;
}

export default function ReportUploader({
  onUploadSuccess,
  onUploadError,
  language,
}: ReportUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    try {
      const fileContent = await file.text();
      const reportData = JSON.parse(fileContent);

      const response = await fetch('/api/upload-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.errors?.join(', ') || 'Upload failed';
        onUploadError(errorMsg);
        setFileName(null);
      } else {
        onUploadSuccess(result.report_id, result.patient_name);
      }
    } catch (error) {
      onUploadError(
        error instanceof Error ? error.message : 'Failed to process file'
      );
      setFileName(null);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4">
        {getTranslation(language, 'upload_report')}
      </h2>

      <div
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />

        <div className="text-slate-400 mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        {isLoading ? (
          <p className="text-slate-300">{getTranslation(language, 'uploading')}</p>
        ) : fileName ? (
          <p className="text-blue-400 font-medium">{fileName}</p>
        ) : (
          <>
            <p className="text-slate-300 font-medium">
              {getTranslation(language, 'choose_file')}
            </p>
            <p className="text-slate-500 text-sm mt-1">JSON format required</p>
          </>
        )}
      </div>

      <p className="text-slate-400 text-xs mt-4">
        Expected format: {'{'}patient, test_date, lab_values{'}'}
      </p>
    </div>
  );
}
