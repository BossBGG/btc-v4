import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../stores/theme.store';

interface CarouselProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
}

function Carousel({
  images,
  autoPlay = true,
  interval = 5000,
  showIndicators = true,
  showArrows = true,
}: CarouselProps) {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // จัดการ autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, interval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, interval, images.length]);

  // ฟังก์ชันเปลี่ยนสไลด์
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // รีเซ็ต autoplay เมื่อมีการเปลี่ยนสไลด์ด้วยตนเอง
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, interval);
      }
    }
  };

  // ฟังก์ชันไปยังสไลด์ก่อนหน้า
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // ฟังก์ชันไปยังสไลด์ถัดไป
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // หยุด autoplay เมื่อ hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      setIsAutoPlaying(false);
    }
  };

  // เริ่ม autoplay อีกครั้งเมื่อ mouse leave
  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsAutoPlaying(true);
    }
  };

  return (
    <div 
      className="relative w-full rounded-lg overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ส่วนของสไลด์ */}
      <div className="relative h-64 md:h-80">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ปุ่มนำทาง */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 p-1 rounded-full bg-white bg-opacity-70 shadow hover:bg-opacity-100 transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 p-1 rounded-full bg-white bg-opacity-70 shadow hover:bg-opacity-100 transition-all"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators (จุดแสดงตำแหน่งสไลด์) */}
      {showIndicators && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-blue-600 w-6'
                  : theme === 'dark'
                  ? 'bg-gray-400'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;