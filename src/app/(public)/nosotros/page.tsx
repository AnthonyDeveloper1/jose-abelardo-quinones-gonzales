import Image from 'next/image'

export default function NosotrosPage() {
  return (
    <div>
      {/* NOSOTROS */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Nosotros</h1>
          <p className="text-xl text-slate-300">Conoce nuestra misión, visión y valores institucionales</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Datos Generales */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 text-left flex flex-col items-start">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Datos Generales</h3>
              <ul className="text-slate-700 text-sm space-y-1">
                <li><strong>Nombre:</strong> I.E.P. “José Abelardo Quiñones Gonzales”</li>
                <li><strong>Ubicación:</strong> Av. Las Malvinas s/n, Las Américas – San Juan Bautista, Huamanga – Ayacucho</li>
                <li><strong>UGEL:</strong> Huamanga</li>
                <li><strong>DRE:</strong> Ayacucho</li>
                <li><strong>Niveles:</strong> Inicial, Primaria y Secundaria</li>
                <li><strong>Turnos:</strong> Mañana y Tarde</li>
                <li><strong>Vigencia PEI:</strong> 2023 – 2027</li>
              </ul>
            </div>
            {/* Equipo Directivo */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 text-left flex flex-col items-start">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Equipo Directivo</h3>
              <ul className="text-slate-700 text-sm space-y-1">
                <li><strong>Director:</strong> Prof. Teodulfo Juan Pacotaípe Huaycha</li>
                <li><strong>Subdirector Secundaria:</strong> Lic. Iván Saúl Quispe Sulca</li>
                <li><strong>Subdirectores Inicial/Primaria:</strong> Lic. Luz Pacotaípe Allcca y Lic. Eleuterio Huamani Palomino</li>
              </ul>
            </div>
            {/* Infraestructura */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 text-left flex flex-col items-start">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Infraestructura</h3>
              <ul className="text-slate-700 text-sm space-y-1">
                <li><strong>Aulas:</strong> 22</li>
                <li><strong>Biblioteca:</strong> 0</li>
                <li><strong>Centro de Recursos Tecnológicos:</strong> 1</li>
                <li><strong>Dirección:</strong> 1</li>
                <li><strong>Servicios higiénicos estudiantes:</strong> 5</li>
                <li><strong>Servicios higiénicos docentes:</strong> 4</li>
                <li><strong>Patios:</strong> 2</li>
              </ul>
            </div>
            {/* Población Educativa */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 text-left flex flex-col items-start">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Población Educativa</h3>
              <ul className="text-slate-700 text-sm space-y-1">
                <li><strong>Estudiantes:</strong> 1250</li>
                <li><strong>Docentes:</strong> 58</li>
                <li><strong>Directivos:</strong> 4</li>
                <li><strong>Administrativos:</strong> 5</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center gap-12">
          {/* Misión */}
          <div className="bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-2xl shadow-lg p-10 flex flex-col items-center w-80 h-80 justify-center border border-pink-100">
            <span className="text-pink-500 text-4xl mb-4">🎯</span>
            <h2 className="text-2xl font-bold text-black mb-4">Nuestra Misión</h2>
            <p className="text-black text-base text-center">Brindamos servicios educativos de calidad, desarrollando competencias y formación integral, con docentes comprometidos y el apoyo de las familias e instituciones aliadas.</p>
          </div>
          {/* Visión */}
          <div className="bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-2xl shadow-lg p-10 flex flex-col items-center w-80 h-80 justify-center border border-pink-100">
            <span className="text-pink-500 text-4xl mb-4">🌠</span>
            <h2 className="text-2xl font-bold text-black mb-4">Nuestra Visión</h2>
            <p className="text-black text-base text-center">Ser una institución líder en Ayacucho, reconocida por su calidad educativa, innovación pedagógica y clima institucional saludable; formando ciudadanos críticos, autónomos y creativos.</p>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl overflow-hidden flex items-center justify-center">
            <Image src="https://images.unsplash.com/photo-1509062522246-3755977927d7" alt="Historia del colegio" fill className="object-cover rounded-2xl" />
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-white/90 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Reseña Histórica</h2>
              <p className="text-gray-700 text-justify mb-2">La I.E.P. “José Abelardo Quiñones Gonzales” surge en 1990 por la necesidad educativa del pueblo joven Ciudad Libertad de Las Américas, San Juan Bautista. Se amplió a secundaria en 2001 y a inicial en 2009. Atiende estudiantes de diversas zonas, con predominio del castellano y presencia de quechua. El nombre honra al héroe nacional José Abelardo Quiñones, mártir de la guerra de 1941.</p>
              <ul className="text-slate-700 text-sm space-y-1 mt-4">
                <li><strong>1990:</strong> Creación del nivel Primaria</li>
                <li><strong>2001:</strong> Ampliación al nivel Secundaria</li>
                <li><strong>2009:</strong> Incorporación del nivel Inicial</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES INSTITUCIONALES */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Identidad y Valores Institucionales</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Valores (acortados) */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-700 text-2xl mb-2">💠</span>
              <h3 className="font-bold text-blue-900 mb-2">Valores</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li><strong>Responsabilidad:</strong> Puntualidad y compromiso.</li>
                <li><strong>Respeto:</strong> Buen trato y cuidado patrimonial.</li>
                <li><strong>Solidaridad:</strong> Apoyo mutuo.</li>
                <li><strong>Integridad:</strong> Honestidad y justicia.</li>
                <li><strong>Identidad:</strong> Pertenencia institucional.</li>
              </ul>
            </div>
            {/* Propuesta Pedagógica */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-700 text-2xl mb-2">📘</span>
              <h3 className="font-bold text-blue-900 mb-2">Propuesta Pedagógica</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li>Currículo Nacional y enfoque por competencias.</li>
                <li>Modelo EIB urbano, reconocimiento del quechua.</li>
                <li>Docente mediador, estudiante protagonista.</li>
                <li>Evaluación formativa y retroalimentación.</li>
                <li>Diversificación curricular local.</li>
              </ul>
            </div>
            {/* Perfil de Egreso */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <span className="text-blue-700 text-2xl mb-2">🎓</span>
              <h3 className="font-bold text-blue-900 mb-2">Perfil de Egreso</h3>
              <ul className="text-gray-700 text-sm text-center space-y-1">
                <li>Identidad cultural y ciudadanía democrática.</li>
                <li>Vida saludable y apreciación artística.</li>
                <li>Indagación científica y resolución de problemas.</li>
                <li>Emprendimiento y uso responsable de TIC.</li>
                <li>Aprendizaje autónomo.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LLAMADO A LA ACCIÓN */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Quieres ser parte de nuestra comunidad?</h2>
          <p className="text-xl text-gray-300 mb-8">Conoce más sobre nuestro proceso de admisión</p>
          <a href="/contacto" className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">Contáctanos</a>
        </div>
      </section>
    </div>
  )
}
