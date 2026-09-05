import { BANK1 } from "./bank1";
import { BANK2 } from "./bank2";
import { BANK3 } from "./bank3";
import type { BankQuestion } from "../lib/types";

export const BANK: BankQuestion[] = [...BANK1, ...BANK2, ...BANK3];
export const BANK_CATEGORIES = ["Accounting", "Valuation", "M&A", "LBO", "Capital Markets", "Industry", "Behavioral"];
