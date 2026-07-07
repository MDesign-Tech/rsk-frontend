"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does RSK Associates provide?",
    answer:
      "We provide auditing, tax advisory, financial consulting, business management consulting, compliance services, and financial product development tailored to businesses and individuals.",
  },
  {
    question: "Who can benefit from RSK Associates' services?",
    answer:
      "Our services are designed for startups, SMEs, large corporations, NGOs, government institutions, and individual clients seeking expert financial and business advisory services.",
  },
  {
    question: "How can RSK Associates help my business stay compliant?",
    answer:
      "We assess your business operations, review policies, identify compliance gaps, and help ensure you meet applicable regulatory and financial reporting requirements.",
  },
  {
    question: "Why should I hire an external auditor?",
    answer:
      "An independent audit improves the credibility of your financial statements, identifies operational risks, strengthens internal controls, and helps build trust with investors, lenders, and regulators.",
  },
  {
    question: "Do you provide tax planning and advisory services?",
    answer:
      "Yes. We assist businesses and individuals with tax planning, tax compliance, filing support, and strategies to optimize tax obligations while complying with Rwandan tax laws",
  },
];

export function FAQ() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-24 lg:py-32 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-display mb-4">
            Frequently asked{" "}
            <span className="text-gradient-lime">questions</span>
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Electric
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card/30"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
