import csvParser from 'csv-parser';
import fs from 'fs';
import { Indexer } from './indexer/indexer';
import { Document, IndexedDocument } from './model/documents';

const csvFilePath = './data/data.csv';

const data: Document[] = [];

function readCSV() {

    // Read the CSV file and parse it
    fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row: any) => {
            const movie: Document = {
                name: row['Title'],
                content: `
                ${parseInt(row['Release Year'])}
                ${row['Title']}
                ${row['Origin/Ethnicity']}
                ${row['Director']}
                ${row['Cast']}
                ${row['Genre']}
                ${row['Plot']}
                `,
                link: row['Wiki Page'],
            }
            data.push(movie);
        })
        .on('end', () => {
            const indexer = new Indexer(data);
            const stdin = process.openStdin();
            console.log('Enter a query:');
            stdin.addListener('data', (query: any) => {
                const documents = indexer.search(query.toString().trim());
                console.log(documents[0],);
                console.log(`idf value: ${documents[1]}`,)
                console.log('Enter a query:');
            });
        }
        );

}

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
                    content: `
                    ${element.releaseYear}
                    ${element.content}
                    ${element.title}
                    ${element.originEthnicity}
                    ${element.director}
                    ${element.cast}
                    ${element.genre}
                    ${element.plot}
                    `,
                    link: element.wikiPage,
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

// const convertedDocuments = readJsonFile('./data/data-movies.json');
// const indexer = new Indexer(convertedDocuments);
// console.log(indexer.index);

readCSV();