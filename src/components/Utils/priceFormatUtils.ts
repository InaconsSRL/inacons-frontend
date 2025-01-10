export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'decimal'
    }).format(amount);
};