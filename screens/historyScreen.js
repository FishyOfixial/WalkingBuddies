import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { ref, get } from 'firebase/database';
import { auth, database } from './firebase';
import SlideInMenu from './slideInMenuScreen';
import styles from '../src/styles/historyStyles';

const HistoryScreen = ({ navigation }) => {
    const [tripsAsRequester, setTripsAsRequester] = useState([]);
    const [tripsAsCompanion, setTripsAsCompanion] = useState([]);
    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        const fetchTripsAndNames = async () => {
            try {
                const userId = auth.currentUser.uid;

                const tripsSnapshot = await get(ref(database, 'trips/'));
                const tripsData = tripsSnapshot.exists() ? tripsSnapshot.val() : {};

                const requesterTrips = [];
                const companionTrips = [];
                const userIdsToFetch = new Set();

                Object.values(tripsData).forEach((trip) => {
                    if (trip.userId === userId) {
                        requesterTrips.push(trip);
                        userIdsToFetch.add(trip.walkingId);
                    } else if (trip.walkingId === userId) {
                        companionTrips.push(trip);
                        userIdsToFetch.add(trip.userId);
                    }
                });

                setTripsAsRequester(requesterTrips);
                setTripsAsCompanion(companionTrips);

                const userNamesResult = {};
                for (const id of userIdsToFetch) {
                    const userSnapshot = await get(ref(database, `users/${id}`));
                    if (userSnapshot.exists()) {
                        userNamesResult[id] = userSnapshot.val().name || 'Desconocido';
                    }
                }

                setUserNames(userNamesResult);
            } catch (error) {
                console.error('Error al cargar viajes:', error);
            }
        };

        fetchTripsAndNames();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        return  date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <SlideInMenu />
                        <Text style={styles.headerText}>Historial</Text>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>Viajes como Solicitante</Text>
                        {tripsAsRequester.length > 0 ? (
                            tripsAsRequester.map((trip) => (
                                <TripCard
                                    key={trip.tripId}
                                    tripDestination={trip.tripDestination}
                                    requesterName={"Tú"}
                                    companionName={userNames[trip.walkingId] || 'Desconocido'}
                                    date={formatDate(trip.date)}
                                />
                            ))
                        ) : (
                            <Text style={styles.noTripsText}>No has realizado viajes como solicitante.</Text>
                        )}
                    </View>

                    <View style={[styles.sectionContainer, {marginTop: 50}]}>
                        <Text style={styles.sectionHeader}>Viajes como Acompañante</Text>
                        {tripsAsCompanion.length > 0 ? (
                            tripsAsCompanion.map((trip) => (
                                <TripCard
                                    key={trip.tripId}
                                    tripDestination={trip.tripDestination}
                                    requesterName={userNames[trip.userId] || 'Desconocido'}
                                    companionName={"Tú"}
                                    date={formatDate(trip.date)}
                                />
                            ))
                        ) : (
                            <Text style={styles.noTripsText}>No has realizado viajes como acompañante.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const TripCard = ({ tripDestination, requesterName, companionName, date }) => {
    return (
        <View style={styles.tripCard}>
            <View style={styles.tripInfo}>
                <View style={styles.tripTextContainer}>
                    <Text style={styles.tripText}>
                        <Text style={styles.boldText}>Solicitante:</Text> {requesterName}
                    </Text>
                    <Text style={styles.tripText}>
                        <Text style={styles.boldText}>Acompañante:</Text> {companionName}
                    </Text>
                    <Text style={styles.tripText}>
                        <Text style={styles.boldText}>Destino:</Text> {tripDestination}
                    </Text>
                    <Text style={styles.tripText}>
                        <Text style={styles.boldText}>Fecha:</Text> {date}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default HistoryScreen;
