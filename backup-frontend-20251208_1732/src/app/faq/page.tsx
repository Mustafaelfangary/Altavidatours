"use client";
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '@/lib/i18n';
import { useContent } from '@/hooks/useContent';
import { useLanguage } from '@/contexts/LanguageContext';
import Script from 'next/script';
import UnifiedHero from '@/components/ui/UnifiedHero';


export default function FAQPage() {
  const { content, getContent, loading, error } = useContent({ page: 'faq' });
  const tOld = useTranslation();
  const { t } = useLanguage();

  const get = (key: string, fallback: string = '') => getContent(key, fallback);

  const faqs = (() => {
    try {
      // Build from CMS content blocks: keys like faq_1_question, faq_1_answer
      const itemsMap: Record<number, { id: number; order: number; question?: string; answer?: string }> = {};
      (Array.isArray(content) ? content : []).forEach((block: { key?: string; content?: string; order?: number }) => {
        const key = block?.key || '';
        const match = key.match(/^faq_(\d+)_(question|answer)$/i);
        if (match) {
          const id = parseInt(match[1], 10);
          const type = match[2].toLowerCase();
          if (!itemsMap[id]) {
            itemsMap[id] = { id, order: typeof block?.order === 'number' ? block.order : id };
          }
          if (type === 'question') itemsMap[id].question = block?.content || '';
          if (type === 'answer') itemsMap[id].answer = block?.content || '';
        }
      });
      const items = Object.values(itemsMap)
        .filter((it) => it.question && it.answer)
        .sort((a, b) => (a.order - b.order) || (a.id - b.id))
        .map(({ question, answer }) => ({ question, answer }));
      if (items.length > 0) return items;

      // Fallback to first 5 keys if no structured items present
      return [1, 2, 3, 4, 5].map((i) => ({
        question: get(`faq_${i}_question`),
        answer: get(`faq_${i}_answer`),
      })).filter((x) => x.question && x.answer);
    } catch {
      return [];
    }
  })();

  return (
    <main className="on-light">
      {/* Unified Hero Section */}
      <UnifiedHero
        imageSrc="/images/faq-hero-bg.jpg"
        title={get('faq_hero_title', 'Frequently Asked Questions')}
        subtitle={get('faq_hero_subtitle', 'Find answers to common questions about our cruises')}
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={true}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      />

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }} className="on-light">
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }} className="underline-accent">
          {t('faq')}
        </Typography>
        {faqs.map((faq, index) => faq.question && faq.answer && (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* FAQPage JSON-LD for AI search and rich results */}
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs
              .filter((f) => f.question && f.answer)
              .map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.answer,
                },
              })),
          }),
        }}
      />
    </main>
  );
} 