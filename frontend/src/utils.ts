import { validateStacksAddress } from "@stacks/transactions";
import { MICROSTX_FACTOR } from "./constants";

export const parseAmount = (value: string) => Number(value);

export const toMicroStx = (value: string) => Math.round(parseAmount(value) * MICROSTX_FACTOR);

export const fromMicroStx = (value: string) => parseAmount(value) / MICROSTX_FACTOR;

export const formatStx = (value: string) => {
    const parsed = parseAmount(value);
    if (!Number.isFinite(parsed)) return "0";
    return fromMicroStx(String(parsed)).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
    });
};

export const isPositiveAmount = (value: string) => {
    const amount = parseAmount(value);
    return Number.isFinite(amount) && amount > 0;
};

export const isValidMicroStx = (value: string) =>
    isPositiveAmount(value) && Number.isInteger(toMicroStx(value)) && toMicroStx(value) > 0;

export const parseContractInput = (value: string, fallbackAddress: string) => {
    const trimmed = value.trim();
    if (trimmed.includes(".")) {
        const [address, name] = trimmed.split(".");
        return {
            address,
            name,
            isValid: validateStacksAddress(address) && name.trim().length > 0,
        };
    }
    return {
        address: fallbackAddress,
        name: trimmed,
        isValid: validateStacksAddress(fallbackAddress) && trimmed.length > 0,
    };
};

export const normalizeError = (error: unknown) => {
    if (!error) return "Unknown error.";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message || "Unknown error.";
    return "Unknown error.";
};

// Response unwrappers
export const unwrapResponse = (json: any) => {
    if (!json) return null;
    if (json.type === "response") {
        return json.value?.type === "ok" ? json.value.value : null;
    }
    return json.value ?? json;
};

export const unwrapOptional = (json: any) => {
    if (!json) return null;
    if (json.type === "optional") return json.value ?? null;
    if (json.type === "some") return json.value ?? null;
    return json;
};

export const unwrapTuple = (json: any) => {
    if (!json) return null;
    if (json.type === "tuple") return json.value ?? null;
    return json.value ?? json;
};

export const readUint = (json: any) => {
    if (!json) return "0";
    if (typeof json === "string") return json;
    if (json.type === "uint" || json.type === "int") return json.value ?? "0";
    if (typeof json.value === "string") return json.value;
    return "0";
};
