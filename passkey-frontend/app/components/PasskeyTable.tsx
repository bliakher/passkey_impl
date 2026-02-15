const MOCK_PASSKEYS = [
  {
    id: "pk_01",
    device: "MacBook Pro",
    createdAt: "2025-12-01T10:30:00Z",
    publicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7x...",
  },
  {
    id: "pk_02",
    device: "iPhone 15",
    createdAt: "2025-12-15T14:22:00Z",
    publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCg...",
  },
  {
    id: "pk_03",
    device: "Windows Desktop",
    createdAt: "2026-01-08T09:15:00Z",
    publicKey: "MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEVxHnGd...",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncateKey(key: string, length = 20) {
  return key.length > length ? key.slice(0, length) + "..." : key;
}

export function PasskeyTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-gray-500">
            <th className="py-3 px-4 font-medium">ID</th>
            <th className="py-3 px-4 font-medium">Device</th>
            <th className="py-3 px-4 font-medium">Created At</th>
            <th className="py-3 px-4 font-medium">Public Key</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_PASSKEYS.map((passkey) => (
            <tr key={passkey.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 font-mono text-xs">{passkey.id}</td>
              <td className="py-3 px-4">{passkey.device}</td>
              <td className="py-3 px-4">{formatDate(passkey.createdAt)}</td>
              <td className="py-3 px-4 font-mono text-xs">{truncateKey(passkey.publicKey)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
