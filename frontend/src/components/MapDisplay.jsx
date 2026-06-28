export default function MapDisplay({ location }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">📍 Location</h2>
      <p className="mb-2"><strong>{location?.address}</strong></p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {location?.coordinates}
      </p>
      <div className="mt-4 h-48 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center">
        <p className="text-gray-500">Map coming soon...</p>
      </div>
    </div>
  );
}
