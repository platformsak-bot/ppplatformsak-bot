const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

// إعدادات البولينج المحسنة
const bot = new TelegramBot(token, { 
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// تأكيد استخدام البولينج
bot.setWebHook('');

// بيانات التخزين
let userSessions = {};
let waitingForAssignment = {};
let cvData = {};
let cvStep = {};
let reminders = {};
let flashcards = {};

// معالجة الأخطاء المحسنة
bot.on('polling_error', (error) => {
  console.error('❌ خطأ في البولينج:', error.code);
  console.log('🔄 البوت يحاول إعادة الاتصال تلقائياً...');
});

bot.on('error', (error) => {
  console.error('❌ خطأ عام:', error.message);
});

// ↪️ زر العودة للقائمة الرئيسية
bot.onText(/↩️ العودة للقائمة الرئيسية/, (msg) => {
  showMainMenu(msg.chat.id);
});

// 🏁 بدء البوت
bot.onText(/\/start/, (msg) => {
  showMainMenu(msg.chat.id);
});

// 📋 القائمة الرئيسية
function showMainMenu(chatId) {
  const keyboard = {
    reply_markup: {
      keyboard: [
        ['🔍 خدمات الأبحاث', '📝 حل الواجبات'],
        ['💼 السيرة الذاتية', '🎯 المشاريع الدراسية'],
        ['🎴 البطاقات التعليمية', '🧮 آلة حاسبة'],
        ['🍅 مؤقت الدراسة', '📖 قاموس سريع'],
        ['⏰ التذكيرات', 'ℹ️ المساعدة']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `مرحباً بك في PlatformSAK! 🎓

خدمات شاملة للطلاب في جميع المجالات التعليمية

اختر الخدمة التي تحتاجها:`, keyboard);
}

// 🔍 خدمات الأبحاث
bot.onText(/🔍 خدمات الأبحاث/, (msg) => {
  const chatId = msg.chat.id;
  
  const researchKeyboard = {
    reply_markup: {
      keyboard: [
        ['📄 رؤية أمثلة الأبحاث'],
        ['🆕 طلب بحث جديد'],
        ['↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `🔍 **خدمات الأبحاث والتقارير**

اختر ما تريد:
- 📄 رؤية أمثلة لأبحاثنا السابقة
- 🆕 طلب بحث جديد

📧 للتواصل: alslahyamr1@gmail.com
📞 الواتساب: @Almariffah`, researchKeyboard);
});

// 📄 أمثلة الأبحاث
bot.onText(/📄 رؤية أمثلة الأبحاث/, (msg) => {
  bot.sendMessage(msg.chat.id, `📚 **أمثلة لأبحاثنا:**

يمكنك طلب أمثلة PDF عبر:
📧 alslahyamr1@gmail.com 
📞 @Almariffah

وسنرسل لك نماذج مجانية لأبحاثنا السابقة`);
});

// 🆕 طلب بحث جديد
bot.onText(/🆕 طلب بحث جديد/, (msg) => {
  const chatId = msg.chat.id;
  userSessions[chatId] = 'research_request';
  
  bot.sendMessage(chatId, `🆕 **طلب بحث جديد**

الآن يمكنك إرسال تفاصيل البحث المطلوب:
- عنوان البحث
- عدد الصفحات
- التخصص
- الموعد النهائي
- أي متطلبات خاصة

سيتم إرسال طلبك للمسؤول وسنتواصل معك خلال ساعات`);
});

// 📝 حل الواجبات
bot.onText(/📝 حل الواجبات/, (msg) => {
  const chatId = msg.chat.id;
  
  const assignmentKeyboard = {
    reply_markup: {
      keyboard: [
        ['📤 إرسال واجب للحل'],
        ['ℹ️ تعليمات الإرسال'],
        ['↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `📝 **خدمة حل الواجبات**

لإرسال واجب للحل:
1. اضغط "📤 إرسال واجب للحل"
2. اكتب تفاصيل الواجب
3. أرفق الصور إذا needed
4. اذكر رقم تواصلك

سنقوم بالحل وإرساله لك خلال 24 ساعة`, assignmentKeyboard);
});

// 📤 إرسال واجب للحل
bot.onText(/📤 إرسال واجب للحل/, (msg) => {
  const chatId = msg.chat.id;
  waitingForAssignment[chatId] = true;
  
  bot.sendMessage(chatId, `📤 **إرسال الواجب:**

الآن يمكنك:
- كتابة تفاصيل الواجب
- إرسال صور الأسئلة
- ذكر المادة والموعد النهائي
- كتابة رقم تواصلك

*سيتم إرسال كل ما تكتبه الآن إلى المسؤول*`);
});

// 💼 السيرة الذاتية
bot.onText(/💼 السيرة الذاتية/, (msg) => {
  const chatId = msg.chat.id;
  
  const cvKeyboard = {
    reply_markup: {
      keyboard: [
        ['📝 تعبئة بيانات السيرة الذاتية'],
        ['↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `💼 **خدمات السيرة الذاتية**

لإنشاء سيرة ذاتية احترافية:
1. اضغط "📝 تعبئة بيانات السيرة الذاتية"  
2. اتبع الخطوات وأدخل معلوماتك
3. سنقوم بإنشاء CV احترافي لك

📞 للاستفسار: @Almariffah`, cvKeyboard);
});

// 📝 بدء تعبئة السيرة الذاتية
bot.onText(/📝 تعبئة بيانات السيرة الذاتية/, (msg) => {
  const chatId = msg.chat.id;
  cvStep[chatId] = 'name';
  cvData[chatId] = {};
  
  bot.sendMessage(chatId, `📝 **بيانات السيرة الذاتية**

لنبدأ في تعبئة بياناتك:

الخطوة 1/6: ما هو اسمك الكامل؟`);
});

// 🎯 المشاريع الدراسية
bot.onText(/🎯 المشاريع الدراسية/, (msg) => {
  const chatId = msg.chat.id;
  
  const projectKeyboard = {
    reply_markup: {
      keyboard: [
        ['🚀 طلب مشروع جديد'],
        ['↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `🎯 **المشاريع الدراسية**

خدمات إعداد المشاريع:
- مشاريع التخرج
- المشاريع العملية
- العروض التقديمية
- التوثيق الكامل

📧 alslahyamr1@gmail.com
📞 @Almariffah`, projectKeyboard);
});

// 🚀 طلب مشروع جديد
bot.onText(/🚀 طلب مشروع جديد/, (msg) => {
  const chatId = msg.chat.id;
  userSessions[chatId] = 'project_request';
  
  bot.sendMessage(chatId, `🚀 **طلب مشروع جديد**

أرسل لنا تفاصيل المشروع:
- نوع المشروع
- المتطلبات
- الموعد النهائي
- أي تفاصيل أخرى

وسنتواصل معك خلال ساعات`);
});

// 🎴 البطاقات التعليمية
bot.onText(/🎴 البطاقات التعليمية/, (msg) => {
  const chatId = msg.chat.id;
  
  const flashcardKeyboard = {
    reply_markup: {
      keyboard: [
        ['➕ إضافة بطاقة', '📚 عرض البطاقات'],
        ['🧠 مراجعة البطاقات', '🗑️ حذف البطاقات'],
        ['↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `🎴 **البطاقات التعليمية**

أداة فعالة للحفظ والمراجعة:
- ➕ إضافة بطاقات جديدة
- 📚 عرض جميع البطاقات
- 🧠 مراجعة عشوائية
- 🗑️ حذف البطاقات`, flashcardKeyboard);
});

// ➕ إضافة بطاقة
bot.onText(/➕ إضافة بطاقة/, (msg) => {
  const chatId = msg.chat.id;
  userSessions[chatId] = 'adding_flashcard_front';
  
  if (!flashcards[chatId]) {
    flashcards[chatId] = [];
  }
  
  bot.sendMessage(chatId, `➕ **إضافة بطاقة جديدة**

الخطوة 1/2: اكتب السؤال أو الوجه الأمامي للبطاقة:`);
});

// 📚 عرض البطاقات
bot.onText(/📚 عرض البطاقات/, (msg) => {
  const chatId = msg.chat.id;
  const userCards = flashcards[chatId];
  
  if (!userCards || userCards.length === 0) {
    return bot.sendMessage(chatId, '❌ لا توجد بطاقات حالياً. اضف بطاقات أولاً.');
  }
  
  let cardsText = `📚 **بطاقاتك التعليمية (${userCards.length})**\n\n`;
  
  userCards.forEach((card, index) => {
    cardsText += `**${index + 1}. ${card.front}**\n→ ${card.back}\n\n`;
  });
  
  bot.sendMessage(chatId, cardsText);
});

// 🧠 مراجعة البطاقات
bot.onText(/🧠 مراجعة البطاقات/, (msg) => {
  const chatId = msg.chat.id;
  const userCards = flashcards[chatId];
  
  if (!userCards || userCards.length === 0) {
    return bot.sendMessage(chatId, '❌ لا توجد بطاقات للمراجعة. اضف بطاقات أولاً.');
  }
  
  const randomIndex = Math.floor(Math.random() * userCards.length);
  const randomCard = userCards[randomIndex];
  
  userSessions[chatId] = 'reviewing_flashcard';
  userSessions[`${chatId}_review_card`] = randomIndex;
  
  const reviewKeyboard = {
    reply_markup: {
      keyboard: [
        ['👀 عرض الإجابة'],
        ['🔄 بطاقة أخرى'],
        ['↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `🧠 **مراجعة البطاقات**

السؤال: **${randomCard.front}**

اضغط "👀 عرض الإجابة" لرؤية الجواب`, reviewKeyboard);
});

// 👀 عرض الإجابة
bot.onText(/👀 عرض الإجابة/, (msg) => {
  const chatId = msg.chat.id;
  const cardIndex = userSessions[`${chatId}_review_card`];
  const userCards = flashcards[chatId];
  
  if (userCards && userCards[cardIndex]) {
    bot.sendMessage(chatId, `✅ **الإجابة:**\n\n${userCards[cardIndex].back}`);
  }
});

// 🗑️ حذف البطاقات
bot.onText(/🗑️ حذف البطاقات/, (msg) => {
  const chatId = msg.chat.id;
  
  if (flashcards[chatId] && flashcards[chatId].length > 0) {
    flashcards[chatId] = [];
    bot.sendMessage(chatId, '✅ تم حذف جميع البطاقات بنجاح!');
  } else {
    bot.sendMessage(chatId, '❌ لا توجد بطاقات لحذفها.');
  }
});

// 🧮 آلة حاسبة
bot.onText(/🧮 آلة حاسبة/, (msg) => {
  const chatId = msg.chat.id;
  
  const calcKeyboard = {
    reply_markup: {
      keyboard: [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['0', '.', '=', '+'],
        ['C مسح', '↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `🧮 **آلة حاسبة**

استخدم الأزرار لإجراء العمليات الحسابية`, calcKeyboard);
});

// معالجة العمليات الحسابية
bot.onText(/^[0-9+\-*/.=C]$/, (msg) => {
  const chatId = msg.chat.id;
  const input = msg.text;
  
  if (input === 'C') {
    bot.sendMessage(chatId, 'تم مسح الشاشة\nابدأ عملية جديدة:');
    return;
  }
  
  if (input === '=') {
    bot.sendMessage(chatId, 'أرسل العملية الحسابية كاملة\nمثال: 5+3*2');
  }
});

bot.onText(/^[0-9+\-*/.() ]+$/, (msg) => {
  const chatId = msg.chat.id;
  const expression = msg.text;
  
  if (expression.includes('=')) return;
  
  try {
    let mathExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    
    if (/^[0-9+\-*/.() ]+$/.test(mathExpression)) {
      const result = eval(mathExpression);
      bot.sendMessage(chatId, `🧮 **النتيجة:**\n${expression} = ${result}`);
    }
  } catch (error) {
    bot.sendMessage(chatId, '❌ تعبير رياضي غير صحيح');
  }
});

// 🍅 مؤقت الدراسة
bot.onText(/🍅 مؤقت الدراسة/, (msg) => {
  const chatId = msg.chat.id;
  
  const pomodoroKeyboard = {
    reply_markup: {
      keyboard: [
        ['⏱️ 25 دقيقة دراسة', '☕ 5 دقائق راحة'],
        ['⏱️ 50 دقيقة دراسة', '🛑 إيقاف المؤقت'],
        ['↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `🍅 **تقنية البومودورو للدراسة**

اختر المدة:
• ⏱️ 25 دقيقة دراسة + 5 دقائق راحة
• ⏱️ 50 دقيقة دراسة + 10 دقائق راحة`, pomodoroKeyboard);
});

// ⏱️ بدء المؤقت
bot.onText(/⏱️ 25 دقيقة دراسة/, (msg) => {
  startStudyTimer(msg.chat.id, 25, 'دراسة');
});

bot.onText(/⏱️ 50 دقيقة دراسة/, (msg) => {
  startStudyTimer(msg.chat.id, 50, 'دراسة');
});

bot.onText(/☕ 5 دقائق راحة/, (msg) => {
  startStudyTimer(msg.chat.id, 5, 'راحة');
});

function startStudyTimer(chatId, minutes, type) {
  bot.sendMessage(chatId, `⏰ بدأ مؤقت ${type} لمدة ${minutes} دقيقة\n\nسيتم إعلامك عند الانتهاء`);
  
  setTimeout(() => {
    bot.sendMessage(chatId, `🔔 انتهى وقت ${type}!`);
  }, minutes * 1000);
}

// 🛑 إيقاف المؤقت
bot.onText(/🛑 إيقاف المؤقت/, (msg) => {
  bot.sendMessage(msg.chat.id, '✅ تم إيقاف المؤقت');
});

// 📖 قاموس سريع
bot.onText(/📖 قاموس سريع/, (msg) => {
  const chatId = msg.chat.id;
  userSessions[chatId] = 'waiting_word_definition';
  
  bot.sendMessage(chatId, `📖 **قاموس سريع**

أرسل الكلمة التي تريد معرفة معناها:
(يدعم العربية والإنجليزية)`);
});

// ⏰ التذكيرات
bot.onText(/⏰ التذكيرات/, (msg) => {
  const chatId = msg.chat.id;
  
  const reminderKeyboard = {
    reply_markup: {
      keyboard: [
        ['➕ إضافة تذكير', '📋 قائمة التذكيرات'],
        ['🗑️ حذف التذكيرات', '↩️ العودة للقائمة الرئيسية']
      ],
      resize_keyboard: true
    }
  };
  
  bot.sendMessage(chatId, `⏰ **نظام التذكيرات**

• ➕ إضافة تذكير جديد
• 📋 عرض التذكيرات
• 🗑️ حذف التذكيرات`, reminderKeyboard);
});

// ➕ إضافة تذكير
bot.onText(/➕ إضافة تذكير/, (msg) => {
  const chatId = msg.chat.id;
  userSessions[chatId] = 'waiting_reminder';
  
  bot.sendMessage(chatId, `➕ **إضافة تذكير جديد**

أرسل التذكير بالصيغة:
الموضوع - التاريخ - الوقت

مثال:
امتحان الرياضيات - 2024-12-25 - 10:00`);
});

// 📋 قائمة التذكيرات
bot.onText(/📋 قائمة التذكيرات/, (msg) => {
  const chatId = msg.chat.id;
  const userReminders = reminders[chatId] || [];
  
  if (userReminders.length === 0) {
    return bot.sendMessage(chatId, '❌ لا توجد تذكيرات حالياً');
  }
  
  let reminderList = '📋 **تذكيراتك:**\n\n';
  userReminders.forEach((reminder, index) => {
    reminderList += `${index + 1}. ${reminder.text}\n📅 ${reminder.date} ⏰ ${reminder.time}\n\n`;
  });
  
  bot.sendMessage(chatId, reminderList);
});

// 🗑️ حذف التذكيرات
bot.onText(/🗑️ حذف التذكيرات/, (msg) => {
  const chatId = msg.chat.id;
  
  if (reminders[chatId] && reminders[chatId].length > 0) {
    reminders[chatId] = [];
    bot.sendMessage(chatId, '✅ تم حذف جميع التذكيرات بنجاح!');
  } else {
    bot.sendMessage(chatId, '❌ لا توجد تذكيرات لحذفها.');
  }
});

// ℹ️ المساعدة
bot.onText(/ℹ️ المساعدة/, (msg) => {
  const helpText = `🆘 **مساعدة PlatformSAK**

📞 **للتواصل المباشر:**
@Almariffah

📧 **البريد الإلكتروني:**
alslahyamr1@gmail.com

🔧 **خدماتنا:**
• 🔍 خدمات الأبحاث والتقارير
• 📝 حل الواجبات والإمتحانات
• 💼 كتابة السيرة الذاتية
• 🎯 المشاريع الدراسية

🎯 **أدوات مجانية:**
• 🎴 البطاقات التعليمية
• 🧮 آلة حاسبة
• 🍅 مؤقت الدراسة
• 📖 قاموس سريع
• ⏰ نظام التذكيرات

🚀 **الأوامر:**
/start - بدء البوت
/menu - القائمة الرئيسية`;

  bot.sendMessage(msg.chat.id, helpText);
});

// 📨 معالجة جميع الرسائل
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text || '';
  const photo = msg.photo;
  
  if (messageText.startsWith('/')) return;
  if (/^[0-9+\-*/.=C]$/.test(messageText)) return;
  
  if (userSessions[chatId] === 'research_request') {
    sendToAdmin(chatId, `🔍 طلب بحث جديد\n\n${messageText}`);
    bot.sendMessage(chatId, `✅ تم استلام طلب البحث!\n\nسنقوم بالتواصل معك خلال ساعات\n📞 للاستفسار: @Almariffah`);
    delete userSessions[chatId];
    return;
  }
  
  if (userSessions[chatId] === 'project_request') {
    sendToAdmin(chatId, `🎯 طلب مشروع جديد\n\n${messageText}`);
    bot.sendMessage(chatId, `✅ تم استلام طلب المشروع!\n\nسنقوم بالتواصل معك خلال ساعات\n📞 للاستفسار: @Almariffah`);
    delete userSessions[chatId];
    return;
  }
  
  if (waitingForAssignment[chatId]) {
    if (photo) {
      bot.sendPhoto('@Almariffah', photo[photo.length - 1].file_id, {
        caption: `📝 واجب جديد\nرقم التواصل: ${chatId}\n\n${messageText}`
      });
    } else {
      sendToAdmin(chatId, `📝 واجب جديد\n\n${messageText}`);
    }
    
    bot.sendMessage(chatId, `✅ تم استلام واجبك!\n\nسنقوم بالحل خلال 24 ساعة\n📞 للاستفسار: @Almariffah`);
    waitingForAssignment[chatId] = false;
    return;
  }
  
  if (cvStep[chatId]) {
    handleCVData(chatId, messageText);
    return;
  }
  
  if (userSessions[chatId] === 'adding_flashcard_front') {
    if (!flashcards[chatId]) flashcards[chatId] = [];
    
    flashcards[chatId].push({
      front: messageText,
      back: ''
    });
    
    userSessions[chatId] = 'adding_flashcard_back';
    bot.sendMessage(chatId, `✅ تم حفظ السؤال\n\nالخطوة 2/2: اكتب الإجابة:`);
    return;
  }
  
  if (userSessions[chatId] === 'adding_flashcard_back') {
    const userCards = flashcards[chatId];
    if (userCards && userCards.length > 0) {
      userCards[userCards.length - 1].back = messageText;
      bot.sendMessage(chatId, `🎉 تم إضافة البطاقة!\n\nإجمالي البطاقات: ${userCards.length}`);
    }
    delete userSessions[chatId];
    return;
  }
  
  if (userSessions[chatId] === 'waiting_word_definition') {
    const word = messageText.toLowerCase();
    const definitions = {
      'study': 'الدراسة: عملية اكتساب المعرفة والمهارات',
      'research': 'البحث: التحقيق المنظم لاكتشاف المعرفة الجديدة',
      'exam': 'الامتحان: تقييم للمعرفة أو المهارات',
      'education': 'التعليم: عملية تسهيل التعلم',
      'درس': 'درس: مادة تعليمية أو جلسة تعلم',
      'امتحان': 'امتحان: اختبار للمعرفة أو الكفاءة',
      'بحث': 'بحث: دراسة متعمقة لموضوع معين',
      'تعلم': 'تعلم: عملية اكتساب المعرفة أو المهارات'
    };
    
    const definition = definitions[word] || `لم أجد تعريفاً للكلمة "${messageText}". جرب كلمات أخرى مثل: study, research, exam`;
    
    bot.sendMessage(chatId, `📖 **تعريف "${messageText}":**\n\n${definition}`);
    delete userSessions[chatId];
    return;
  }
  
  if (userSessions[chatId] === 'waiting_reminder') {
    if (!reminders[chatId]) reminders[chatId] = [];
    
    const parts = messageText.split('-').map(part => part.trim());
    
    if (parts.length >= 3) {
      reminders[chatId].push({
        text: parts[0],
        date: parts[1],
        time: parts[2]
      });
      
      bot.sendMessage(chatId, `✅ تم إضافة التذكير!\n\n${parts[0]}\n📅 ${parts[1]} ⏰ ${parts[2]}`);
    } else {
      bot.sendMessage(chatId, `✅ تم إضافة التذكير!\n\n${messageText}`);
      
      reminders[chatId].push({
        text: messageText,
        date: 'غير محدد',
        time: 'غير محدد'
      });
    }
    
    delete userSessions[chatId];
    return;
  }
});

// 💼 معالجة بيانات السيرة الذاتية
function handleCVData(chatId, messageText) {
  switch(cvStep[chatId]) {
    case 'name':
      cvData[chatId].name = messageText;
      cvStep[chatId] = 'job';
      bot.sendMessage(chatId, `✅ تم حفظ الاسم\n\nالخطوة 2/6: ما هو تخصصك/المجال المهني؟`);
      break;
      
    case 'job':
      cvData[chatId].job = messageText;
      cvStep[chatId] = 'phone';
      bot.sendMessage(chatId, `✅ تم حفظ التخصص\n\nالخطوة 3/6: ما هو رقم هاتفك؟`);
      break;
      
    case 'phone':
      cvData[chatId].phone = messageText;
      cvStep[chatId] = 'email';
      bot.sendMessage(chatId, `✅ تم حفظ الرقم\n\nالخطوة 4/6: ما هو بريدك الإلكتروني؟`);
      break;
      
    case 'email':
      cvData[chatId].email = messageText;
      cvStep[chatId] = 'education';
      bot.sendMessage(chatId, `✅ تم حفظ البريد\n\nالخطوة 5/6: ما هي مؤهلاتك التعليمية؟`);
      break;
      
    case 'education':
      cvData[chatId].education = messageText;
      cvStep[chatId] = 'experience';
      bot.sendMessage(chatId, `✅ تم حفظ المؤهلات\n\nالخطوة 6/6: ما هي خبراتك العملية (إن وجدت)؟`);
      break;
      
    case 'experience':
      cvData[chatId].experience = messageText || 'لا توجد خبرات';
      
      const userData = cvData[chatId];
      sendToAdmin(chatId, `💼 **طلب سيرة ذاتية جديد**

👤 الاسم: ${userData.name}
🎯 التخصص: ${userData.job}
📞 الهاتف: ${userData.phone}
📧 البريد: ${userData.email}
🎓 المؤهلات: ${userData.education}
💼 الخبرات: ${userData.experience}

رقم التواصل: ${chatId}`);

      bot.sendMessage(chatId, `🎉 **تم استلام بياناتك بنجاح!**

سنقوم بإعداد سيرتك الذاتية خلال 24 ساعة وسنرسلها لك على:
📞 ${userData.phone}
📧 ${userData.email}

شكراً لثقتك بنا! 🌟`);

      delete cvStep[chatId];
      delete cvData[chatId];
      break;
  }
}

// 📤 إرسال الرسائل للمسؤول
function sendToAdmin(chatId, message) {
  try {
    bot.sendMessage('@Almariffah', message);
    console.log(`📨 رسالة جديدة من ${chatId}`);
  } catch (error) {
    console.log('❌ خطأ في إرسال الرسالة للمسؤول');
  }
}

// تشغيل البوت
console.log('🚀 بوت PlatformSAK يعمل بنجاح!');
console.log('📞 للتواصل: @Almariffah');
console.log('📧 البريد: alslahyamr1@gmail.com');

try {
  bot.sendMessage('@Almariffah', '✅ البوت يعمل الآن وجاهز لاستقبال الطلبات!');
} catch (error) {
  console.log('⚠️ لم يتم إرسال رسالة البدء للمسؤول');
  }
