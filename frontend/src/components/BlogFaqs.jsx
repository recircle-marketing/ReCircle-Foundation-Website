import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';

const FaqItem = ({ faq, isOpen, onToggle, index }) => {
  const contentRef = useRef(null);
  const [maxH, setMaxH] = useState(isOpen ? 'auto' : 0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      // Expand: measure scrollHeight, then set to that, then to 'auto' on transition end.
      const target = el.scrollHeight;
      setMaxH(target);
      const t = setTimeout(() => setMaxH('auto'), 320);
      return () => clearTimeout(t);
    }
    // Collapse: from 'auto' need to set explicit value first, then 0 next frame.
    if (maxH === 'auto') {
      setMaxH(el.scrollHeight);
      requestAnimationFrame(() => requestAnimationFrame(() => setMaxH(0)));
    } else {
      setMaxH(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div
      data-testid={`blog-faq-item-${index}`}
      className={`border-b border-gray-200 last:border-b-0 transition-colors ${
        isOpen ? 'bg-gray-50/60' : 'bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        data-testid={`blog-faq-toggle-${index}`}
        className="w-full flex items-start gap-4 text-left py-5 px-1 group focus:outline-none"
      >
        <span className="flex-1 text-base md:text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
          {faq.question}
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-600 transition-all duration-300 ${
            isOpen
              ? 'bg-brand-blue border-brand-blue text-white rotate-45'
              : 'group-hover:border-brand-blue group-hover:text-brand-blue'
          }`}
        >
          <Plus size={16} />
        </span>
      </button>

      <div
        id={`faq-panel-${index}`}
        ref={contentRef}
        role="region"
        aria-hidden={!isOpen}
        style={{
          maxHeight: maxH === 'auto' ? 'none' : `${maxH}px`,
          transition: 'max-height 300ms ease, opacity 250ms ease',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-5 px-1 text-gray-700 leading-relaxed whitespace-pre-line">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

const BlogFaqs = ({ faqs }) => {
  const safe = Array.isArray(faqs) ? faqs.filter((f) => f && f.question && f.answer) : [];
  const [openIndex, setOpenIndex] = useState(safe.length > 0 ? 0 : -1);

  if (safe.length === 0) return null;

  const toggle = (idx) => setOpenIndex((cur) => (cur === idx ? -1 : idx));

  // FAQPage JSON-LD for rich results.
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: safe.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="mt-12 pt-10 border-t border-gray-100" data-testid="blog-faqs">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-hidden">
        {safe.map((faq, i) => (
          <FaqItem
            key={i}
            faq={faq}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </section>
  );
};

export default BlogFaqs;
