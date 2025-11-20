"use client";
import { useState, useEffect } from "react";

interface ContactSubject {
  id: number;
  name: string;
  description?: string;
}

export default function ContactoPage() {
    const [subjects, setSubjects] = useState<ContactSubject[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
      nombre: "",
      correo: "",
      telefono: "",
      asuntoId: "",
      mensaje: "",
    });

    useEffect(() => {
      fetch("/api/contact-subjects")
        .then((res) => res.json())
        .then((data) => setSubjects(Array.isArray(data.subjects) ? data.subjects : []))
        .catch(() => setSubjects([]));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setSuccess(false);
      const emailDomain = formData.correo.toLowerCase().split("@")[1];
      const validDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
      if (!validDomains.includes(emailDomain)) {
        alert("Por favor usa un correo válido de Gmail, Hotmail, Outlook o Yahoo.");
        setLoading(false);
        return;
      }
      try {
        const payload = {
          name: formData.nombre,
          email: formData.correo,
          phone: formData.telefono || null,
          subjectId: parseInt(formData.asuntoId),
          message: formData.mensaje,
        };
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Error al enviar mensaje");
        setSuccess(true);
        setFormData({ nombre: "", correo: "", telefono: "", asuntoId: "", mensaje: "" });
        setTimeout(() => setSuccess(false), 5000);
      } catch {
        alert("Error al enviar el mensaje. Por favor intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
      <div>
        {/* HERO */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-xl text-gray-300">¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte</p>
          </div>
        </section>
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {success && (
              <div className="fixed top-20 right-6 z-50 bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">¡Mensaje enviado!</p>
                    <p className="text-xs text-gray-600 mt-1">Te responderemos pronto.</p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre <span className="text-red-500">*</span></label>
                      <input type="text" id="nombre" name="nombre" required minLength={2} value={formData.nombre} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent" placeholder="Tu nombre completo (mínimo 2 caracteres)" />
                    </div>
                    <div>
                      <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico <span className="text-red-500">*</span></label>
                      <input type="email" id="correo" name="correo" required pattern=".*@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$" value={formData.correo} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent" placeholder="tu@gmail.com" title="Usa un correo de Gmail, Hotmail, Outlook o Yahoo" />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent" placeholder="+51 999 999 999" />
                    </div>
                    <div>
                      <label htmlFor="asuntoId" className="block text-sm font-medium text-gray-700 mb-2">Asunto <span className="text-red-500">*</span></label>
                      <select id="asuntoId" name="asuntoId" required value={formData.asuntoId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900 bg-white">
                        <option value="" className="text-gray-500">Selecciona un asunto</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id} className="text-gray-900">{subject.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">Mensaje <span className="text-red-500">*</span></label>
                      <textarea id="mensaje" name="mensaje" required minLength={10} value={formData.mensaje} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent" placeholder="Escribe tu mensaje (mínimo 10 caracteres)" rows={5} />
                      <div className="text-xs text-gray-500 mt-1">{formData.mensaje.length}/10 caracteres mínimos</div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">{loading ? "Enviando..." : "Enviar mensaje"}</button>
                  </form>
                </div>
              </div>
              <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-80">
                  <iframe src="https://www.google.com/maps?q=Instituci%C3%B3n+Educativa+Jos%C3%A9+Abelardo+Qui%C3%B1ones,+Ayacucho&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación Colegio"></iframe>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Tarjetas de contacto institucional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4 flex items-start shadow">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Dirección</h3>
                        <p className="text-blue-800 text-sm">Av. Las Malvinas s/n, Las Américas – San Juan Bautista, Huamanga – Ayacucho</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex items-start shadow">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Email</h3>
                        <p className="text-blue-800 text-sm">colegio.jaqg.huamanga@edu.pe</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex items-start shadow">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Teléfono</h3>
                        <p className="text-blue-800 text-sm">925 233 264</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex items-start shadow">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Horario</h3>
                        <p className="text-blue-800 text-sm">Lunes a Viernes: 7:30 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
