import { Document, IndexedDocument, PostingList } from '../model/documents';


export class Indexer {

    private documents: Document[];
    public index: IndexedDocument;

    /**
     * TODO: Might add a semaphore to prevent access of index while indexing
     * @param documents documents to be indexed
    */

    constructor(documents: Document[]) {
        this.documents = documents;
        this.index = this.indexDocuments();
    }

    /**
     * 
     * @param documents documents to be indexed
     * @returns IndexDocuments
     * 
     * IndexDocuments is a map of words to PostingList
     * PostingList is a list of documents and the frequency of the word in the document
     * 
     */
    public reIndexDocuments(document: Document[]): IndexedDocument {
        this.documents = document;
        return this.indexDocuments();
    }

    private indexDocuments(): IndexedDocument {
        const indexedDocuments: IndexedDocument = new Map<string, PostingList>();
        for (const document of this.documents) {
            const words = document.content.split(' ');
            for (const word of words) {
                if (indexedDocuments.get(word) === undefined) {
                    const postingList: PostingList = {
                        documents: [document.name],
                        frequency: 1,
                    };
                    indexedDocuments.set(word, postingList);
                } else {
                    const postingList = indexedDocuments.get(word)!!;
                    postingList.frequency++;
                    postingList.documents.push(document.name);
                    indexedDocuments.set(word, postingList)
                }
            }
        }
        return this.sortMapByKey(indexedDocuments);
    }

    private sortMapByKey<V>(map: Map<string, V>): Map<string, V> {
        const sortedArray = Array.from(map.entries()).sort((a, b) => {
            return a[0].localeCompare(b[0]);
        });
        const sortedMap = new Map<string, V>(sortedArray);
        return sortedMap;
    }
}