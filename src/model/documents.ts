export interface Document {
    name: string;
    content: string;
    link: string;
}

export interface PostingList {
    documents: string[];
    frequency: number;
}

export type IndexedDocument = Map<string, PostingList>;

// Release Year,Title,Origin/Ethnicity,Director,Cast,Genre,Wiki Page,Plot

export interface Movie {
    releaseYear: number;
    title: string;
    originEthnicity: string;
    director: string;
    cast: string;
    genre: string;
    wikiPage: string;
    plot: string;
}