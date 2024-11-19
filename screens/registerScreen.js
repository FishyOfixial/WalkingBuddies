import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { database, ref, set, get } from './firebase'; // Importa las funciones de Firebase
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterScreen = ({ navigation }) => {
  const initialState = { 
    texto: "", 
    name: "Ivan", 
    email: "ivan@edu.uag.mx", 
    password: "aaa", 
    bachelor: "Ing. Software", 
    dateOfBirth: "", 
    preferences: "Pan",
    error: ""
  };

  const [state, setState] = useState(initialState);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const loginClick = async () => {
    setState(prevState => ({ ...prevState, error: "" }));
    const errorMessage = checkEntries();
    if (!errorMessage) {

      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      let emailExists = false;
      if (snapshot.exists()) {
        const users = snapshot.val();
        emailExists = Object.values(users).some(user => user.email === state.email);
      }

      if (emailExists) {
        setState(prevState => ({
          ...prevState,
          error: "El correo ya está registrado"
        }));
        return;
      }

      const age = calculateAge(state.dateOfBirth);
      if(age < 17){
        setState(prevState => ({...prevState, error: "Debes tener al menos 17 años para registrarte"}));
        return;
      }
      const userId = Date.now();
      await set(ref(database, 'users/' + userId), {
        name: state.name,
        email: state.email,
        password: state.password, // Asegúrate de cifrar la contraseña en un entorno real
        bachelor: state.bachelor,
        dateOfBirth: state.dateOfBirth.toString(),
        age: age,
        preferences: isVolunteer ? state.preferences : "",
        profileImage: profileImage || 'https://via.placeholder.com/100',
        rating: 0,
        isVolunteer: isVolunteer,
      })
      .then(() => {
        console.log('Usuario agregado correctamente');
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error('Error al agregar el usuario:', error);
      });
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setShowPicker(Platform.OS === 'ios');
      setDate(currentDate);
      setState(prevState => ({ ...prevState, dateOfBirth: currentDate }));
    } else {
      setShowPicker(false);
    }
  };

  const toggleVolunteer = () => {
    setIsVolunteer(!isVolunteer);
  };

  const checkEntries = () => {
    const regex = /^[a-zA-Z0-9.]+@edu\.uag\.mx$/;
    let errorMessage = "";
    if (!state.name || !state.email || !state.password || !state.bachelor || !state.dateOfBirth || (isVolunteer && !state.preferences)) {
      errorMessage += "Campos Incompletos\n";
    }

    if (!regex.test(state.email)) {
      errorMessage += "Correo Invalido\n";
    }

    if (errorMessage) {
      setState(prevState => ({
        ...prevState,
        texto: "Por favor, corrija los errores",
        error: errorMessage  
      }));
    }
        
    return errorMessage;
  };

  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });
  
    if (result.didCancel) {
      console.log('El usuario canceló la selección de imagen.');
    } else if (result.errorCode) {
      console.log('Error en la selección de imagen:', result.errorMessage);
    } else {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
    }
  };

  // Calcular la edad
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) {
      return "Fecha no válida";
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.innerContainer}>
            <Text style={styles.welcomeText}>{state.texto}</Text>

            {state.error ? <Text style={styles.errorText}>{state.error}</Text> : null}

            <TouchableOpacity onPress={selectImage} style={styles.profileImageContainer}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../assets/Fishy-Mando.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Button title="Cambiar Imagen" onPress={selectImage} />

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={state.name}
              onChangeText={(text) => setState(prevState => ({ ...prevState, name: text }))} 
            />
            <TextInput
              style={styles.input}
              placeholder="Correo Institucional"
              value={state.email}
              onChangeText={(text) => setState(prevState => ({ ...prevState, email: text }))} 
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={state.password}
              onChangeText={(text) => setState(prevState => ({ ...prevState, password: text }))} 
            />
            <TextInput
              style={styles.input}
              placeholder="Carrera"
              value={state.bachelor}
              onChangeText={(text) => setState(prevState => ({ ...prevState, bachelor: text }))} 
            />

            <TouchableOpacity onPress={showDatePicker} style={styles.input}>
              <Text style={styles.dateText}>
                {state.dateOfBirth ? new Date(state.dateOfBirth).toLocaleDateString() : "Fecha de Nacimiento"}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}

            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={[styles.checkbox, isVolunteer && styles.checked]} onPress={toggleVolunteer}>
                {isVolunteer && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.label}>Marca si desea ser voluntario</Text>
            </View>

            {isVolunteer && (
              <TextInput
                style={styles.input_volunteer}
                placeholder="¿Cuáles son tus gustos?"
                multiline={true}
                numberOfLines={3}
                textAlignVertical='top'
                value={state.preferences}
                onChangeText={(text) => setState(prevState => ({ ...prevState, preferences: text }))} 
              />
            )}

            <View style={styles.loginBtn}>
              <Button title="Registrar" onPress={loginClick} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  input_volunteer: {
    width: '80%',
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
  },
  profileImageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    padding: 10,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  loginBtn: {
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default RegisterScreen;