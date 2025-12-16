"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-semibold text-foreground mt-6 mb-3 flex items-center gap-2" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="text-foreground/80 leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-none space-y-2 mb-4 ml-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-foreground/70" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="flex items-start gap-2 text-foreground/70">
        <span className="text-primary mt-1.5">•</span>
        <span className="flex-1" {...props}>{children}</span>
      </li>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    hr: ({ ...props }) => (
      <hr className="my-8 border-t-2 border-muted" {...props} />
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/70 my-4 bg-primary/5 py-2 pr-4 rounded-r" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ children, className, ...props }) => {
      const isInline = !className?.includes('language-');
      return isInline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
          {children}
        </code>
      ) : (
        <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="markdown-content prose prose-slate dark:prose-invert max-w-none bg-white/50 backdrop-blur-sm rounded-lg p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
