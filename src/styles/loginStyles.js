import { StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
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
    errorText: {
        color: 'red', 
        fontSize: 14, 
        marginBottom: 10 
    },
});

export default loginStyles;
