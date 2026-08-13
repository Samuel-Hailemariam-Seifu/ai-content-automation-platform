"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

/**
 * Renders campaign blog Markdown as HTML with styles that match the dark UI.
 */
export function MarkdownBody({ content, className = "" }: Props) {
  return (
    <div
      className={`markdown-body break-words text-[15px] leading-[1.7] text-zinc-300 ${className}`}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-0 text-2xl font-semibold tracking-tight text-zinc-50 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-8 text-xl font-semibold tracking-tight text-zinc-100 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 text-lg font-medium text-zinc-100 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-5 text-base font-medium text-zinc-200 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 last:mb-0 text-zinc-300">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-zinc-300 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-zinc-300 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-100">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline decoration-indigo-500/40 underline-offset-2 transition-colors hover:text-indigo-200"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-2 border-white/15 pl-4 text-zinc-400 italic last:mb-0">
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children }) => {
            const isBlock = Boolean(codeClassName);
            if (isBlock) {
              return (
                <code className="font-mono text-[13px] text-zinc-200">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-zinc-200">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg border border-white/[0.06] bg-zinc-950/60 px-3 py-3 last:mb-0">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-8 border-white/[0.08]" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
