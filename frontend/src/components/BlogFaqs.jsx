import React, { useEffect, useRef, useState } from 'react';
import { Plus, HelpCircle } from 'lucide-react';

const FaqItem = ({ faq, isOpen, onToggle, index, total }) => {
  const contentRef = useRef(null);
  const [maxH, setMaxH] = useState(isOpen ? 'auto' : 0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      const target = el.scrollHeight;
      setMaxH(target);
      const t = setTimeout(() => setMaxH('auto'), 320);
      return () => clearTimeout(t);
    }
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
      className={`relative rounded-xl border transition-all duration-300 ${
        isOpen
          ? 'border-brand-blue/30 bg-gradient-to-br from-brand-blue/[0.04] via-white to-white shadow-[0_4px_20px_-8px_rgba(1,41,138,0.18)]'
          : 'border-gray-200 bg-white hover:border-brand-blue/30 hover:shadow-sm'
      }`}
    >
      {/* Left accent bar when open */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300 ${
          isOpen ? 'bg-brand-blue opacity-100' : 'bg-brand-blue opacity-0'
        }`}
      />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        data-testid={`blog-faq-toggle-${index}`}
        className="w-full flex items-center gap-4 text-left px-5 sm:px-6 py-4 sm:py-5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 rounded-xl"
      >
        <span
          aria-hidden="true"
          className={`hidden sm:inline-flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
            isOpen
              ? 'bg-brand-blue text-white'
              : 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className={`flex-1 text-[15px] sm:text-base md:text-[17px] font-semibold leading-snug transition-colors ${
            isOpen ? 'text-brand-blue' : 'text-gray-900 group-hover:text-brand-blue'
          }`}
        >
          {faq.question}
        </span>

        <span
          aria-hidden="true"
          className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 ${
            isOpen
              ? 'bg-brand-blue text-white rotate-45 shadow-md'
              : 'bg-gray-50 border border-gray-200 text-gray-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue group-hover:border-brand-blue/30'
          }`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </span>
      </button>

      <div
        id={`faq-panel-${index}`}
        ref={contentRef}
        role="region"
        aria-hidden={!isOpen}
        style={{
          maxHeight: maxH === 'auto' ? 'none' : `${maxH}px`,
          transition: 'max-height 320ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 sm:pl-[72px]">
          <div className="border-t border-brand-blue/10 pt-4">
            <p className="text-[15px] leading-7 text-gray-700">{faq.answer}</p>
          </div>
        </div>
      </div>

      {/* show subtle bottom accent only when this is not the last item AND closed -- replaces the rule between cards */}
      {!isOpen && index < total - 1 && <span className="sr-only" />}
    </div>
  );
};

const BlogFaqs = ({ faqs }) => {
  const safe = Array.isArray(faqs) ? faqs.filter((f) => f && f.question && f.answer) : [];
  const [openIndex, setOpenIndex] = useState(safe.length > 0 ? 0 : -1);

  if (safe.length === 0) return null;

  const toggle = (idx) => setOpenIndex((cur) => (cur === idx ? -1 : idx));

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
    <section className="mt-14 pt-10 border-t border-gray-100" data-testid="blog-faqs">
      {/* Section header */}
      <div className="mb-7 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold uppercase tracking-wider">
          <HelpCircle size={13} />
          FAQ
        </span>
        <span className="text-xs text-gray-400">
          {safe.length} {safe.length === 1 ? 'question' : 'questions'}
        </span>
      </div>
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
        Frequently Asked Questions
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Quick answers to the things readers ask us most.
      </p>

      <div className="space-y-3">
        {safe.map((faq, i) => (
          <FaqItem
            key={i}
            faq={faq}
            index={i}
            total={safe.length}
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
