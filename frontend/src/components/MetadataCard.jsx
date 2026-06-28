export default function MetadataCard({ metadata }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">📋 Metadata</h2>
      <div className="space-y-2 text-sm">
        <p><strong>File:</strong> {metadata?.filename}</p>
        <p><strong>Size:</strong> {metadata?.filesize}</p>
        <p><strong>Camera:</strong> {metadata?.camera}</p>
        <p><strong>Date:</strong> {metadata?.datetime}</p>
      </div>
    </div>
  );
}
