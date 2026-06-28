import MetadataCard from '../components/MetadataCard';
import MapDisplay from '../components/MapDisplay';
import TamperingCard from '../components/TamperingCard';
import HashCard from '../components/HashCard';
import DetectionCard from '../components/DetectionCard';

export default function Analysis({ results, onBack }) {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">📊 Analysis Results</h1>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metadata Card */}
          {results?.metadata && (
            <MetadataCard metadata={results.metadata} />
          )}

          {/* Map Display */}
          {results?.location && (
            <MapDisplay location={results.location} />
          )}

          {/* Tampering Card */}
          {results?.tampering && (
            <TamperingCard tampering={results.tampering} />
          )}

          {/* Hash Card */}
          {results?.hashes && (
            <HashCard hashes={results.hashes} />
          )}

          {/* Detection Card */}
          {results?.detection && (
            <DetectionCard detection={results.detection} />
          )}
        </div>
      </div>
    </div>
  );
}
