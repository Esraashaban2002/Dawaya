// src/pages/Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://dawaya-back-end.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsSent(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSent(false), 3000);
      } else {
        setError(data.message || 'حدث خطأ، حاول مرة أخرى');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">تواصل معنا</h1>
          <p className="text-gray-500">نسعد بخدمتك على مدار الساعة</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">أرسل رسالتك</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="الاسم كاملاً" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" 
                required 
              />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" 
                required 
              />
              <textarea 
                rows="5" 
                placeholder="رسالتك" 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" 
                required 
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري الإرسال...' : isSent ? '✓ تم الإرسال' : 'إرسال الرسالة'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;