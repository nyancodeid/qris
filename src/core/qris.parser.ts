interface MerchantAccountInformationID {
    reverseDomain: string;  // Tag 00
    globalID: string;       // Tag 01
    id: string;             // Tag 02
    type: string;           // Tag 03
}

interface IAdditionalData {
    billNumber: string;                     // Tag 01
    mobileNumber: string;                   // Tag 02
    storeLabel: string;                     // Tag 03
    loyaltyNumber: string;                  // Tag 04
    referenceLabel: string;                 // Tag 05
    customerLabel: string;                  // Tag 06
    terminalLabel: string;                  // Tag 07
    purposeOfTransaction: string;           // Tag 08
    additionalConsumerDataRequest: string;  // Tag 09
    merchantTaxID: string;                  // Tag 10
    merchantChannel: string;                // Tag 11
    RFU?: any;                              // Reserved for Future Use
    paymentSystemSpecific?: any;            // Payment System Specific Tags (50-99)
}

interface MerchantInformationLanguage {
    languagePreference: string;             // Tag 00
    merchantNameAltLanguage: string;        // Tag 01
    merchantCityAltLanguage: string;        // Tag 02
    RFU?: any;                              // Reserved for Future Use (03-99)
}

interface IQrisData {
    payloadFormatIndicator: string;            // Tag 00
    pointOfInitiationMethod: 'static' | 'dynamic'; // Tag 01 (11 or 12)
    merchantAccountInfoDomestic: MerchantAccountInformationID; // Tag 26-45
    merchantCategoryCode: string;              // Tag 52
    transactionCurrency: string;               // Tag 53
    transactionAmount: string;                 // Tag 54
    tipOrConvenienceIndicator: string;         // Tag 55
    convenienceFeeFixed?: string;              // Tag 56
    convenienceFeePercentage?: string;         // Tag 57
    countryCode: string;                       // Tag 58
    merchantName: string;                      // Tag 59
    merchantCity: string;                      // Tag 60
    postalCode?: string;                       // Tag 61
    additionalData?: IAdditionalData;           // Tag 62
    CRC: string;                               // Tag 63
    merchantInfoLanguage?: MerchantInformationLanguage; // Tag 64
    RFU?: any;                                 // Reserved for Future Use (65-79)
    unreserved?: any;                          // Unreserved Tags (80-99)
}

/**
 * Generic function to parse key-value pairs based on QRIS data tags.
 * @param data QRIS data string to be parsed.
 * @param tagMapping An object mapping tags to their respective parser functions.
 */
function parseTags<T>(data: string, tagMapping: Record<string, (result: T, value: string) => void>): T {
    const result = {} as T;

    while (data.length >= 4) {
        const tag = data.slice(0, 2);
        const length = parseInt(data.slice(2, 4), 10);
        const value = data.slice(4, 4 + length);
        data = data.slice(4 + length);

        console.log({
            tag, length, value
        })

        const parser = tagMapping[tag];
        if (parser) {
            parser(result, value);
        }
    }

    return result;
}

/**
 * Class for parsing and storing QRIS (Quick Response Code Indonesian Standard) data.
 */
export default class QRISParser {
    public data: IQrisData;

    constructor() {
        this.data = {} as IQrisData;
    }

    /**
     * Parses the entire QRIS data string.
     * @param data QRIS data string to be parsed.
     */
    parse(data: string): IQrisData {
        const tagMapping: Record<string, (result: IQrisData, value: string) => void> = {
            '00': (result, value) => result.payloadFormatIndicator = value,
            '01': (result, value) => result.pointOfInitiationMethod = value === '11' ? 'static' : 'dynamic',
            '52': (result, value) => result.merchantCategoryCode = value,
            '53': (result, value) => result.transactionCurrency = value,
            '54': (result, value) => result.transactionAmount = value,
            '55': (result, value) => result.tipOrConvenienceIndicator = value,
            '56': (result, value) => result.convenienceFeeFixed = value,
            '57': (result, value) => result.convenienceFeePercentage = value,
            '58': (result, value) => result.countryCode = value,
            '59': (result, value) => result.merchantName = value,
            '60': (result, value) => result.merchantCity = value,
            '61': (result, value) => result.postalCode = value,
            '62': (result, value) => result.additionalData = this.parseAdditionalData(value),
            '63': (result, value) => result.CRC = value,
            '64': (result, value) => result.merchantInfoLanguage = this.parseMerchantInformationLanguage(value),
            // For tags 26-45 (Merchant Account Info)
            ...this.createRangeParser('26', '45', (result, value) => result.merchantAccountInfoDomestic = this.parseMerchantAccountInformationID(value)),
            // Reserved for Future Use tags
            ...this.createRangeParser('65', '79', (result, value) => result.RFU = value),
            // Unreserved tags
            ...this.createRangeParser('80', '99', (result, value) => result.unreserved = value)
        };

        this.data = parseTags<IQrisData>(data, tagMapping);

        return this.data
    }

    /**
     * Parses Merchant Account Information (tags 26-45).
     * @param data Data string for merchant account information.
     */
    private parseMerchantAccountInformationID(data: string): MerchantAccountInformationID {
        const tagMapping: Record<string, (result: MerchantAccountInformationID, value: string) => void> = {
            '00': (result, value) => result.reverseDomain = value,
            '01': (result, value) => result.globalID = value,
            '02': (result, value) => result.id = value,
            '03': (result, value) => result.type = value,
        };

        return parseTags<MerchantAccountInformationID>(data, tagMapping);
    }

    /**
     * Parses Additional Data (tag 62).
     * @param data Data string for additional information.
     */
    private parseAdditionalData(data: string): IAdditionalData {
        const tagMapping: Record<string, (result: IAdditionalData, value: string) => void> = {
            '01': (result, value) => result.billNumber = value,
            '02': (result, value) => result.mobileNumber = value,
            '03': (result, value) => result.storeLabel = value,
            '04': (result, value) => result.loyaltyNumber = value,
            '05': (result, value) => result.referenceLabel = value,
            '06': (result, value) => result.customerLabel = value,
            '07': (result, value) => result.terminalLabel = value,
            '08': (result, value) => result.purposeOfTransaction = value,
            '09': (result, value) => result.additionalConsumerDataRequest = value,
            '10': (result, value) => result.merchantTaxID = value,
            '11': (result, value) => result.merchantChannel = value,
        };

        return parseTags<IAdditionalData>(data, tagMapping);
    }

    /**
     * Parses Merchant Information Language (tag 64).
     * @param data Data string for merchant language information.
     */
    private parseMerchantInformationLanguage(data: string): MerchantInformationLanguage {
        const tagMapping: Record<string, (result: MerchantInformationLanguage, value: string) => void> = {
            '00': (result, value) => result.languagePreference = value,
            '01': (result, value) => result.merchantNameAltLanguage = value,
            '02': (result, value) => result.merchantCityAltLanguage = value,
        };

        return parseTags<MerchantInformationLanguage>(data, tagMapping);
    }

    /**
     * Helper to create tag parsers for a given tag range.
     * @param min The start tag of the range.
     * @param max The end tag of the range.
     * @param parser Function to handle the parsing for tags in the range.
     */
    private createRangeParser<T>(min: string, max: string, parser: (result: T, value: string) => void): Record<string, (result: T, value: string) => void> {
        const tagMapping: Record<string, (result: T, value: string) => void> = {};

        for (let i = parseInt(min, 10); i <= parseInt(max, 10); i++) {
            const tag = i.toString().padStart(2, '0');
            tagMapping[tag] = parser;
        }

        return tagMapping;
    }
}
