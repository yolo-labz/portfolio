"use client";

import type { GeoProperty } from "@/lib/types";
import dynamic from "next/dynamic";

function getMarkerColor(price: number): string {
	if (price < 400_000) return "#5ec4a0";
	if (price < 700_000) return "#e2b93d";
	return "#e25c5c";
}

function formatPrice(price: number): string {
	if (price >= 1_000_000) {
		return `$${(price / 1_000_000).toFixed(2)}M`;
	}
	return `$${Math.round(price / 1000)}k`;
}

function MapInner({ properties }: { properties: GeoProperty[] }) {
	const {
		MapContainer,
		TileLayer,
		CircleMarker,
		Popup,
	} = require("react-leaflet");

	return (
		<MapContainer
			center={[30.3, -97.74]}
			zoom={11}
			className="h-full w-full rounded-lg"
			style={{ minHeight: "400px" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://carto.com/">CARTO</a>'
				url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
			/>
			{properties.map((property) => (
				<CircleMarker
					key={property.id}
					center={[property.latitude, property.longitude]}
					radius={5}
					pathOptions={{
						color: getMarkerColor(property.price),
						fillColor: getMarkerColor(property.price),
						fillOpacity: 0.7,
						weight: 1,
					}}
				>
					<Popup>
						<div className="text-sm">
							<p className="font-semibold">{property.neighborhood}</p>
							<p className="text-accent font-mono">
								{formatPrice(property.price)}
							</p>
							<p className="text-text-muted">{property.bedrooms} bd</p>
						</div>
					</Popup>
				</CircleMarker>
			))}
		</MapContainer>
	);
}

export const PropertyMap = dynamic(
	() => Promise.resolve(MapInner),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center h-[400px] bg-bg-card rounded-lg border border-border text-text-muted text-sm">
				Loading map...
			</div>
		),
	},
);
