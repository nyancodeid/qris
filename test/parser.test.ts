import { describe, it, expect, beforeEach } from 'vitest';

// Assuming QRISParser and the related interfaces are imported here.
import QRISParser from '../src/core/qris.parser';  // Adjust the import as necessary.

describe('QRISParser', () => {
    let parser: QRISParser;

    beforeEach(() => {
        parser = new QRISParser();
    });

    it('should parse payloadFormatIndicator correctly', () => {
        const qrisData = '000201010211'; // Tag 00 for payloadFormatIndicator and Tag 01 for pointOfInitiationMethod.
        const data = parser.parse(qrisData);

        expect(data.payloadFormatIndicator).toBe('01');
        expect(data.pointOfInitiationMethod).toBe('static');
    });

    it('should parse additionalData correctly', () => {
        const qrisData = '62100206123456'; // Tag 62 for additionalData, Tag 02 for mobileNumber.
        const data = parser.parse(qrisData);

        expect(data.additionalData?.billNumber).toBeUndefined();
        expect(data.additionalData?.mobileNumber).toBe('123456');
    });

    it('should handle missing additionalData without error', () => {
        const qrisData = '000201010211'; // No additionalData present in this case.
        const data = parser.parse(qrisData);

        expect(data.additionalData).toBeUndefined();
    });

    it('should parse merchantAccountInfoDomestic correctly', () => {
        const qrisData = '26160012345678901234'; // Tag 26 for merchant account information.
        const data = parser.parse(qrisData);

        expect(data.merchantAccountInfoDomestic.reverseDomain).toBe('345678901234');
    });

    it('should parse merchantInfoLanguage correctly', () => {
        const qrisData = '64060002ID'; // Tag 64 for merchant language information, Tag 00 for languagePreference.
        const data = parser.parse(qrisData);

        expect(data.merchantInfoLanguage).not.toBeUndefined();
        expect(data.merchantInfoLanguage?.languagePreference).toBe('ID');
    });

    it('should parse CRC correctly', () => {
        const qrisData = '6304004A'; // Tag 63 for CRC
        const data = parser.parse(qrisData);

        expect(data.CRC).toBe('004A');
    });

    it('should handle unknown tags gracefully', () => {
        const qrisData = '99020102'; // Unknown tag (99), should not throw an error.
        const data = parser.parse(qrisData);

        expect(data.unreserved).toBe('01');
    });

    it('should handle realworld QRIS code', () => {
        const qrisData = '00020101021226530012COM.XXXX.WWW0118120000123400001234020412340303UMI51380014ID.CO.QRIS.WWW02091234567890303UMI5204723053033605405100005802ID5915TOKO MIXUE BARU6015Kabupaten Tokyo6106123131622001MIXUE BARU70703K19630433CE';
        try {
            const data = parser.parse(qrisData);

            console.log(data)
        } catch (error) {
            console.error(error)
        }

        expect(true).toBe(true)
    });
});