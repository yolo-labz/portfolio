import { letterMark } from "@/lib/icon";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
	return letterMark({ size: 192, fontSize: 108, radius: 38 });
}
