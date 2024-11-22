import React, { useState, useEffect } from 'react';
import { Animated, View, Text, TextInput, Image, ScrollView,ActivityIndicator , TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { database, ref, set, get, auth } from './firebase';
import { getAuth } from 'firebase/auth';
import { update } from 'firebase/database';
import styles from '../src/styles/askBuddyStyles';
import SlideInMenu from './slideInMenuScreen';
import { Picker } from '@react-native-picker/picker';

const AskForBuddyScreen = () => {
    const initialState = { 
        description: "",
    };
    const [users, setUsers] = useState([]);
    const [state, setState] = useState(initialState);
    const [userData, setUserData] = useState(null);
    const [selectedBuddy, setSelectedBuddy] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState('Edificio A');  // Estado para el destino

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const auth = getAuth();
                const userId = auth.currentUser.uid;
                const usersRef = ref(database, 'users');
                const snapshot = await get(usersRef);
    
                if (snapshot.exists()) {
                    const filteredUser = Object.values(snapshot.val()).filter(user => user.isVolunteer === true && user.id !== userId && user.isInTrip === false && user.isVerified === true);
                    setUsers(filteredUser);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setRefreshing(false);
            }
        };
    
        fetchUsers();
    }, [refresh]);
    

    const fetchUserData = async () => {
        try{
            const userId = auth.currentUser.uid;
            const userRef = ref(database, `users/${userId}`);
            const snapshot = await get(userRef);

            if(snapshot.exists()){
                setUserData(snapshot.val());
            }else{
                console.log("No se encuentra el usuario");
            }
        }catch (error){
            console.log('Error al obtener los datos del usuario: ', error)
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const beginTrip = async () => {
        try {
            const userId = getAuth().currentUser.uid;
            const userRef = ref(database, `users/${userId}`);
            const snapshot = await get(userRef);
    
            if (snapshot.exists()) {
                const user = snapshot.val();

                console.log(selectedBuddy);
                // Verificar si el usuario ya está en un viaje
                if (user.isInTrip) {
                    alert("Ya tienes un viaje en curso. No puedes iniciar otro viaje hasta que termines el actual.");
                    return; // No permitir que inicie un nuevo viaje
                }
    
                // Si no está en un viaje, permitir iniciar el viaje
                if (!selectedBuddy) {
                    alert("Por favor, selecciona un compañero de caminata.");
                    return;
                }
    
                alert("Viaje iniciado");
    
                // Crear un ID único para el viaje
                const tripId = `id_${Date.now()}`;
                
                // Guardar el viaje en la base de datos
                await set(ref(database, 'trips/' + tripId), {
                    tripId: tripId,
                    description: state.description,
                    userId: userId,
                    walkingId: selectedBuddy,
                    tripDestination: selectedDestination,
                });
    
                // Actualizar el estado del usuario para indicar que está en un viaje
                await update(ref(database, 'users/' + userId), {
                    isInTrip: true, // Cambiar el estado de isInTrip a true
                });
                await update(ref(database, 'users/' + selectedBuddy),{
                    isInTrip: true,
                });
            } else {
                console.log("El usuario no existe");
            }
        } catch (error) {
            console.log("Error al iniciar el viaje: ", error);
        }
    };
    
    const handleRefresh = () => {
        setRefreshing(true); // Indica que está refrescando
        setRefresh(prev => !prev); // Cambia el estado de `refresh` para forzar la actualización
    };

    
    return (
        <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}

        >
            <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <SlideInMenu/>
                        <Text style={styles.headerText}>Walking Buddy</Text>
                    </View>

                <View style={styles.mapContainer}>
                    <DropdownBox selectedValue={selectedDestination} setSelectedValue={setSelectedDestination}/>
                </View>

                <View style={styles.usersContainer}>
                    {users.length === 0 ? (
                    <Text style={styles.noUsersText}>No users available</Text>
                    ) : (
                    users.map((user, index) => (
                        <UserCard
                        key={index}
                        name={user.name}
                        age={user.age}
                        career={user.bachelor}
                        hobbies={user.preferences}
                        rating={user.rating}
                        imageUri={user.imageUri}
                        userId={user.id}
                        onSelect={setSelectedBuddy}
                        />
                    ))
                    )}
                </View>


                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Descripción de la Caminata</Text>
                    <TextInput 
                    style={styles.descriptionText}
                    placeholder='Escribe aquí'
                    multiline={true}
                    numberOfLines={4}
                    value={state.description}
                    onChangeText={(text) => setState(prevState => ({...prevState, description: text}))}
                    />
                </View>
                </View>
            </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>

        {/* Botón de iniciar viaje fuera del ScrollView para que permanezca fijo */}
        <TouchableOpacity style={styles.startButton} onPress={beginTrip}>
            <Text style={styles.startButtonText}>Iniciar Viaje</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
};

const UserCard = ({ name, age, career, hobbies, rating, imageUri, userId, onSelect }) => {
    return (
        <TouchableOpacity style={styles.userCard} onPress={() => onSelect(userId)}>
            <Image source={{ uri: imageUri }} style={styles.userImage} />
            <View style={styles.userInfo}>
                <View style={styles.userTextContainer}>
                    <Text style={styles.userText}><Text style={styles.boldText}>Nombre:</Text> {name}</Text>
                    <Text style={styles.userText}><Text style={styles.boldText}>Edad:</Text> {age}</Text>
                    <Text style={styles.userText}><Text style={styles.boldText}>Carrera:</Text> {career}</Text>
                    <Text style={styles.userText}>
                        <Text style={styles.boldText}>Gustos:</Text> {hobbies.split('\n').join(', ')}
                    </Text>
                </View>
                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, index) => (
                        <FontAwesome
                            key={index}
                            name="star"
                            size={15}
                            color={index >= 5 - rating ? "#FFD700" : "#ccc"}
                        />
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const DropdownBox = ({selectedValue, setSelectedValue}) => {

    // Lista de opciones
    const options = [
        { label: 'Cafetería', value: 'Cafeteria' },
        { label: 'Biblioteca', value: 'Biblioteca' },
        { label: 'Edificio A', value: 'Edificio A' },
        { label: 'Edificio B', value: 'Edificio B' },
        { label: 'Edificio C', value: 'Edificio C' },
        { label: 'Edificio D', value: 'Edificio D' },
        { label: 'Edificio E', value: 'Edificio E' },
        { label: 'Edificio F', value: 'Edificio F' },
        { label: 'Edificio G', value: 'Edificio G' },
        { label: 'Edificio H', value: 'Edificio H' },
        { label: 'Edificio I', value: 'Edificio I' },
        { label: 'Edificio J', value: 'Edificio J' },
        { label: 'Canchas', value: 'Canchas' },
        { label: 'Gimnasio', value: 'Gimnasio' },
        { label: 'Estadio 3 de Marzo', value: 'Estadio 3 de Marzo' },
        { label: 'Estacionamientos', value: 'Estacionamientos' },
        { label: 'Aula Magna', value: 'Aula Magna' },
        { label: 'Gonvill', value: 'Gonvill' },
        { label: 'UAG STORE', value: 'UAG STORE' },
        { label: 'Arte y Cultura', value: 'Arte y Cultura' }
    ];

    return (
        <View style={styles.containerDrop}>
            <Text style={styles.labelDrop}>Selecciona un destino:</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={itemValue => setSelectedValue(itemValue)}
                style={styles.pickerDrop}
            >
                {options.map((option) => (
                    <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                    />
                ))}
            </Picker>
        </View>
    );
};

    export default AskForBuddyScreen;
