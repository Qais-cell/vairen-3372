import React, { useState } from 'react';

export default function ProfessionDetailTab({ professionData }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 space-y-6">
      {/* رأس الصفحة وعنوان المهنة */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-emerald-400">{professionData.title}</h1>
        <span className="bg-emerald-900/50 text-emerald-300 text-xs px-3 py-1 rounded-full">تبويب تفاعلي داخلي</span>
      </div>

      {/* أزرار التنقل بين التبويبات (الأقسام، الصوت، الصور، الاختبارات) */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
        >
          نظرة عامة والأقسام
        </button>
        <button 
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'audio' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
        >
          المساعد الصوتي والشرح
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'gallery' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
        >
          الصور التوضيحية
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'quiz' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
        >
          الاختبارات والتحديات
        </button>
      </div>

      {/* محتوى التبويب النشط */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">أقسام ومحتوى المهنة</h3>
            <p className="text-gray-300 leading-relaxed">{professionData.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {professionData.sections?.map((sec, index) => (
                <div key={index} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-bold text-emerald-300 mb-1">{sec.title}</h4>
                  <p className="text-sm text-gray-400">{sec.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-4 text-center py-8">
            <div className="w-20 h-20 bg-emerald-600/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              🎙️
            </div>
            <h3 className="text-xl font-semibold">جلسة الشرح الصوتي المباشر</h3>
            <p className="text-gray-400 max-w-md mx-auto">تحدث مع المساعد الذكي الآن لسماع شرح مفصل لكل قسم بطريقة ممتعة وتفاعلية.</p>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all">
              بدء الاستماع والشرح الصوتي
            </button>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">معصور الشرح التوضيحية</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {professionData.images?.map((imgUrl, index) => (
                <div key={index} className="h-40 rounded-lg overflow-hidden border border-gray-700">
                  <img src={imgUrl} alt="توضيح المهنة" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">اختبر معلوماتك في هذه المرحلة</h3>
            <p className="text-gray-300">أجب عن الأسئلة التالية لتقييم فهمك لمحتوى المهنة واجتياز المرحلة بنجاح.</p>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="font-medium text-emerald-300 mb-2">سؤال: ما هو الأساس الأول للبدء بهذه المهنة؟</p>
              <div className="space-y-2">
                <button className="w-full text-right p-3 rounded bg-gray-700/50 hover:bg-gray-700 text-sm">التخطيط والإعداد المسبق</button>
                <button className="w-full text-right p-3 rounded bg-gray-700/50 hover:bg-gray-700 text-sm">التخطي والقفز للمرحلة النهائية</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
