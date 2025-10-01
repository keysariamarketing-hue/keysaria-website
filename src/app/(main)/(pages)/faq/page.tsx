"use client";
import React, { useState } from "react";

const Faq = () => {
  const faqs = [
    {
      question: "What if I have received the product in damaged condition?",
      answer: `If you have received the Product in a bad condition or if the packaging is tampered with or damaged before delivery, please refuse to accept the package and return the package to the delivery person. Please notify us immediately on consumer experience helpline on +91-9871870405 or email on keysarialabels@gmail.com mentioning the Order ID.`,
    },
    {
      question: "Wholesale Enquiry",
      answer: `We are available on +91 9220478135 , Monday - Saturday from 9:30am - 6:30pm. Our email for Customer Support is keysarialabels@gmail.com Drop us a message or give us a ring and we'll get back to you at the earliest. For partner/business inquiries submit your enquiry here or mail us on keysarialabels@gmail.com `,
    },
    {
      question: "Payments",
      answer: `WE OFFER ALL PAYMENT OPTIONS , Free Cash On Delivery for Domestic Orders upto Rs.5000/- Paypal and International Debit & Credit cards for International Orders (Outside India Orders) Debit/Credit Cards, Net Banking Bank Transfer`,
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 my-20">
      <h1 className="lg:text-3xl text-xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h1>
      {faqs.map((faq, index) => (
        <div key={index} className="border-b-2 border-gray-200 mb-4">
          <button
            className="w-full text-left md:text-xl text-base font-medium py-4 focus:outline-none"
            onClick={() => toggleFaq(index)}
          >
            <span className="flex justify-between">
              {faq.question}
              <span>{activeIndex === index ? "-" : "+"}</span>
            </span>
          </button>
          {activeIndex === index && (
            <div className="text-gray-600 text-sm md:text-base py-2">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Faq;
