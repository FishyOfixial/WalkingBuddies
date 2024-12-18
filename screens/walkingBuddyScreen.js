import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import styles from '../src/styles/askBuddyStyles';

const WalkingBuddyScreen = ({ navigation }) => {
  // Tu lógica de estado y funciones aquí

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={24} color="black" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      ),
      headerTitle: 'Walking Buddy',
    });
  }, [navigation]);

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
                <Text style={styles.headerText}>Walking Buddy</Text>
              </View>

              <View style={styles.mapContainer}>
                <Image source={{ uri: 'https://via.placeholder.com/300x200' }} style={styles.mapImage} resizeMode="cover" />
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

      <TouchableOpacity style={styles.startButton} onPress={beginTrip}>
        <Text style={styles.startButtonText}>Iniciar Viaje</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WalkingBuddyScreen;
