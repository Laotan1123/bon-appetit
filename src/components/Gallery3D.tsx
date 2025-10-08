import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const throttleDelay = 16; // ~60fps

  // Optimized food photography images with WebP format for better performance
  const images = useMemo(() => [
    {
      src: '/bon-appetit/images/gallery/IMG_1191.JPG',
      alt: 'Fine dining plating'
    },
    {
      src: '/bon-appetit/images/gallery/IMG_9441.JPG',
      alt: 'Wine glasses and ambiance'
    },
    {
      src: '/bon-appetit/images/gallery/IMG_9443.JPG',
      alt: 'Buffet spread'
    },
    {
      src: '/bon-appetit/images/gallery/IMG_9444.JPG',
      alt: 'Dessert showcase'
    },
    {
      src: '/bon-appetit/images/gallery/IMG_9445.JPG',
      alt: 'Restaurant ambiance'
    },
    {
      src: '/bon-appetit/images/gallery/IMG_0246.JPG',
      alt: 'Gourmet dishes'
    },
    {
      src: '/bon-appetit/images/gallery/IMG_0238.JPG',
      alt: 'Premium drinks'
    },
    {
      src: '/bon-appetit/images/gallery/IMG_0173.JPG',
      alt: 'Culinary presentation'
    }
  ], []);

  // Optimized function to update carousel positions with GPU acceleration
  const updateCarouselPositions = useCallback((rotation: number) => {
    if (!isVisible) return; // Skip updates when not visible
    
    const items = itemsRef.current.filter(Boolean);
    const totalItems = items.length;
    const angleStep = (Math.PI * 2) / totalItems;
    const radius = 400;
    const maxDistance = radius + 200;
    
    // Use gsap.set for immediate positioning to reduce lag
    gsap.set(items, {
      x: (index) => {
        const angle = (index * angleStep) + rotation;
        return Math.sin(angle) * radius;
      },
      z: (index) => {
        const angle = (index * angleStep) + rotation;
        return Math.cos(angle) * radius - 200;
      },
      rotationY: (index) => {
        const angle = (index * angleStep) + rotation;
        return angle * (180 / Math.PI);
      },
      scale: (index) => {
        const angle = (index * angleStep) + rotation;
        const z = Math.cos(angle) * radius - 200;
        const distanceFromViewer = Math.abs(z + 200);
        return Math.max(0.7, 1 - (distanceFromViewer / maxDistance) * 0.3);
      },
      opacity: (index) => {
        const angle = (index * angleStep) + rotation;
        const z = Math.cos(angle) * radius - 200;
        const distanceFromViewer = Math.abs(z + 200);
        if (distanceFromViewer < 100) return 1.0;
        if (distanceFromViewer < 300) return 1.0;
        return 0.90;
      },
      zIndex: (index) => {
        const angle = (index * angleStep) + rotation;
        const z = Math.cos(angle) * radius - 200;
        const distanceFromViewer = Math.abs(z + 200);
        return Math.round(maxDistance - distanceFromViewer);
      }
    });
  }, [isVisible]);

  // Initialize carousel positions
  useEffect(() => {
    updateCarouselPositions(currentRotation);
  }, [updateCarouselPositions]);

  // Throttled update positions when rotation changes
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const now = performance.now();
    if (now - lastUpdateTime.current >= throttleDelay) {
      updateCarouselPositions(currentRotation);
      lastUpdateTime.current = now;
    } else {
      animationFrameRef.current = requestAnimationFrame(() => {
        updateCarouselPositions(currentRotation);
        lastUpdateTime.current = performance.now();
      });
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentRotation, updateCarouselPositions]);

  // IntersectionObserver to pause animations when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Navigation functions
  const rotateLeft = () => {
    const angleStep = (Math.PI * 2) / images.length;
    setCurrentRotation(prev => prev - angleStep);
  };

  const rotateRight = () => {
    const angleStep = (Math.PI * 2) / images.length;
    setCurrentRotation(prev => prev + angleStep);
  };

  // Optimized mouse/touch event handlers with throttling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, rotation: currentRotation });
  }, [currentRotation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = e.clientX - dragStart.x;
    const sensitivity = 0.008; // Reduced sensitivity for smoother movement
    const newRotation = dragStart.rotation + (deltaX * sensitivity);
    setCurrentRotation(newRotation);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, rotation: currentRotation });
  }, [currentRotation]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - dragStart.x;
    const sensitivity = 0.008; // Reduced sensitivity for smoother movement
    const newRotation = dragStart.rotation + (deltaX * sensitivity);
    setCurrentRotation(newRotation);
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Optimized hover effects with reduced complexity
  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);
    
    items.forEach((item) => {
      if (!item) return;
      
      const handleMouseEnter = () => {
        gsap.to(item, {
          scale: 1.05,
          filter: 'brightness(1.1)',
          duration: 0.2,
          ease: 'power2.out'
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(item, {
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.2,
          ease: 'power2.out'
        });
      };
      
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
      
      // Cleanup function
      return () => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <section className="relative py-20 px-4 bg-brand-brown overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4C2A6' fill-opacity='0.15'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Camera className="w-10 h-10 text-brand-gold" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-brand-ivory mb-4">
            Our Culinary Journey
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-beige to-transparent mx-auto mb-4"></div>
          <p className="text-brand-beige/90 text-lg max-w-2xl mx-auto">
            Experience the artistry and elegance that awaits you at Bon Appétit
          </p>
        </div>

        {/* 3D Carousel Container */}
        <div 
          ref={containerRef}
          className="carousel-container relative h-[600px] flex items-center justify-center"
          style={{ perspective: '2000px' }}
        >
          <div 
            ref={carouselRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((image, index) => (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className="carousel-item absolute cursor-pointer select-none"
                style={{ 
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
              >
                <div className="relative group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-64 h-80 md:w-80 md:h-96 object-cover rounded-lg border-2 border-brand-gold/40 transition-all duration-300"
                    style={{ 
                      filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4)) drop-shadow(0 0 15px rgba(201, 167, 122, 0.2))'
                    }}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/20 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Image caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-brand-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={rotateLeft}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-brand-brown/80 backdrop-blur-sm border border-brand-gold/30 text-brand-ivory hover:bg-brand-gold/20 hover:border-brand-gold/60 transition-all duration-300 group"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>

          <button
            onClick={rotateRight}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-brand-brown/80 backdrop-blur-sm border border-brand-gold/30 text-brand-ivory hover:bg-brand-gold/20 hover:border-brand-gold/60 transition-all duration-300 group"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-brand-beige/70 text-sm">
            Drag to rotate • Click arrows to navigate
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-12 space-x-4">
          <div className="w-2 h-2 bg-brand-gold rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-brand-beige rounded-full opacity-40"></div>
          <div className="w-2 h-2 bg-brand-gold rounded-full opacity-60"></div>
        </div>
      </div>
    </section>
  );
}
