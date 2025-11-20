'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const carouselImages = [
  {
    url: '/images/portada1.jpg',
    title: 'Excelencia Académica',
    description: 'Formando líderes del mañana'
  },
  {
    url: '/images/portada2.jpg',
    title: 'Educación Integral',
    description: 'Desarrollando el potencial de cada estudiante'
  },
  {
    url: '/images/portada3.jpg',
    title: 'Nuestro Equipo Docente',
    description: 'Profesores comprometidos con la formación y el acompañamiento de cada estudiante.'
  },
  {
    url: '/images/portada4.jpg',
    title: 'Tecnología en el Aula',
    description: 'Estudiantes aprendiendo con tablets y recursos digitales para el futuro.'
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    timeout = setTimeout(() => {
      setCurrentSlide((prev) => prev === carouselImages.length - 1 ? 0 : prev + 1);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [currentSlide, carouselImages.length]);

  return (
    <section className="relative h-[500px] overflow-hidden bg-slate-900">
      {/* Slides */}
      {carouselImages.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.url}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
          
          {/* Contenido del slide */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-200 mb-8 drop-shadow-lg">
                  {slide.description}
                </p>
                <div className="flex gap-4">
                  <a
                    href="/contacto"
                    className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200 shadow-lg"
                  >
                    Contáctanos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
