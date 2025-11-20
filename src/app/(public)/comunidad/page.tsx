'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Director {
  id: number
  nombre: string
  cargo: string
  descripcion: string | null
  fotoUrl: string | null
  orden: number
}

// ...existing code...

type TabType = 'docentes' | 'estudiantes' | 'padres'

export default function ComunidadPage() {
  const [activeTab, setActiveTab] = useState<TabType>('docentes')

  return (
    <main>
      {/* HERO - Altura reducida y texto institucional */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Nuestra Comunidad Educativa</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comunidad educativa unida, comprometida con la formación integral y los valores de la I.E.P. José Abelardo Quiñones Gonzales.
          </p>
        </div>
      </section>

      {/* TABS - Diseño más moderno */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('docentes')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === 'docentes'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              👨‍🏫 Docentes
            </button>
            <button
              onClick={() => setActiveTab('estudiantes')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === 'estudiantes'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              🎓 Estudiantes
            </button>
            <button
              onClick={() => setActiveTab('padres')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === 'padres'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              👨‍👩‍👧‍👦 Padres de Familia
            </button>
          </nav>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="bg-slate-50 py-12">
        {activeTab === 'docentes' && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Docentes</h2>
              <div className="flex flex-col gap-16">
                {/* Profesores: alternando alineación */}
                {[
                  { img: '/images/Profesor1.jpg', text: 'Docente innovador, promotor de valores y aprendizaje activo.' },
                  { img: '/images/Profesor2.jpg', text: 'Comprometido con el desarrollo integral de los estudiantes.' },
                  { img: '/images/Profesor3.jpg', text: 'Fomenta el pensamiento crítico y la creatividad.' }
                ].map((card, idx) => (
                  <div key={card.img} className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto`} style={{ width: '80%', marginLeft: idx % 2 === 0 ? '0' : 'auto', marginRight: idx % 2 === 0 ? 'auto' : '0', minHeight: '340px' }}>
                    <Image src={card.img} alt={`Profesor ${idx + 1}`} width={600} height={340} className="rounded-2xl object-cover w-[420px] h-[340px]" />
                    <div className="flex-1 flex items-center justify-center">
                      <p className={`text-2xl text-slate-800 font-bold ${idx % 2 === 0 ? 'text-left' : 'text-right'}`} style={{ maxWidth: '420px' }}>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {activeTab === 'estudiantes' && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Estudiantes</h2>
              <div className="flex flex-col gap-16">
                {/* Estudiantes: alternando alineación */}
                {[
                  { img: '/images/Estudiante1.jpg', text: 'Participa activamente en proyectos y actividades escolares.' },
                  { img: '/images/Estudiante2.jpg', text: 'Destaca por su responsabilidad y trabajo en equipo.' },
                  { img: '/images/Estudiante3.jpg', text: 'Ejemplo de liderazgo y compañerismo.' },
                  { img: '/images/Estudiante4.jpg', text: 'Comprometido con el aprendizaje y la superación.' },
                  { img: '/images/Estudiante5.jpg', text: 'Participa en actividades y culturales.' },
                  { img: '/images/Estudiante6.jpg', text: 'Promueve la inclusión y el respeto.' }
                ].map((card, idx) => (
                  <div key={card.img} className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto`} style={{ width: '80%', marginLeft: idx % 2 === 0 ? '0' : 'auto', marginRight: idx % 2 === 0 ? 'auto' : '0', minHeight: '340px' }}>
                    <Image src={card.img} alt={`Estudiante ${idx + 1}`} width={600} height={340} className="rounded-2xl object-cover w-[420px] h-[340px]" />
                    <div className="flex-1 flex items-center justify-center">
                      <p className={`text-2xl text-slate-800 font-bold ${idx % 2 === 0 ? 'text-left' : 'text-right'}`} style={{ maxWidth: '420px' }}>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {activeTab === 'padres' && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Padres de Familia</h2>
              <div className="flex flex-col gap-16">
                {/* Padres: alternando alineación */}
                {[
                  { img: '/images/Padres1.jpg', text: 'Apoya activamente la educación y valores de sus hijos.' }
                ].map((card, idx) => (
                  <div key={card.img} className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto`} style={{ width: '80%', marginLeft: idx % 2 === 0 ? '0' : 'auto', marginRight: idx % 2 === 0 ? 'auto' : '0', minHeight: '340px' }}>
                    <Image src={card.img} alt={`Padre ${idx + 1}`} width={600} height={340} className="rounded-2xl object-cover w-[420px] h-[340px]" />
                    <div className="flex-1 flex items-center justify-center">
                      <p className={`text-2xl text-slate-800 font-bold ${idx % 2 === 0 ? 'text-left' : 'text-right'}`} style={{ maxWidth: '420px' }}>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}