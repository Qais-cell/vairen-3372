import React from 'react';

export default function InternalCourseView({ courseData }) {
  if (!courseData) return null;

  return (
    <div className="p-4 rounded-xl bg-gray-900 text-white shadow-lg space-y-4 my-4">
      <h2 className="text-2xl font-bold">{courseData.title}</h2>
      
      {/* عرض الصورة التعليمية الداخلية بدل اليوتيوب */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
        <img 
          src={courseData.imageUrl} 
          alt={courseData.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* الشرح والمراحل الضمنية */}
      <div className="space-y-2 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-emerald-400">محتوى المرحلة التعليمية</h3>
        <p className="text-gray-300 leading-relaxed">{courseData.description}</p>
      </div>
    </div>
  );
}
