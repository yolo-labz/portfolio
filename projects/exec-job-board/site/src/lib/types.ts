export interface JobListing {
	id: string;
	title: string;
	company: string;
	location: string;
	url: string;
	posted_at: string | null;
	salary_min: number | null;
	salary_max: number | null;
	salary_currency: string;
	seniority: string;
	description: string | null;
	source: string;
	tags: string[];
	collected_at: string;
}

export interface JobsData {
	meta: {
		last_updated: string;
		total_jobs: number;
		sources: Record<string, number>;
	};
	jobs: JobListing[];
}
