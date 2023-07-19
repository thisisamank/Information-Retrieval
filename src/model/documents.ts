export interface Document {
    name: string;
    content: string;
}

export interface PostingList {
    documents: string[];
    frequency: number;
}

export type IndexedDocument = Map<string, PostingList>;