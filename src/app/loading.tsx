export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-24 text-center" aria-busy="true">
      <p role="status" className="text-gray-400">
        กำลังโหลด...
      </p>
    </main>
  );
}
