import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';

/**
 * Renders Arabic/English text that may contain LaTeX math.
 * - Inline math: $...$
 * - Block math:  $$...$$
 */
export default function MathText({ value, className = '', dir = 'rtl' }) {
  const source = useMemo(() => (value == null ? '' : String(value)), [value]);

  if (!source.trim()) return null;

  return (
    <div className={className} dir={dir}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex]}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

