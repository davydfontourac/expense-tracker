import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageTransition from '@/components/PageTransition';

// Import markdown content as raw string
import termsMarkdown from '../../terms_of_use.md?raw';

export default function Terms() {
  const navigate = useNavigate();
  const [lang] = useState(() => localStorage.getItem('language') || 'pt-BR');
  
  // Filter content by language if needed, or show both as in the file
  // The file has both, so we can just show it all or try to split it.
  // Given the file structure, showing both is fine as it has a language selector at the top.

  const downloadTerms = () => {
    const element = document.createElement("a");
    const file = new Blob([termsMarkdown], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "terms_of_use.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <PageTransition className="min-h-screen bg-white dark:bg-[#0c0c1d] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {lang === 'pt-BR' ? 'Termos de Uso' : 'Terms of Use'}
            </h1>
          </div>
          <button 
            onClick={downloadTerms}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-blue-500/10 hover:bg-gray-200 dark:hover:bg-blue-500/20 border border-transparent dark:border-blue-500/20 rounded-xl text-sm font-medium text-gray-900 dark:text-blue-400 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download MD</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 pt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/5 p-8 sm:p-12"
        >
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-blue-500/10 rounded-[28px] flex items-center justify-center">
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="prose prose-blue dark:prose-invert max-w-none 
            prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-600 dark:prose-p:text-gray-400
            prose-li:text-gray-600 dark:prose-li:text-gray-400
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {termsMarkdown}
            </ReactMarkdown>
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
