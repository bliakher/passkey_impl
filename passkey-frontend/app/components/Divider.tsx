export function Divider({ label }: { label: string }) {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-500" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-gray-800 px-2 text-gray-400">{label}</span>
            </div>
        </div>
    );
}
