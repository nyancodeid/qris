
# QRIS Library (JS+TS)
QRIS Library (JS+TS) is a JavaScript and TypeScript library for parsing and handling QRIS (Quick Response Code Indonesian Standard) data. It helps developers extract meaningful information from QR codes compliant with the QRIS standard.

[![npm version](https://badgen.net/npm/v/my-ts-lib)](https://npm.im/my-ts-lib) [![npm downloads](https://badgen.net/npm/dm/my-ts-lib)](https://npm.im/my-ts-lib)

## Features

- Dynamic QR Code Parsing: Automatically parses QRIS data fields, including merchant account information, transaction details, and additional data.
- TypeScript Support: Fully typed with TypeScript for better development experience and type safety.
- Flexible Tag Mapping: Easily extendable to handle custom tags with a dynamic parsing mechanism.
Supports Merchant Information: Parses various merchant information fields such as language preferences and account details.
- Modular Design: Designed to be easily extendable and maintainable for future QRIS requirements.

## Installation
To use this library in your project, install it via package manager you prefer:

```bash
pnpm i @nyancodeid/qris
## bun
bun add @nyancodeid/qris
## yarn
yarn add @nyancodeid/qris
```

## Usage

Basic Parsing QRIS Code

```typescript
import { QRISParser } from '@nyancodeid/qris';

const qrCodeData = '00020101021126550012ID.CO.NSIQR.T000012530336802051215802151000303153640001011406REF12345653033605404000';
const parser = new QRISParser();
const [error, data] = parser.parse(qrCodeData);

console.log(data)
```

## License

MIT &copy; [nyancodeid](https://github.com/nyancodeid)
