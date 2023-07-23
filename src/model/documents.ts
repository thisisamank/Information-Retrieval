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

export type IdfData = Map<string, number>