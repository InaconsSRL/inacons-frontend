export const getColorClass = (level: number, estado: string) => {
    if (estado === 'N') return 'text-gray-900';

    switch (level) {
        case 0: return 'text-red-600';
        case 1: return 'text-sky-700';
        case 2: return 'text-yellow-700';
        case 3: return 'text-purple-600';
        case 4: return 'text-green-700';
        case 5: return 'text-orange-600';
        case 6: return 'text-blue-800';
        case 7: return 'text-pink-600';
        default: return 'text-indigo-600';
    }
};