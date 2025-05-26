import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
  const slides = [
    {
      title: "Аренда автомобилей",
      description: "Чтобы забронировать автомобиль - авторизуйтеь",
    },
    {
      title: "Как арендовать авто?",
      description: "Авторизуйтесь, выберите автомобиль, введите номер телефона, данные пасспорта и водительского удостоверения. Забронируйте авто, получите код и предъявите его администратору проката по адресу расположения автомобиля. Наслаждайтесь поездкой!",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);
  const [offset, setOffset] = useState(0);

  // Обработчик параллакс-эффекта
  const handleScroll = () => {
    setOffset(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Автоматическая смена слайдов
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(false);
    }, 500);
  };

  return (
    <div className="slider-container">
      {/* Фоновое изображение с параллакс-эффектом */}
      <div 
        className="slider-background"
        style={{          
          transform: `translateY(${offset * 0.5}px)` // Параллакс-эффект
        }}
      ></div>
      
      {/* Текстовый контент */}
      <div className={`slider-content ${fade ? 'fade-out' : 'fade-in'}`}>
        <h1>{slides[currentSlide].title}</h1>
        <p>{slides[currentSlide].description}</p>
      </div>
      
      {/* Навигационные точки */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;