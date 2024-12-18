import React, { useState, useEffect } from 'react';
import { Button, Animated, View, Text, TextInput, Image, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { database, ref, set, get, auth } from './firebase';
import { getAuth } from 'firebase/auth';
import { onValue, update } from 'firebase/database';
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
    const [selectedDestination, setSelectedDestination] = useState('Edificio A');
    const [isInTrip, setIsInTrip] = useState(false);
    const [tripDetails, setTripDetails] = useState(null);
    const [rating, setRating] = useState(0);
    const [buddyName, setBuddyName] = useState("");
    const [requesterName, setRequesterName] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const auth = getAuth();
                const userId = auth.currentUser.uid;
                const usersRef = ref(database, 'users');
                const snapshot = await get(usersRef);
    
                if (snapshot.exists()) {
                    const filteredUser = Object.values(snapshot.val()).filter(user => user.isVolunteer === true && user.id !== userId && user.status?.isInTrip === false && user.isVerified === true);
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

    const getBuddyName = async (buddyId) => {
        try {
            const buddyRef = ref(database, `users/${buddyId}`);
            const buddySnapshot = await get(buddyRef);

            if (buddySnapshot.exists()) {
                const buddyData = buddySnapshot.val();
                setBuddyName(buddyData.name);
            }
        } catch (error) {
            console.error("Error al obtener el nombre del compañero:", error);
        }
    };

    useEffect(() => {
        const fetchRequesterName = async () => {
            if (tripDetails?.userId) {
                const userRef = ref(database, `users/${tripDetails.userId}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setRequesterName(snapshot.val().name);
                }
            }
        };
    
        fetchRequesterName();
    }, [tripDetails]);

    useEffect(() => {
        if (tripDetails && tripDetails.walkingId) {
            getBuddyName(tripDetails.walkingId);
        }
    }, [tripDetails]);

    const beginTrip = async () => {
        try {
            const userId = getAuth().currentUser.uid;
            const userRef = ref(database, `users/${userId}`);
            const snapshot = await get(userRef);
    
            if (snapshot.exists()) {
                const user = snapshot.val();

                if (user.isInTrip) {
                    alert("Ya tienes un viaje en curso. No puedes iniciar otro viaje hasta que termines el actual.");
                    return;
                }
    
                if (!selectedBuddy) {
                    alert("Por favor, selecciona un compañero de caminata.");
                    return;
                }
    
                alert("Viaje iniciado");
    
                const tripId = `id_${Date.now()}`;
                
                await set(ref(database, 'trips/' + tripId), {
                    tripId: tripId,
                    description: state.description,
                    userId: userId,
                    walkingId: selectedBuddy,
                    tripDestination: selectedDestination,
                    date: Date.now().toString(),
                });
    
                await update(ref(database, `users/${userId}/status`), {
                    isInTrip: true,
                    tripId: tripId,
                });
                await update(ref(database, `users/${selectedBuddy}/status`),{
                    isInTrip: true,
                    tripId: tripId,
                });
            } else {
                console.log("El usuario no existe");
            }
        } catch (error) {
            console.log("Error al iniciar el viaje: ", error);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setRefresh(prev => !prev);
    };

    const handleRateBuddy = async (ratingValue) => {
        try {
            const buddyId = tripDetails?.walkingId;
            const buddyRef = ref(database, `users/${buddyId}`);
            const buddySnapshot = await get(buddyRef);

            if (buddySnapshot.exists()) {
                const buddyData = buddySnapshot.val();
                const currentRating = buddyData.rating || 0;
                const reviews = buddyData.reviews || 0;

                const newReviews = reviews + 1;
                const newRating = ((currentRating * reviews) + ratingValue) / newReviews;

                await update(buddyRef, {
                    rating: newRating,
                    reviews: newReviews,
                });

                alert('Calificación enviada', '¡Gracias por calificar a tu compañero!');
            }
        } catch (error) {
            console.error("Error al calificar al acompañante:", error);
            alert('Error', 'No se pudo enviar tu calificación. Inténtalo de nuevo.');
        }
    };

    const endTrip = async () => {
        try {
            handleRateBuddy(rating);
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            await update(ref(database, `users/${userId}/status`), {
                isInTrip: false,
                tripId: null,
            });

            if (tripDetails?.walkingId) {
                await update(ref(database, `users/${tripDetails.walkingId}/status`), {
                    isInTrip: false,
                    tripId: null,
                });
            }
            alert("Viaje finalizado.");
            setIsInTrip(false);
            setTripDetails(null);
        } catch (error) {
            console.log("Error al finalizar el viaje: ", error);
        }
    };

    const isRequester = tripDetails?.userId === auth.currentUser?.uid;

    useEffect(() => {
        const userId = auth.currentUser?.uid;

        if (userId) {
            const statusRef = ref(database, `users/${userId}/status`);

            const unsubscribe = onValue(statusRef, (snapshot) => {
                const status = snapshot.val();
                if (status?.isInTrip) {
                    setIsInTrip(true);
                    fetchTripDetails(status.tripId);
                } else {
                    setIsInTrip(false);
                    setTripDetails(null);
                }
            });

            return () => unsubscribe();
        }
    }, []);

    const fetchTripDetails = async (tripId) => {
        const tripRef = ref(database, `trips/${tripId}`);
        const tripSnapshot = await get(tripRef);
        if (tripSnapshot.exists()) {
            setTripDetails(tripSnapshot.val());
        }
    };

    if (isInTrip) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.container}>
                <View style={styles.scrollContainer}>
                    <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <SlideInMenu/>
                        <Text style={styles.headerText}>Estas en un viaje</Text>
                    </View>
                    {tripDetails && (
                        <View style={styles.tripDetailsContainer}>
                            <Text style={[styles.tripDetailText, styles.boldText]}>Solicitante: {requesterName || "Cargando..."}</Text>
                            <Text style={[styles.tripDetailText, styles.boldText]}>Compañero: {buddyName || "Cargando..."}</Text>
                            <Text style={[styles.tripDetailText, styles.boldText]}>Destino: {tripDetails.tripDestination}</Text>
                            <Text style={[styles.tripDetailText, styles.boldText]}>Descripción: {tripDetails.description}</Text>
                        </View>
                    )}

                    <View style={styles.ratingContainerEndTrip}>
                        <Text style={styles.ratingTitle}>Califica a tu acompañante:</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    disabled={!isRequester}
                                    >
                                    <FontAwesome
                                        name={star <= rating ? "star" : "star-o"}
                                        size={30}
                                        color="gold"
                                        style={styles.star}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity disabled={!isRequester} style={styles.Button} onPress={endTrip}>
                        <Text style={styles.startButtonText}>{isRequester ? "Finalizar Viaje" : "Esperando al solicitante"}</Text>
                    </TouchableOpacity>
                </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

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
                        <Text style={styles.headerText}>Solicitar Viaje</Text>
                    </View>

                <View style={styles.mapContainer}>
                    <DropdownBox selectedValue={selectedDestination} setSelectedValue={setSelectedDestination}/>
                </View>

                <View style={styles.usersContainer}>
                    {users.length === 0 ? (
                    <Text style={styles.noUsersText}>No hay usuarios disponibles</Text>
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

        <TouchableOpacity style={styles.Button} onPress={beginTrip}>
            <Text style={styles.startButtonText}>Iniciar Viaje</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
};

const UserCard = ({ name, age, career, hobbies, rating, imageUri, userId, onSelect }) => (
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
                <FontAwesome name="star" size={14} color="black" />
                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

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
