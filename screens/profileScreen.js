import styles from '../src/styles/profileStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { database, ref, set, get, auth } from './firebase';
import { getAuth } from 'firebase/auth';
import { update } from 'firebase/database';
import { RefreshControl, SafeAreaView, View, Text, Button, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import SlideInMenu from './slideInMenuScreen';
import ChangePasswordScreen from './changePasswordScreen';

const ProfileScreen = ({ navigation }) => {
    const initialState = {
        name: "",
        email: "",
        password: "",
        bachelor: "",
        dateOfBirth: "",
        preferences: "",
        isVolunteer: false,
        error: "",
        texto: "",
    };

    const [state, setState] = useState(initialState);
    const [isEditable, setEditable] = useState(false);
    const [newPassword, setNewPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try{
                const userId = auth.currentUser.uid;
                const userRef = ref(database, `users/${userId}`);
                const snapshot = await get(userRef);

                if(snapshot.exists()){
                    const userData = snapshot.val();
                    setState({
                        name: userData.name || '',
                        email: userData.email || '',
                        bachelor: userData.bachelor || '',
                        dateOfBirth: formatDate(userData.dateOfBirth) || '',
                        preferences: userData.preferences || '',
                        isVolunteer: userData.isVolunteer,
                    });
                } else {
                    console.log('No se encontraron datos para este usuario.');
                }
            }catch(error){
                console.error('Error al obtener los datos del usuario: ', error);
            }
        };

        fetchUserData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const checkEntries = () => {
        let errorMessage = "";
        if(!state.name || !state.bachelor)
            errorMessage += "Campos Incompletos\n";
        if(errorMessage){
            setState(prevState => ({
                ...prevState, texto: "Por favor, corrija los errores",
                error: errorMessage
            }));
        }
    }

    const updateUser = async () => {
        if(!isEditable)
            setEditable(true);
        else{
            setState(prevState => ({ ...prevState, error: "", texto: ""}));
            setEditable(false);
            const errorMessage = checkEntries();
            if(!errorMessage){
                try{
                    const userId = getAuth().currentUser.uid;
                    const userRef = ref(database, `users/${userId}`);
                    const snapshot = await get(userRef);

                    if(snapshot.exists()){
                        const user = snapshot.val();
                        await update(ref(database, 'users/' + userId), {
                            name: state.name,
                            bachelor: state.bachelor,
                            isVolunteer: state.isVolunteer,
                            preferences: state.preferences,
                        });
                    }
                    alert("Cambios realizados");

                }catch(error){
                    console.error("Codigo de error: ", error.code);
                    console.error("Mensaje de error: ", error.message);
                    setState(prevState => ({
                        ...prevState,
                        error: "Hubo un error al registrar el usuario."
                    }));
                    console.error('Error al registrar el usuario:', error);
                }
            }
        }
        
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}
            >
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            
            <View style={styles.innerContainer}>
                <View style={styles.header}>
                    <SlideInMenu/>
                    <Text style={styles.headerText}>Perfil</Text>
                </View>

                <Text style={styles.welcomeText}>{state.texto}</Text>
                {state.error ? <Text style={styles.errorText}>{state.error}</Text> : null}

                <TextInput
                    style={[styles.input]}
                    placeholder='Nombre'
                    value={state.name}
                    editable={isEditable} 
                    onChangeText={(text) => setState(prevState => ({...prevState, name: text}))}
                />
                <TextInput
                    style={styles.inputNoEditable}
                    placeholder='Correo Institucional'
                    value={state.email}
                    editable={false} 
                />
                <TextInput
                    style={styles.input}
                    placeholder='Carrera'
                    value={state.bachelor}
                    editable={isEditable} 
                    onChangeText={(text) => setState(prevState => ({...prevState, bachelor: text}))}
                />
                <TextInput
                    style={styles.inputNoEditable}
                    placeholder='Fecha de Nacimiento'
                    value={state.dateOfBirth}
                    editable={false} 
                />

                <View style={[styles.checkboxContainer, {color: isEditable ? "#fff" : "#888"}]}>
                    <TouchableOpacity style={[styles.checkbox, state.isVolunteer && styles.checked, !isEditable && {opacity: 0.5}]} onPress={() => {
                            setState(prevState => ({...prevState, isVolunteer: !prevState.isVolunteer}));
                        }}
                        disabled={!isEditable}>
                        
                        {state.isVolunteer && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={styles.label}>Soy voluntario</Text>
                </View>

                {state.isVolunteer && (
                    <TextInput
                        style={styles.input_volunteer}
                        placeholder="¿Cuáles son tus gustos?"
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical='top'
                        value={state.preferences}
                        editable={isEditable}
                        onChangeText={(text) => setState(prevState => ({ ...prevState, preferences: text }))} 
                    />
                )}
                {newPassword && (
                    <ChangePasswordScreen/>
                )}
                <View style={styles.loginBtn}>
                    <Button disabled={isEditable} title={newPassword ? "Cancelar" : "Cambiar contraseña"}  onPress={() => setNewPassword(!newPassword)}/>
                    <Button disabled={newPassword} title={isEditable ? "Guardar" : "Editar"} onPress={() => updateUser()} />
                </View>
            </View>

            </TouchableWithoutFeedback>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

export default ProfileScreen;