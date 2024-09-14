type Data = {
	version: string;
	date: string;
	changes: {
		added: string[];
		changed: string[];
		deprecated: string[];
		removed: string[];
		fixed: string[];
		security: string[];
	};
};