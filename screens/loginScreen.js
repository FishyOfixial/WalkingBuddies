import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { database } from './firebase';
import styles from '../src/styles/loginStyles';

const LoginScreen = ({ navigation }) => {
  const initialState = { texto: "Bienvenido", email: "", password: "", errorText: "" };
  const [state, setState] = useState(initialState);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loginClick = () => {
    setState(prevState => ({ ...prevState, errorText: "" }));
    
    const auth = getAuth();
    signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        const user = userCredential.user;

        if(user.emailVerified){
          update(ref(database, 'users/' + user.uid), {
            isVerified: true
          })
          .then(() => {
            navigation.navigate("AskBuddy");
          })
          .catch((error) => {
            console.error("Error al actualizar isVerified: ", error);
          });
        }
        else{
          alert("Por favor verifica tu correo eléctronico antes de inciar sesión.");
          signOut(auth);
        }
      })
      .catch((error) => {
        // Error durante la autenticación
        if (error.code === 'auth/user-not-found') {
          setState(prevState => ({ ...prevState, errorText: "El usuario no existe" }));
        } else if (error.code === 'auth/wrong-password') {
          setState(prevState => ({ ...prevState, errorText: "Contraseña incorrecta" }));
        } else if (error.code === 'auth/invalid-credential') {
          setState(prevState => ({ ...prevState, errorText: "Credenciales inválidas. Verifica tu correo y contraseña." }));
        } else {
          setState(prevState => ({ ...prevState, errorText: "Ocurrió un error, intenta nuevamente" }));
        }
      });
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

export default LoginScreen;