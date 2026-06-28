export default function DetectionCard({ detection }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">👥 Detection Results</h2>
      <p className="mb-2"><strong>Faces:</strong> {detection?.faces}</p>
      <p className="mb-2"><strong>Objects:</strong> {detection?.objects?.join(', ')}</p>
      <p className={`text-sm ${detection?.privacy_alert ? 'text-orange-500' : 'text-green-500'}`}>
        {detection?.privacy_alert ? '⚠️ Privacy concerns' : '✅ No privacy concerns'}
      </p>
    </div>
  );
}
