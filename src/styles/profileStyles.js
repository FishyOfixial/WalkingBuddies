import { StyleSheet } from "react-native";

const profileStyles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#FFF',
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
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    headerText: {
        flex: 0.8,
        fontSize: 30,
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: -170,
        textAlign: 'center',
        zIndex: 1,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#FFF'
    },
    inputNoEditable: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        color: '#888888',
        backgroundColor: '#FFF'
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
        backgroundColor: '#FFF'
    },
    loginBtn: {
        width: '80%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
        alignItems: 'flex-start',
        width: '80%'
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
});

export default profileStyles;