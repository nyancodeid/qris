export function convertCRC16(str: string): string {
    let crc = 0xffff;
    const strlen = str.length;

    for (let c = 0; c < strlen; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }

    let hex = (crc & 0xffff).toString(16).toUpperCase();
    return hex.length === 3 ? "0" + hex : hex;
}
