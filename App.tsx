import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { getCharacters, fetchAndInsertCharacters, createTable } from './database';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { SelectList } from 'react-native-dropdown-select-list';

const CharacterListScreen: React.FC = () => {
  // Definición de estados del componente
  const [characters, setCharacters] = useState<any[]>([]); // Almacena la lista de personajes
  const [tableData, setTableData] = useState<string[][]>(); // Almacena los datos para la tabla
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null); // Almacena la especie seleccionada
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]); // Almacena las opciones de especies

  // Efecto que se ejecuta al cargar el componente
  useEffect(() => {
    createTable(); // Crea la tabla en la base de datos si no existe
    loadSpeciesOptions(); // Carga las opciones de especies
    loadCharacters(); // Carga la lista de personajes después de crear la tabla
  }, []);

  // Efecto que se ejecuta cuando cambia la especie seleccionada o la lista de personajes
  useEffect(() => {
    updateTableData(characters); // Actualiza los datos de la tabla
  }, [selectedSpecies, characters]);

  // Función para cargar la lista de personajes desde la base de datos
  const loadCharacters = async () => {
    const characterList = await getCharacters();
    setCharacters(characterList);
  };

  // Función para cargar las opciones de especies desde la lista de personajes
  const loadSpeciesOptions = async () => {
    const characterList = await getCharacters();
    const uniqueSpecies = [...new Set(characterList.map((character) => character.species))];
    setSpeciesOptions(uniqueSpecies);
  };

  // Función para actualizar los datos de la tabla en función de la especie seleccionada
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

  // Función que maneja el cambio de especie seleccionada
  const handleSpeciesChange = (value: string | null) => {
    setSelectedSpecies(value);
  };

  // Función que muestra una alerta con los detalles de un personaje al hacer clic en una fila de la tabla
  const handleRowPress = (character: any) => {
    Alert.alert(
      character.name,
      `ID: ${character.id}\nNombre: ${character.name}\nEspecie: ${character.species}`,
    );
  };

  // Renderiza la interfaz de usuario del componente
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
            {tableData?.map((rowData, index) => (
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
