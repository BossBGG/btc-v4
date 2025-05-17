import { ReactNode, useState } from 'react';
import { useTheme } from '../../stores/theme.store';

// ประเภทกิจกรรม
export interface EventCategoryTab {
  id: string;
  label: string;
  eventType?: 'อบรม' | 'อาสา' | 'ช่วยงาน' | 'ทั้งหมด';
}

interface EventCategoriesProps {
  categories: EventCategoryTab[];
  defaultCategory?: string; // ID of default selected category
  children: (activeCategory: EventCategoryTab) => ReactNode;
}

function EventCategories({ 
  categories, 
  defaultCategory, 
  children 
}: EventCategoriesProps) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<EventCategoryTab>(
    categories.find(cat => cat.id === defaultCategory) || categories[0]
  );

  return (
    <div className="mb-10">
      {/* แท็บเลือกประเภทกิจกรรม */}
      <div className={`mb-6 flex flex-wrap gap-2 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory.id === category.id
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* ส่วนแสดงรายการกิจกรรมตามประเภทที่เลือก */}
      <div>
        {children(activeCategory)}
      </div>
    </div>
  );
}

export default EventCategories;

