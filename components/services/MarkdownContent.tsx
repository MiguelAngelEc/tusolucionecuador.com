"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  const components: Components = {
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold mb-4 text-gray-900" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-semibold mb-3 text-gray-800 mt-6" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-semibold mb-2 text-gray-800 mt-4" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="text-gray-700 mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="ml-4" {...props}>
        {children}
      </li>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-gray-900" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-gray-600" {...props}>
        {children}
      </em>
    ),
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-[#f28e03] hover:text-[#d97d02] underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    code: ({ children, className, ...props }) => {
      const isInline = !className?.includes('language-');
      return isInline ? (
        <code className="bg-gray-100 text-[#f28e03] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      ) : (
        <code className="bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4 block" {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-[#652382] pl-4 italic text-gray-600 my-4" {...props}>
        {children}
      </blockquote>
    ),
    hr: ({ ...props }) => (
      <hr className="border-gray-300 my-6" {...props} />
    ),
  };

  return (
    <div
      className={`
        overflow-y-auto
        max-h-[calc(95vh-280px)] md:max-h-[calc(95vh-250px)]
        px-6 py-4
        scroll-smooth
        ${className}
      `.trim()}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}