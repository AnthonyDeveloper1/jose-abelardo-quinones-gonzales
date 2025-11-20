import Link from 'next/link'
import Image from 'next/image'
import HeroCarousel from '@/components/HeroCarousel'
import { prisma } from '@/lib/prisma'

interface Publication {
  id: number
  titulo: string
  slug: string
  descripcion: string | null
  imagenUrl: string | null
  createdAt: string
  tags: { tag: { nombre: string } }[]
}

async function getRecentPublications(): Promise<Publication[]> {
  try {
    const publications = await prisma.publication.findMany({
      where: { status: 'published' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        mainImage: true,
        createdAt: true,
        tags: {
          select: {
            tag: {
              select: { name: true }
            }
          }
        }
      }
    })
    
    return publications.map((p: any) => ({
      id: p.id,
      titulo: p.title,
      slug: p.slug,
      descripcion: p.description,
      imagenUrl: p.mainImage,
      createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
      tags: p.tags.map((e: any) => ({ tag: { nombre: e.tag.name } }))
    }))
  } catch (error) {
    console.error('Error fetching publications:', error)
    return []
  }
}

export default async function HomePage() {
  const publications = await getRecentPublications()

  return (
    <div>
      {/* HERO CAROUSEL */}
      <HeroCarousel />

      {/* RESUMEN INSTITUCIONAL */}
      <section className="py-12 bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-10 text-center">Identidad y Valores Institucionales</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {/* Valores institucionales, centrados y equilibrados */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-800 text-2xl mb-2">💠</span>
              <h3 className="font-bold text-blue-950 mb-2 text-lg">Valores</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li><strong>Responsabilidad:</strong> Puntualidad, orden, compromiso.</li>
                <li><strong>Respeto:</strong> Vocabulario adecuado, cuidado patrimonial.</li>
                <li><strong>Solidaridad:</strong> Apoyo mutuo, empatía.</li>
                <li><strong>Integridad:</strong> Honestidad, justicia, autocrítica.</li>
                <li><strong>Identidad:</strong> Pertenencia institucional y cultural.</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-800 text-2xl mb-2">📘</span>
              <h3 className="font-bold text-blue-950 mb-2 text-lg">Propuesta Pedagógica</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li>Currículo Nacional y enfoque por competencias.</li>
                <li>Modelo EIB urbano, reconocimiento del quechua.</li>
                <li>Docente mediador, estudiante protagonista.</li>
                <li>Evaluación formativa y retroalimentación.</li>
                <li>Diversificación curricular local.</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-800 text-2xl mb-2">🎓</span>
              <h3 className="font-bold text-blue-950 mb-2 text-lg">Perfil de Egreso</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li>Identidad cultural y ciudadanía democrática.</li>
                <li>Vida saludable y apreciación artística.</li>
                <li>Indagación científica y resolución de problemas.</li>
                <li>Emprendimiento y uso responsable de TIC.</li>
                <li>Aprendizaje autónomo.</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-800 text-2xl mb-2">🏫</span>
              <h3 className="font-bold text-blue-950 mb-2 text-lg">Datos Generales</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li><strong>Nombre:</strong> I.E.P. “José Abelardo Quiñones Gonzales”</li>
                <li><strong>Ubicación:</strong> Av. Las Malvinas s/n, Las Américas – San Juan Bautista, Huamanga – Ayacucho</li>
                <li><strong>UGEL:</strong> Huamanga</li>
                <li><strong>DRE:</strong> Ayacucho</li>
                <li><strong>Niveles:</strong> Inicial, Primaria y Secundaria</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-800 text-2xl mb-2">👨‍🏫</span>
              <h3 className="font-bold text-blue-950 mb-2 text-lg">Equipo Directivo</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li><strong>Director:</strong> Prof. Teodulfo Juan Pacotaípe Huaycha</li>
                <li><strong>Subdirector Secundaria:</strong> Lic. Iván Saúl Quispe Sulca</li>
                <li><strong>Subdirectores Inicial/Primaria:</strong> Lic. Luz Pacotaípe Allcca y Lic. Eleuterio Huamani Palomino</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VISIÓN Y MISIÓN - Diseño Horizontal Profesional */}
      {/* Sección eliminada para evitar duplicidad de misión/visión */}

      {/* POR QUÉ ELEGIRNOS - Nueva Sección */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full mb-4">
              Nuestras Fortalezas
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Más de 20 años formando líderes comprometidos con el futuro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Excelencia Académica */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Excelencia Académica</h3>
              <p className="text-slate-300 leading-relaxed">
                Programas educativos innovadores con metodologías actualizadas y docentes altamente calificados.
              </p>
            </div>

            {/* Formación Integral */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Formación Integral</h3>
              <p className="text-slate-300 leading-relaxed">
                Desarrollo de habilidades académicas, artísticas, deportivas y valores fundamentales.
              </p>
            </div>

            {/* Infraestructura */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Infraestructura Moderna</h3>
              <p className="text-slate-300 leading-relaxed">
                Instalaciones equipadas con tecnología educativa de vanguardia para un mejor aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRESENTACIÓN - Mejorada */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-6">
              Sobre Nosotros
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              I.E.P. “José Abelardo Quiñones Gonzales”
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              Institución educativa líder en Ayacucho, comprometida con la excelencia académica, innovación pedagógica y formación integral de estudiantes críticos, autónomos y creativos.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              Fundada en 1990, ampliada a secundaria en 2001 e inicial en 2009. Atendemos 1250 estudiantes con 58 docentes y 4 directivos, en turnos mañana y tarde, bajo el modelo EIB urbano y el Currículo Nacional.
            </p>
            
            {/* Características destacadas */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Docentes Calificados</p>
                  <p className="text-sm text-slate-600">Profesionales con vocación</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Infraestructura Moderna</p>
                  <p className="text-sm text-slate-600">Instalaciones equipadas</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Valores Sólidos</p>
                  <p className="text-sm text-slate-600">Formación ética</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Acompañamiento</p>
                  <p className="text-sm text-slate-600">Atención personalizada</p>
                </div>
              </div>
            </div>

            <Link
              href="/nosotros"
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group"
            >
              Conocer más sobre nosotros
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800"
                alt="Sobre el colegio"
                fill
                className="object-cover"
              />
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
            {/* Elemento decorativo flotante */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-white">20+</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Años de</p>
                  <p className="text-slate-600">Experiencia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGROS Y CERTIFICACIONES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-yellow-50 text-yellow-700 text-sm font-semibold rounded-full mb-4">
              Nuestros Logros
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Reconocimientos y Certificaciones
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Compromiso con la excelencia respaldado por instituciones nacionales e internacionales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Acreditación MINEDU</h3>
              <p className="text-slate-600 leading-relaxed">
                Institución educativa acreditada por el Ministerio de Educación del Perú con los más altos estándares de calidad.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Excelencia Académica</h3>
              <p className="text-slate-600 leading-relaxed">
                Primeros lugares en competencias académicas regionales y nacionales de matemáticas, ciencias y comunicación.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Compromiso Ambiental</h3>
              <p className="text-slate-600 leading-relaxed">
                Reconocimiento como Escuela Ecoeficiente por nuestro compromiso con la sostenibilidad y el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full mb-4">
              Testimonios
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Lo Que Dicen Nuestras Familias
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Experiencias reales de padres y estudiantes que forman parte de nuestra comunidad educativa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">María González</h4>
                  <p className="text-sm text-slate-600">Madre de familia</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "Excelente institución. Mi hijo ha desarrollado no solo conocimientos académicos, 
                sino también valores y habilidades para la vida. Los profesores son muy dedicados."
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  C
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Carlos Mendoza</h4>
                  <p className="text-sm text-slate-600">Padre de familia</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "Las instalaciones son modernas y el nivel académico es muy alto. 
                Mi hija siempre está motivada para aprender. Muy recomendable."
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Ana Rodríguez</h4>
                  <p className="text-sm text-slate-600">Estudiante - 5to Sec.</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "He crecido mucho aquí, no solo académicamente sino como persona. 
                Los profesores nos motivan a dar lo mejor de nosotros cada día."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ÚLTIMAS PUBLICACIONES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Noticias</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Últimas Publicaciones
            </h2>
            <p className="text-slate-600 text-lg">
              Mantente informado sobre nuestras actividades y novedades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.length > 0 ? (
              publications.map((pub) => (
                <Link
                  key={pub.id}
                  href={`/publicaciones/${pub.slug}`}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="relative h-48 bg-slate-200">
                    {pub.imagenUrl && (
                      <Image
                        src={pub.imagenUrl}
                        alt={pub.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
                      {pub.titulo}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                      {new Date(pub.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {pub.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pub.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                          >
                            {t.tag.nombre}
                          </span>
                        ))}
                      </div>
                    )}
                    {pub.descripcion && (
                      <p className="text-slate-600 text-sm line-clamp-3">
                        {pub.descripcion}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-lg">No hay publicaciones disponibles</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/publicaciones"
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md font-medium"
            >
              Ver todas las publicaciones
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS - Mejoradas con diseño moderno */}
      <section className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-20 relative overflow-hidden">
        {/* Patrón de fondo animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="mb-4 inline-block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-slate-300 font-medium">Estudiantes</div>
              <div className="text-slate-400 text-sm mt-1">En todos los niveles</div>
            </div>

            <div className="text-center group">
              <div className="mb-4 inline-block">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-slate-300 font-medium">Profesores</div>
              <div className="text-slate-400 text-sm mt-1">Altamente calificados</div>
            </div>

            <div className="text-center group">
              <div className="mb-4 inline-block">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-2">100+</div>
              <div className="text-slate-300 font-medium">Aulas</div>
              <div className="text-slate-400 text-sm mt-1">Equipadas</div>
            </div>

            <div className="text-center group">
              <div className="mb-4 inline-block">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-2">20+</div>
              <div className="text-slate-300 font-medium">Años</div>
              <div className="text-slate-400 text-sm mt-1">De experiencia</div>
            </div>
          </div>
        </div>
      </section>

      {/* CRONOLOGÍA - NUESTRA HISTORIA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4 border border-white/20">
              Nuestra Trayectoria
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Más de 20 Años de Historia
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Un camino de excelencia y compromiso con la educación peruana
            </p>
          </div>

          <div className="relative">
            {/* Línea vertical central */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

            <div className="space-y-12">
              {/* Hito 1 - Fundación */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold mb-3">
                      2003
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Fundación del Colegio</h3>
                    <p className="text-slate-300">
                      Inicio de nuestro compromiso con la educación de calidad en Pisco
                    </p>
                  </div>
                </div>
                <div className="md:col-start-2">
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900 shadow-lg shadow-blue-500/50" />
                </div>
              </div>

              {/* Hito 2 - Primera Promoción */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:col-start-2">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-3">
                      2008
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Primera Promoción</h3>
                    <p className="text-slate-300">
                      Graduación de nuestros primeros estudiantes con excelentes resultados
                    </p>
                  </div>
                </div>
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-slate-900 shadow-lg shadow-purple-500/50" />
              </div>

              {/* Hito 3 - Infraestructura */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold mb-3">
                      2015
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Modernización de Instalaciones</h3>
                    <p className="text-slate-300">
                      Nuevos laboratorios, biblioteca digital y espacios deportivos
                    </p>
                  </div>
                </div>
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-900 shadow-lg shadow-green-500/50" />
              </div>

              {/* Hito 4 - Acreditación */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:col-start-2">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-semibold mb-3">
                      2020
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Acreditación MINEDU</h3>
                    <p className="text-slate-300">
                      Reconocimiento oficial a nuestra excelencia académica y gestión educativa
                    </p>
                  </div>
                </div>
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-slate-900 shadow-lg shadow-orange-500/50" />
              </div>

              {/* Hito 5 - Actualidad */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm font-semibold mb-3">
                      2024
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Liderando la Educación</h3>
                    <p className="text-slate-300">
                      Innovación pedagógica, tecnología educativa y proyección al futuro
                    </p>
                  </div>
                </div>
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full border-4 border-slate-900 shadow-lg shadow-pink-500/50 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Contador de logros */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-white/10">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">20+</div>
              <div className="text-slate-300">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-slate-300">Generaciones Graduadas</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">1000+</div>
              <div className="text-slate-300">Estudiantes Formados</div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA VISUAL */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-pink-50 text-pink-700 text-sm font-semibold rounded-full mb-4">
              Nuestra Vida Escolar
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Momentos que Inspiran
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Capturando la esencia de nuestra comunidad educativa día a día
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Imagen 1 */}
            <div className="col-span-2 row-span-2 relative h-96 rounded-3xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"
                alt="Estudiantes"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-semibold text-lg">Actividades Académicas</p>
              </div>
            </div>

            {/* Imagen 2 */}
            <div className="relative h-44 rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400"
                alt="Trabajo en equipo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold text-sm">Trabajo en Equipo</p>
              </div>
            </div>

            {/* Imagen 3 */}
            <div className="relative h-44 rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400"
                alt="Laboratorio"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold text-sm">Laboratorios</p>
              </div>
            </div>

            {/* Imagen 4 */}
            <div className="relative h-44 rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400"
                alt="Aula"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold text-sm">Aulas Modernas</p>
              </div>
            </div>

            {/* Imagen 5 */}
            <div className="relative h-44 rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400"
                alt="Deportes"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold text-sm">Actividades Deportivas</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/galeria"
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group"
            >
              Ver toda la galería
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACTO RÁPIDO */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Contacto</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            Estamos aquí para ayudarte. Ponte en contacto con nosotros
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md font-medium"
          >
            Contáctanos ahora
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
