export const formatPhoneNumber = (value: string | undefined | null): string => {
    if (!value) return '';

    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Check length to decide format
    // (XX) XXXXX-XXXX for cellphones (11 digits)
    // (XX) XXXX-XXXX for landlines (10 digits)

    if (numericValue.length <= 10) {
        return numericValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
};
