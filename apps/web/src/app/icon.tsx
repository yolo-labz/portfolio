import { letterMark } from "@/lib/icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
	return letterMark({ size: 32, fontSize: 20, radius: 4, flat: true });
}
