import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { database, ref, get } from './firebase';

const WalkingBuddyScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Obtén los datos de la base de datos
        const usersRef = ref(database, 'users'); // 'users' es la ruta en tu Realtime Database
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
            const filteredUser = Object.values(snapshot.val()).filter(user => user.isVolunteer === true);
          // Si hay datos, asignamos a users
          setUsers(filteredUser); // Asumiendo que 'users' es un objeto con datos de usuarios
        } else {
          // Si no hay datos, limpiamos el estado de users
          setUsers([]);
          console.log("No data available");
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); // El array vacío asegura que solo se ejecute una vez, al montar el componente

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Walking Buddy</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x150' }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        {/* Users Section */}
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
              />
            ))
          )}
        </View>

        {/* Walk Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción de la Caminata</Text>
          <Text style={styles.descriptionText}>Detalles sobre la caminata aquí...</Text>
        </View>

        {/* Start Journey Button */}
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Iniciar Viaje</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// UserCard Component
const UserCard = ({ name, age, career, hobbies, description, rating, imageUri }) => {
  return (
    <View style={styles.userCard}>
      <Image source={{ uri: imageUri }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userText}><Text style={styles.boldText}>Nombre:</Text> {name}</Text>
        <Text style={styles.userText}><Text style={styles.boldText}>Edad:</Text> {age}</Text>
        <Text style={styles.userText}><Text style={styles.boldText}>Carrera:</Text> {career}</Text>
        <Text style={styles.userText}><Text style={styles.boldText}>Gustos:</Text> {hobbies}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <FontAwesome
              key={index}
              name="star"
              size={16}
              color={index < rating ? "#FFD700" : "#ccc"}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  header: {
    width: '100%',
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
    height: 150,
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
    flex: 1,
    paddingHorizontal: 10,
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
    flexDirection: 'row',
    marginTop: 5,
  },
  descriptionContainer: {
    width: '90%',
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
    fontSize: 16,
    color: '#333',
  },
  startButton: {
    width: '60%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#007BFF',
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
});

export default WalkingBuddyScreen;
