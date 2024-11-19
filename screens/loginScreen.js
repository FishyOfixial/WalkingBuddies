import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const initialState = { texto: "Bienvenido", email: "ivan@edu.uag.mx", password: "prueba", errorText: "" };
  const [state, setState] = useState(initialState);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginClick = () => {
    setState(prevState => ({ ...prevState, errorText: "" }));
    const test_email = 'ivan@edu.uag.mx';
    const test_pass = 'prueba';
    if (state.email !== test_email || state.password !== test_pass) {
      setState(prevState => ({ ...prevState, errorText: "El correo o contraseña son incorrectos" }));
    } else {
      navigation.navigate("AskBuddy");
    }
  };

  const registerClick = () => {
    navigation.navigate("Register");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>{state.texto}</Text>
        {state.errorText ? <Text style={styles.errorText}>{state.errorText}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Correo Institucional"
          value={state.email}
          onChangeText={(text) => setState(prevState => ({ ...prevState, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPass}
            placeholder="Contraseña"
            secureTextEntry={!passwordVisible}
            value={state.password}
            onChangeText={(text) => setState(prevState => ({ ...prevState, password: text }))}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.toggleButton}>
            <Text style={styles.toggleText}>{passwordVisible ? "Ocultar" : "Mostrar"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={registerClick}>
          <Text style={styles.registerText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={loginClick}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333'
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff'
  },
  passwordContainer: {
    width: '80%',
    position: 'relative',
    marginVertical: 10,
  },
  inputPass: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center'
  },
  toggleText: {
    color: '#007BFF',
    fontSize: 14,
  },
  registerButton: {
    marginTop: 10,
  },
  registerText: {
    color: '#007BFF',
    fontSize: 16,
  },
  loginButton: {
    marginTop: 60,
    width: '60%',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFF',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#007BFF'
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  errorText: { color: 'red', fontSize: 14, marginBottom: 10 },
});

export default LoginScreen;
