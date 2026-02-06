export const runtime = 'edge';

export default function Home() {
  console.log(">>> [DEBUG] Globaaal Network Worker Started");
  console.log(">>> [DEBUG] Environment URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "EXISTS" : "MISSING");

  try {
    return (
      <main style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '2rem' }}>
        <h1 style={{ fontStyle: 'italic', fontWeight: '900' }}>
          DEBUG MODE: <span style={{ color: '#22c55e' }}>ON</span>
        </h1>
        <p>Если ты видишь этот текст, значит 404 побеждена.</p>
        <p>Время сервера: {new Date().toISOString()}</p>
      </main>
    );
  } catch (e: any) {
    console.error(">>> [ERROR] Render failed:", e.message);
    return <div style={{ color: 'red' }}>Error: {e.message}</div>;
  }
}
