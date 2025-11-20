"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ color: '#c00', fontSize: 32 }}>Ocurrió un error</h1>
      <p style={{ marginTop: 20, fontSize: 18 }}>No se pudo cargar la página correctamente.</p>
      <pre style={{ background: '#f8d7da', color: '#721c24', padding: 16, borderRadius: 8, marginTop: 20 }}>
        {error?.message || 'Error desconocido'}
      </pre>
    </div>
  );
}
