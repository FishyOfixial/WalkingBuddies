import { StyleSheet, Platform } from "react-native";

const askBuddyStyles = StyleSheet.create({
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
    mapContainer: {
        width: '90%',
        height: 220,
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
    Button: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 50 : 20,
        width: '60%',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#007BFF',
        alignSelf: 'center',
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
    },
    containerDrop: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        height: '100%',
        width: '100%',
    },
    labelDrop: {
        fontSize: 18,
        marginTop: -75,
        marginBottom: -75,
        backgroundColor: '#d3d3d3',
        width: '100%',
        height: 30
    },
    pickerDrop: {
        height: 0,
        width: 325,
        marginTop: 50,
        paddingBottom: 100,
    },
    tripDetailsContainer: {
        marginBottom: 20,
        marginTop: 10,
        width: '100%',
        backgroundColor: '#fff',
        paddingLeft: 20,
        height: 'auto',
        borderRadius: 10
    },
    tripDetailText: {
        fontSize: 16,
        marginVertical: 5,
        color: '#333',
    },
    ratingContainerEndTrip: {
        backgroundColor: '#fff',
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        height: '100',
        justifyContent: 'center',
        borderRadius: 10
    },
    ratingTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row', 
        justifyContent: 'center',
        marginBottom: 20,
    },
    star: {
        marginHorizontal: 2,
    },
    endTripButton: {
        bottom: 10
    }
});

export default askBuddyStyles;
