const WebCrypto = require("node-webcrypto-ossl");
const webcrypto = new WebCrypto();
window.webcrypto = webcrypto;
window.crypto = webcrypto;

const util = require("util");
window.TextDecoder = util.TextDecoder;
window.TextEncoder = util.TextEncoder;

import { GlobalWithFetchMock } from "jest-fetch-mock";

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require("jest-fetch-mock");
customGlobal.fetchMock = customGlobal.fetch;
