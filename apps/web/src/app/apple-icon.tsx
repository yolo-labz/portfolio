import { letterMark } from "@/lib/icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
	return letterMark({ size: 180, fontSize: 100, radius: 36 });
}
