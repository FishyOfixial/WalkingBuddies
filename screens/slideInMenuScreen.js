import React, { useState, useRef } from 'react';
import {Animated, StyleSheet, View, Text ,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SlideInMenu = ({}) => {
    const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuHeight] = useState(new Animated.Value(0));
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setMenuPosition({ top: height, left: 0 });
      });

      setMenuVisible(true);
      Animated.timing(menuHeight, {
        toValue: 250,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    switch(item){
        case "Solicitar Viaje":
            navigation.navigate("AskBuddy");
            break;
        case "Dashboard":
            navigation.navigate("Login");
            break;
        case "Historial":
            navigation.navigate("Login");
            break;
        case "Perfil":
            navigation.navigate("Login");
            break;
        case "Ayuda":
            navigation.navigate("Login");
            break;
        case "Cerrar Sesión":
            navigation.navigate("Login");
            break;
    }
  };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={toggleMenu}
                ref={buttonRef}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>{menuVisible ? '✕' : '☰'}</Text>
            </TouchableOpacity>
            {menuVisible && (
                <Animated.View
                    style={[styles.menu, { height: menuHeight, top: menuPosition.top, left: menuPosition.left }]}
                >
                {['Perfil', 'Solicitar Viaje', 'Historial',  'Ayuda', 'Cerrar Sesión'].map((item) => (
                    <TouchableOpacity key={item} onPress={() => handleItemPress(item)}>
                            <Text style={[styles.menuItem,selectedItem === item && styles.selectedItem,]}>
                                {item}
                            </Text>
                    </TouchableOpacity>
                ))}
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#f4f4f4',
    marginLeft: 10,
    backgroundColor: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: 10,
    zIndex: 3
  },
  buttonText: {
    color: '#fff',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#FFF',
    width: 200,
    overflow: 'hidden',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
  },
});

export default SlideInMenu;
