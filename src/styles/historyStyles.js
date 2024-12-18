import { Dimensions, StyleSheet } from "react-native";

const {width} = Dimensions.get("window");

const historyStyles = StyleSheet.create({
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
    sectionContainer: {
        alignContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
    },
    noTripsText: {
        fontSize: 16,
        color: '#888',
        marginVertical: 10,
    },
    tripCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: 'auto',
        width: width * 0.8,
        alignSelf: 'center'
    },
    tripInfo: {
        flex: 1,
    },
    tripTextContainer: {
        marginBottom: 10,
    },
    tripText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#444',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#222',
    },

});

export default historyStyles;