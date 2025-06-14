export default function LabelStatus({ status }) {
    const config = {
        online: {
            bg: "bg-green-100",
            text: "text-green-800",
            dot: "bg-green-500",
            label: "Online",
        },
        offline: {
            bg: "bg-gray-200",
            text: "text-gray-800",
            dot: "bg-gray-500",
            label: "Offline",
        },
        active: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            dot: "bg-yellow-500",
            label: "Ativo",
        },
        inactive: {
            bg: "bg-red-100",
            text: "text-red-800",
            dot: "bg-red-500",
            label: "Inativo",
        },
    };

    const data = config[status] || config.offline;

    return (
        <span
            className={`label-status inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${data.bg} ${data.text}`}
        >
            <span className={`w-2 h-2 rounded-full ${data.dot}`} />
            {data.label}
        </span>
    );
}
