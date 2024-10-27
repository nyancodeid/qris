export class MerchantCriteria {
    static MICRO = 'micro';
    static SMALL = 'small';
    static MEDIUM = 'medium';
    static LARGE = 'large';
    static REGULAR = 'regular';

    static from(criteria: string): MerchantCriteria {
        switch (criteria) {
            case 'UMI': return MerchantCriteria.MICRO;
            case 'UKE': return MerchantCriteria.SMALL;
            case 'UME': return MerchantCriteria.MEDIUM;
            case 'UBE': return MerchantCriteria.LARGE;
            case 'URE': return MerchantCriteria.REGULAR;
            default: return MerchantCriteria.REGULAR;
        }
    }

    static code(type: string): string {
        switch (type) {
            case MerchantCriteria.MICRO: return 'UMI';
            case MerchantCriteria.SMALL: return 'UKE';
            case MerchantCriteria.MEDIUM: return 'UME';
            case MerchantCriteria.LARGE: return 'UBE';
            case MerchantCriteria.REGULAR: return 'URE';
            default: return 'URE';
        }
    }
}