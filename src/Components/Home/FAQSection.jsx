// src/components/FAQSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: 'كيف يمكنني طلب الدواء؟', answer: 'يمكنك طلب الدواء بسهولة من خلال تطبيقنا أو موقعنا الإلكتروني. فقط ابحث عن المنتج وأضفه إلى سلة التسوق وأكمل عملية الدفع.' },
    { question: 'ما هي مدة التوصيل؟', answer: 'نقدم خدمة توصيل سريعة خلال 30 دقيقة في المناطق الرئيسية، وقد تصل إلى ساعتين في المناطق البعيدة.' },
    { question: 'هل الأدوية أصلية؟', answer: 'نعم، جميع الأدوية التي نقدمها أصلية 100% ومصرح بها من وزارة الصحة.' },
    { question: 'هل يمكنني الاستشارة مع صيدلي؟', answer: 'نعم، يمكنك الاستشارة مع صيادلة مؤهلين مجاناً عبر الدردشة المباشرة.' },
    { question: 'ما هي طرق الدفع المتاحة؟', answer: 'نقبل الدفع عبر البطاقات الائتمانية، والدفع عند الاستلام، والمحافظ الإلكترونية.' },
    { question: 'كيف يمكنني تتبع طلبي؟', answer: 'يمكنك تتبع طلبك من خلال حسابك في التطبيق أو عن طريق رابط التتبع المرسل عبر رسالة نصية.' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">الأسئلة الشائعة</h2>
          <p className="mt-4 text-lg text-gray-600">إجابات على الاسئله </p>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  {openIndex === index ? (
                    <FaMinus className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FaPlus className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <span className="text-lg">{faq.question}</span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;