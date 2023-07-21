import { Document, IndexedDocument, PostingList } from '../model/documents';


export class Indexer {

    private documents: Document[];

    /**
     * @param index is generated during construction of the object of this class
     * to refresh the index, use reIndexDocuments(...)
     * IndexedDocument is a map of words to PostingList
     * PostingList is a list of documents and the frequency of the word in the document 
     **/

    public index: IndexedDocument = new Map<string, PostingList>();

    /**
     * TODO: Might add a semaphore to prevent access of index while indexing
     * @param documents documents to be indexed
    */

    constructor(documents: Document[]) {
        this.documents = documents;
        this.index = this.indexAllDocuments();
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

    private sortMapByKey<V>(map: Map<string, V>): Map<string, V> {
        const sortedArray = Array.from(map.entries()).sort((a, b) => {
            return a[0].localeCompare(b[0]);
        });
        const sortedMap = new Map<string, V>(sortedArray);
        return sortedMap;
    }

    private tokenizer(document: Document): string[] {
        return document.content.toLowerCase().split(' ');
    }
}