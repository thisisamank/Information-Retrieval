import fs from 'fs';


interface Document {
    name: string;
    content: string;
}

interface PostingList {
    documents: string[];
    frequency: number;
}

type IndexedDocument = Map<string, PostingList>;

function readJsonFile(path: string): Document[] {
    try {
        const documents: Document[] = [];
        const fileData = fs.readFileSync(path, 'utf-8');
        const jsonData = JSON.parse(fileData);
        for (const key in jsonData) {
            if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
                const element = jsonData[key];
                const document: Document = {
                    name: key,
                    content: element.content,
                };
                documents.push(document);
            }
        }
        return documents;
    } catch (err) {
        console.error('Error reading JSON file:', err);
        throw err;
    }
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
function indexDocuments(documents: Document[]): IndexedDocument {
    const indexedDocuments: IndexedDocument = new Map<string, PostingList>();
    for (const document of documents) {
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
    return sortMapByKey(indexedDocuments);
}

/**
 * 
 * @param path path to write the json file
 * @param data IndexDocuments to be written
 */
function writeJsonFile(path: string, data: IndexedDocument): void {
    try {
        const jsonData = JSON.stringify(Array.from(data.entries()));
        fs.writeFileSync(path, jsonData);
    } catch (err) {
        console.error('Error writing JSON file:', err);
        throw err;
    }
}

function sortMapByKey<V>(map: Map<string, V>): Map<string, V> {
    const sortedArray = Array.from(map.entries()).sort((a, b) => {
        return a[0].localeCompare(b[0]);
    });
    const sortedMap = new Map<string, V>(sortedArray);
    return sortedMap;
}


const convertedDocuments = readJsonFile('./data/data.json');
const indexedDocuments = indexDocuments(convertedDocuments);
console.log(indexedDocuments);