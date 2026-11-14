// Plausible tagged events: the script (script.outbound-links.tagged-events.js) reads
// these class names, so an event needs no click handler and no client JS of ours.
// Same names as the blog: "Contact Intent" with location and target props.
const CONTACT = "plausible-event-name=Contact+Intent";

export function contactEvent(location: string, target: "email" | "linkedin" | "github"): string {
	return `${CONTACT} plausible-event-location=${location} plausible-event-target=${target}`;
}

// The first-screen proof link: the ten-second test needs a number for "did they look".
export const proofEvent = "plausible-event-name=Proof+Click plausible-event-location=home-hero";
