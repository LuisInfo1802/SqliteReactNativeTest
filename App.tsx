import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { getCharacters, fetchAndInsertCharacters, createTable } from './database';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { SelectList } from 'react-native-dropdown-select-list';

const CharacterListScreen: React.FC = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);

  useEffect(() => {
    createTable();
    loadSpeciesOptions();
    loadCharacters(); // Ahora cargamos los datos después de crear la tabla
  }, []);

  useEffect(() => {
    updateTableData(characters);
  }, [selectedSpecies, characters]);

  const loadCharacters = async () => {
    const characterList = await getCharacters();
    setCharacters(characterList);
  };

  const loadSpeciesOptions = async () => {
    const characterList = await getCharacters();
    const uniqueSpecies = [...new Set(characterList.map((character) => character.species))];
    setSpeciesOptions(uniqueSpecies);
  };

  const updateTableData = (data: any[]) => {
    const filteredData = selectedSpecies
      ? data.filter((character) => character.species === selectedSpecies)
      : data;

    const tableData: string[][] = filteredData.map((character) => [
      character.id.toString(),
      character.name,
      character.species,
    ]);

    setTableData(tableData);
  };

  const handleSpeciesChange = (value: string | null) => {
    setSelectedSpecies(value);
  };

  const handleRowPress = (character: any) => {
    Alert.alert(
      character.name,
      `ID: ${character.id}\nNombre: ${character.name}\nEspecie: ${character.species}`,
    );
  };

  return (
    <View>
      <Text>Listado de Personajes:</Text>
      <SelectList
        setSelected={handleSpeciesChange}
        data={speciesOptions}
        placeholder="Selecciona una especie"
      />

      <Table>
        <Row
          data={['ID', 'Nombre', 'Especie']}
          style={{ height: 40, backgroundColor: 'blue' }}
          textStyle={{ margin: 6, fontWeight: 'bold', color: 'white' }}
        />
        <TableWrapper style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            {tableData.map((rowData, index) => (
              <TouchableOpacity key={index} onPress={() => handleRowPress(characters[index])}>
                <Row data={rowData} style={{ height: 40 }} textStyle={{ margin: 6 }} />
              </TouchableOpacity>
            ))}
          </View>
        </TableWrapper>
      </Table>
    </View>
  );
};

export default CharacterListScreen;
