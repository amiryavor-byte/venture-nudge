import React from 'react';
import { FileText } from 'lucide-react';

interface PDFDownloadButtonProps {
    data?: any;
    fileName: string;
    targetId?: string;
    variant?: string;
    label?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ data, fileName }) => {
    const handleDownload = () => {
        alert("PDF Generation coming soon!");
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-white/5 transition-colors"
        >
            <FileText size={14} />
            Export PDF
        </button>
    );
}
