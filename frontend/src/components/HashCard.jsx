export default function HashCard({ hashes }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">🔐 Hash Fingerprints</h2>
      <div className="space-y-2 text-xs font-mono">
        <p className="break-all"><strong>MD5:</strong> {hashes?.md5?.substring(0, 32)}...</p>
        <p className="break-all"><strong>SHA256:</strong> {hashes?.sha256?.substring(0, 32)}...</p>
      </div>
    </div>
  );
}
