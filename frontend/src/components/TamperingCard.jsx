export default function TamperingCard({ tampering }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">⚠️ Tampering Detection</h2>
      <p className={`text-lg font-bold ${tampering?.is_tampered ? 'text-red-500' : 'text-green-500'}`}>
        {tampering?.verdict}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Score: {tampering?.score}/100
      </p>
    </div>
  );
}
