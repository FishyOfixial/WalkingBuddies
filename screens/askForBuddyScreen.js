import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { database, ref, set, get, auth } from './firebase';
import { getAuth } from 'firebase/auth';
import { update } from 'firebase/database';



const WalkingBuddyScreen = () => {
    const initialState = { 
        description: "",
    };
    const [users, setUsers] = useState([]);
    const [state, setState] = useState(initialState);
    const [userData, setUserData] = useState(null);
    const [selectedBuddy, setSelectedBuddy] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [refreshing, setRefreshing] = useState(false);



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const auth = getAuth();
                const userId = auth.currentUser.uid;
                const usersRef = ref(database, 'users');
                const snapshot = await get(usersRef);
    
                if (snapshot.exists()) {
                    const filteredUser = Object.values(snapshot.val()).filter(user => user.isVolunteer === true && user.id !== userId && user.isInTrip === false);
                    setUsers(filteredUser);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setRefreshing(false); // Termina el refresco al completar la carga de usuarios
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
                    walkingId: selectedBuddy,  // Aquí pasamos el compañero seleccionado
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
            keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0} // Ajuste adicional en Android

        >
            <ScrollView contentContainerStyle={styles.scrollContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.innerContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Walking Buddy</Text>
                </View>

                <View style={styles.mapContainer}>
                    <Image
                    source={{ uri: 'https://via.placeholder.com/300x200' }}
                    style={styles.mapImage}
                    resizeMode="cover"
                    />
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

    // UserCard Component
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
    

    const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    innerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    header: {
        width: '120%',
        paddingVertical: 10,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
    },
    mapContainer: {
        width: '90%',
        height: 200,
        backgroundColor: '#d3d3d3',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    usersContainer: {
        width: '90%',
        marginBottom: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#FFF',
    },
    userInfo: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    userTextContainer: {
        flex: 1,
    },
    userText: {
        fontSize: 13,
        color: '#333',
        marginBottom: 4,
    },
    boldText: {
        fontWeight: 'bold',
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    ratingContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    descriptionContainer: {
        width: '90%',
        height: 130,
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#FFF',
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    descriptionText: {
        marginTop: Platform.OS === 'android' ? '-5%' : 0,
        fontSize: 16,
        color: '#333',
        height: '80%',
    },
    startButton: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 50 : 20, // Ajusta la distancia para no tapar el borde de la pantalla
        width: '60%',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#007BFF',
        alignSelf: 'center', // Centrado del botón
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 18,
    },
    noUsersText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
    refresh: {
        marginTop: '-8%',
        color: "#007BFF",
        left: 125,

    }
    });

    export default WalkingBuddyScreen;
