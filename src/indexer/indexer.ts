import { WordTokenizer } from 'natural';
import { eng, removeStopwords } from 'stopword';

import { Document, IdfData, IndexedDocument, PostingList } from '../model/documents';

export class Indexer {

    private documents: Document[];

    /**
     * @param index is generated during construction of the object of this class
     * to refresh the index, use reIndexDocuments(...)
     * IndexedDocument is a map of words to PostingList
     * PostingList is a list of documents and the frequency of the word in the document 
     **/

    public index: IndexedDocument = new Map<string, PostingList>();

    public idf: IdfData = new Map<string, number>();

    /**
     * @param documents documents to be indexed
    */
    constructor(documents: Document[]) {
        this.documents = documents;
        this.index = this.indexAllDocuments();
        this.intializeIdfData();
    }

    private intializeIdfData(): void {
        for (const document of this.index) {
            this.idf.set(document[0], this.generateIdf(document[1].frequency))
        }
    }


    private generateIdf(termFrequency: number): number {
        const totalDocuments = this.documents.length;
        return Math.log10(totalDocuments / termFrequency + 1);
    }
    private indexAllDocuments(): IndexedDocument {
        for (const document of this.documents) {
            this.indexDocument(document, false);
        }
        return this.sortMapByKey(this.index);
    }

    /**
      * 
      * @param documents documents to be indexed
      * @param toSort whether to sort the index after indexing the documents
      * @returns IndexDocuments
      * 
      * IndexDocuments is a map of words to PostingList
      * PostingList is a list of documents and the frequency of the word in the document
      * 
    **/
    public indexDocument(document: Document, toSort: boolean = true): IndexedDocument {
        const words = this.tokenizer(document);
        for (const word of words) {
            if (this.index.get(word) === undefined) {
                const postingList: PostingList = {
                    documents: [document.name],
                    frequency: 1,
                };
                this.index.set(word, postingList);
            } else {
                const postingList = this.index.get(word)!!;
                postingList.frequency++;
                postingList.documents.push(document.name);
                this.index.set(word, postingList)
            }
        }
        if (toSort) this.index = this.sortMapByKey(this.index);
        return this.index;
    }

    /**
     * @param query query to be searched
     * @returns documents that contain the query
    **/
    public search(query: string): [string[], number] {
        const words = this.tokenizer({ content: query, name: '', link: '' });
        const documents: string[] = [];
        for (const word of words) {
            const postingList = this.index.get(word);
            if (postingList !== undefined) {
                for (const document of postingList.documents) {
                    if (!documents.includes(document)) {
                        documents.push(document);
                    }
                }
            }
        }
        const idfFortheQuery = this.idf.get(words[0])!!;
        return [documents, idfFortheQuery];
    }

    private sortMapByKey<V>(map: Map<string, V>): Map<string, V> {
        const sortedArray = Array.from(map.entries()).sort((a, b) => {
            return a[0].localeCompare(b[0]);
        });
        const sortedMap = new Map<string, V>(sortedArray);
        return sortedMap;
    }

    private tokenizer(document: Document): string[] {
        const tokenizer = new WordTokenizer();
        const words = tokenizer.tokenize(document.content.toLowerCase());
        if (words === undefined)
            return []
        return removeStopwords(words!!, eng)
    }
}