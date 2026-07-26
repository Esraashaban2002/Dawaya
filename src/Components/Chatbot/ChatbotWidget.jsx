import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, PhoneCall } from 'lucide-react';
import './ChatbotWidget.css';

const QUICK_PILLS = [
  "كيف أستخدم بندول؟",
  "هل يوجد بديل لأوجمنتين؟",
  "تواصل مع صيدلي مباشر"
];

const generateBotReply = (userQuery) => {
  const query = userQuery.toLowerCase().trim();

  if (query.includes('صيدلي') || query.includes('pharmacist') || query.includes('تواصل') || query.includes('contact')) {
    return {
      text: 'يمكنك التواصل الفوري مع الصيدلي المباشر للاستشارات الطبية المخصصة عبر الواتساب أو الاتصال.',
      showCallBtn: true
    };
  }

  if (query.includes('بندول') || query.includes('panadol')) {
    return {
      text: '💊 بنادول (Panadol Extra / Advance):\n• الاستخدام: مسكن آمن للألم وخافض للحرارة (الصداع، ألم الأسنان، أعراض البرد).\n• الجرعة المعتادة: قرص إلى قرصين كل 6-8 ساعات عند الحاجة.\n• السعر التقريبي: 58-65 ج.م\n⚠️ تحذير: لا تتجاوز 8 أقراص خلال 24 ساعة.'
    };
  }

  if (query.includes('أوجمنتين') || query.includes('augmentin') || query.includes('اوجمنتين')) {
    return {
      text: '🩺 أوجمنتين (Augmentin 1g / 625mg):\n• الاستخدام: مضاد حيوي واسع المجال لالتهابات الحلق، الأذن، الجهاز التنفسي والمسالك.\n• الجرعة المعتادة: قرص كل 12 ساعة بعد الأكل تحت إشراف طبي.\n• البدائل المتوفرة: إيموكسكلاف (Amoxclav)، هيبيوتك (Hibiotic).\n⚠️ يجب إكمال الكورس العلاجي بالكامل.'
    };
  }

  if (query.includes('برد') || query.includes('زكام') || query.includes('cold') || query.includes('flu')) {
    return {
      text: '🤧 أعراض البرد والإنفلونزا:\n• بانادول اكسترا لتخفيف الألم والحمى\n• كونتاك أو كولدكس للاحتقان\n• استرح وشرب السوائل بكثرة\n• فيتامين C لدعم المناعة\n⚠️ استشر طبيبك إذا استمرت الأعراض أكثر من 5 أيام.'
    };
  }

  if (query.includes('ضغط') || query.includes('blood pressure') || query.includes('hypertension')) {
    return {
      text: '❤️ ضغط الدم:\n• أدوية ضغط الدم تحتاج وصفة طبية.\n• الأدوية الشائعة: أملوديبين، فاليسارتان، ليزينوبريل.\n• مهم: لا تتوقف عن الدواء بدون استشارة طبيبك.\n• يجب متابعة قياس الضغط بانتظام.\n📞 للاستشارة، تحدث مع صيدلانينا مباشرة.',
      showCallBtn: true
    };
  }

  if (query.includes('سكري') || query.includes('diabetes') || query.includes('سكر')) {
    return {
      text: '🩸 السكري:\n• الأدوية الشائعة: ميتفورمين، جلوكوفاج، أنسولين.\n• مهم: اتبع نظامك الغذائي وقِس السكر بانتظام.\n• لا تغير جرعتك بدون إشراف طبي.\n📞 للاستشارة، تحدث مع صيدلانينا.',
      showCallBtn: true
    };
  }

  if (query.includes('مضاد حيوي') || query.includes('antibiotic')) {
    return {
      text: '⚕️ المضادات الحيوية:\n• تحتاج وصفة طبية دائماً.\n• أكمل الكورس كاملاً حتى لو تحسنت.\n• لا تشارك مضادك الحيوي مع أحد.\n• الأنواع الشائعة: أموكسيسيلين، أزيثرومايسين، سيفالكسين.'
    };
  }

  if (query.includes('فيتامين') || query.includes('vitamin')) {
    return {
      text: '💊 الفيتامينات:\n• فيتامين C: لتقوية المناعة (500-1000 مجم يومياً)\n• فيتامين D: للعظام والمناعة (1000-2000 وحدة)\n• فيتامين B12: للأعصاب والطاقة\n• الزنك: لدعم المناعة والتئام الجروح\n✅ متوفرة في دوايا بأفضل الأسعار!'
    };
  }

  return {
    text: `شكراً لسؤالك عن "${userQuery}".\n\nيمكنني مساعدتك في:\n• 💊 معلومات الأدوية والجرعات\n• 🔄 البدائل الدوائية المتاحة\n• ⚠️ التحذيرات والتفاعلات الدوائية\n• 📞 التواصل مع صيدلي متخصص\n\nاكتب اسم الدواء أو الحالة الصحية وسأساعدك فوراً!`
  };
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'أهلاً بك في دوايا! كيف يمكنني مساعدتك اليوم بخصوص الأدوية والروشتات؟',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showPills: true
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const msgCounterRef = useRef(100);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (overrideText) => {
    const query = overrideText || inputMsg.trim();
    if (!query) return;

    msgCounterRef.current += 1;
    const userMsgObj = {
      id: `usr_${msgCounterRef.current}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsgObj]);
    setInputMsg('');

    setTimeout(() => {
      const replyData = generateBotReply(query);
      msgCounterRef.current += 1;
      const botMsgObj = {
        id: `bot_${msgCounterRef.current}`,
        sender: 'bot',
        text: replyData.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showCallBtn: replyData.showCallBtn
      };
      setMessages(prev => [...prev, botMsgObj]);
    }, 600);
  };

  const handlePharmacistClick = () => {
    alert('جاري تحويلك لصيدلي متخصص عبر واتساب...');
    window.open('https://wa.me/201023456789?text=السلام%20عليكم،%20أحتاج%20استشارة%20صيدلية%20عاجلة%20من%20موقع%20دوايا', '_blank');
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-toggle-btn animate-fade-in"
          title="المساعد الطبي لـ دوايا"
        >
          <MessageSquare size={26} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">👨‍⚕️</div>
              <div>
                <h3 className="chatbot-title">المساعد الطبي لـ دوايا</h3>
                <span className="chatbot-status">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  استشر الذكاء الاصطناعي أو تواصل مع صيدلي
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close-btn">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                <div className="chat-msg-bubble">
                  {msg.text}

                  {msg.showPills && (
                    <div className="chatbot-pills">
                      {QUICK_PILLS.map((pill, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(pill)}
                          className="chatbot-pill-btn"
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.showCallBtn && (
                    <button onClick={handlePharmacistClick} className="pharmacist-call-btn">
                      <PhoneCall size={16} />
                      <span>تحدث مع صيدلي مباشر 👨‍⚕️</span>
                    </button>
                  )}
                </div>
                <span className="chat-msg-time">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chatbot-input-container"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="اكتب استفسارك عن أي دواء هنا..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
