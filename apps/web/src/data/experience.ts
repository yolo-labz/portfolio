// Prose (role, company, period, deliverables) moved into the i18n "Experience"
// message namespace — consumed via `t.raw("entries")` in experience-timeline.
// The `current` boolean rides along in each message object (drives the timeline
// dot styling) and is returned verbatim by t.raw.
// Client/employer names are anonymized per the stealth canon — public surfaces
// carry capability + scale, never identifiable employer names.
// This interface stays the source-of-truth shape for the t.raw cast.
export interface ExperienceEntry {
	role: string;
	company: string;
	period: string;
	current: boolean;
	deliverables: string[];
}
