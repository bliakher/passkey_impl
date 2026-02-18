type Credential = {
  id: string;
  device: string;
  createdAt: string;
  publicKey: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function truncate(key: string, length = 20) {
  return key.length > length ? key.slice(0, length) + "..." : key;
}

export function PasskeyTable({ credentials }: { credentials: Credential[] }) {
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
          {credentials.map((passkey) => (
            <tr key={passkey.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 font-mono text-xs">{truncate(passkey.id, 8)}</td>
              <td className="py-3 px-4">{passkey.device}</td>
              <td className="py-3 px-4">{formatDate(passkey.createdAt)}</td>
              <td className="py-3 px-4 font-mono text-xs">{truncate(passkey.publicKey)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
