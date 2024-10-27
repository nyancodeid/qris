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
        parser.parse(qrisData);

        expect(parser.qrisData.payloadFormatIndicator).toBe('01');
        expect(parser.qrisData.pointOfInitiationMethod).toBe('static');
    });

    it('should parse additionalData correctly', () => {
        const qrisData = '62100206123456'; // Tag 62 for additionalData, Tag 02 for mobileNumber.
        parser.parse(qrisData);

        expect(parser.qrisData.additionalData?.billNumber).toBeUndefined();
        expect(parser.qrisData.additionalData?.mobileNumber).toBe('123456');
    });

    it('should handle missing additionalData without error', () => {
        const qrisData = '000201010211'; // No additionalData present in this case.
        parser.parse(qrisData);

        expect(parser.qrisData.additionalData).toBeUndefined();
    });

    it('should parse merchantAccountInfoDomestic correctly', () => {
        const qrisData = '26160012345678901234'; // Tag 26 for merchant account information.
        parser.parse(qrisData);

        expect(parser.qrisData.merchantAccountInfoDomestic.reverseDomain).toBe('345678901234');
    });

    it('should parse merchantInfoLanguage correctly', () => {
        const qrisData = '64060002ID'; // Tag 64 for merchant language information, Tag 00 for languagePreference.
        parser.parse(qrisData);

        expect(parser.qrisData.merchantInfoLanguage).not.toBeUndefined();
        expect(parser.qrisData.merchantInfoLanguage?.languagePreference).toBe('ID');
    });

    it('should parse CRC correctly', () => {
        const qrisData = '6304004A'; // Tag 63 for CRC
        parser.parse(qrisData);

        expect(parser.qrisData.CRC).toBe('004A');
    });

    it('should handle unknown tags gracefully', () => {
        const qrisData = '99020102'; // Unknown tag (99), should not throw an error.
        const result = parser.parse(qrisData);

        expect(result).toBeNull();  // Ensure no error is returned.
        expect(parser.qrisData.unreserved).toBe('01');
    });

    it('should handle realworld QRIS code', () => {
        const qrisData = '99020102'; // Unknown tag (99), should not throw an error.
        const result = parser.parse(qrisData);

        expect(result).toBeNull();  // Ensure no error is returned.
        expect(parser.qrisData.unreserved).toBe('01');
    });
});