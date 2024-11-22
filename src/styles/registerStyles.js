import { StyleSheet } from 'react-native';

const registerStyles = StyleSheet.create({
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

export default registerStyles;