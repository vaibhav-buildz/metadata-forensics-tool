import { IconLock, IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

export default function HashCard({ hashes }) {
  const [copiedHash, setCopiedHash] = useState(null);

  if (!hashes) return null;

  const handleCopy = (hashValue, type) => {
    if (!hashValue) return;
    navigator.clipboard.writeText(hashValue);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const HashBlock = ({ title, value, type, description }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-[#111827] text-[14px]">{title}</h3>
        <button 
          onClick={() => handleCopy(value, type)}
          className="text-[#9CA3AF] hover:text-[#7C3AED] transition-colors p-1"
          title="Copy to clipboard"
        >
          {copiedHash === type ? <IconCheck size={18} className="text-[#16A34A]" /> : <IconCopy size={18} />}
        </button>
      </div>
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 font-mono text-[13px] text-[#4B5563] truncate shadow-sm" title={value || "Not generated"}>
        {value || "Not generated"}
      </div>
      {description && (
        <p className="text-[12px] text-[#6B7280] mt-2.5 font-medium">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-[#7C3AED] hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 ease-out">
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-violet-50 text-[#7C3AED] rounded-lg">
          <IconLock size={24} stroke={1.5} />
        </div>
        <h2 className="text-[18px] font-semibold text-[#7C3AED]">
          Digital Fingerprints
        </h2>
      </div>

      <div className="space-y-4">
        <HashBlock 
          title="MD5 Hash" 
          type="md5" 
          value={hashes.md5} 
          description="Standard file integrity check. Fast, but vulnerable to collisions." 
        />
        <HashBlock 
          title="SHA-256 Hash" 
          type="sha256" 
          value={hashes.sha256} 
          description="Cryptographically secure hash used for strict digital evidence." 
        />
        <HashBlock 
          title="Perceptual Hash (pHash)" 
          type="phash" 
          value={hashes.phash} 
          description="Visual hash. Finds similar images even if resized or compressed." 
        />
      </div>
    </div>
  );
}
