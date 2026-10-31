import { letterMark } from "@/lib/icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
	return letterMark({ size: 512, fontSize: 288, radius: 102 });
}
