import SQLite from 'react-native-sqlite-storage';
import axios from 'axios';

// Abre la base de datos SQLite
const db = SQLite.openDatabase({ name: 'rickAndMortyDB.db', location: 'default' });

// Crea una tabla en la base de datos para almacenar personajes
export const createTable = async () => {
  (await db).transaction((tx: { executeSql: (arg0: string) => void; }) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Characters (id INTEGER PRIMARY KEY, name TEXT, species TEXT);'
    );
  });
};

// Inserta un personaje en la base de datos si no existe ya
export const insertCharacter = async (character: { id: number; name: string; species: string }) => {
  // Verifica si el personaje ya existe en la base de datos
  const exists = await characterExists(character.id);
  if (!exists) {
    (await db).transaction((tx: { executeSql: (arg0: string, arg1: any[], arg2: (tx: any, results: any) => void, arg3: (error: any) => void) => void; }) => {
      tx.executeSql(
        'INSERT INTO Characters (id, name, species) VALUES (?, ?, ?)',
        [character.id, character.name, character.species],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Personaje insertado con éxito');
          } else {
            console.warn('Error al insertar personaje');
          }
        },
        (error) => {
          console.error('Error SQL', error);
        }
      );
    });
  } else {
    console.log(`Personaje con ID ${character.id} ya existe en la base de datos.`);
  }
};

// Verifica si un personaje ya existe en la base de datos
export const characterExists = async (characterId: number) => {
  return new Promise<boolean>(async (resolve, reject) => {
    (await db).transaction((tx: { executeSql: (arg0: string, arg1: number[], arg2: (tx: any, results: any) => void) => void; }) => {
      tx.executeSql('SELECT id FROM Characters WHERE id = ?', [characterId], (tx, results) => {
        if (results.rows.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  });
};

// Obtiene datos de la API y los inserta en la base de datos
export const fetchAndInsertCharacters = async () => {
  try {
    const response = await axios.get('https://rickandmortyapi.com/api/character');
    const characters = response.data.results;

    for (const character of characters) {
      await insertCharacter({
        id: character.id,
        name: character.name,
        species: character.species,
      });
    }

    console.log('Personajes de Rick and Morty insertados con éxito.');
  } catch (error) {
    console.error('Error al obtener los personajes de la API:', error);
  }
};

// Obtiene todos los personajes almacenados en la base de datos
export const getCharacters = async () => {
  return new Promise<any[]>(async (resolve, reject) => {
    (await db).transaction((tx: { executeSql: (arg0: string, arg1: never[], arg2: (tx: any, results: any) => void) => void; }) => {
      tx.executeSql('SELECT * FROM Characters', [], (tx, results) => {
        const len = results.rows.length;
        const characters = [];
        for (let i = 0; i < len; i++) {
          const character = results.rows.item(i);
          characters.push(character);
        }
        resolve(characters);
      });
    });
  });
};
