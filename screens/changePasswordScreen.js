import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Las nuevas contraseñas no coinciden.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setIsLoading(true);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Error", "No hay un usuario autenticado.");
                return;
            }

            // Reautenticación con contraseña actual
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Actualización de la contraseña
            await updatePassword(user, newPassword);

            Alert.alert("Éxito", "Contraseña actualizada correctamente.");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            switch (error.code) {
                case 'auth/wrong-password':
                    Alert.alert("Error", "La contraseña actual es incorrecta.");
                    break;
                case 'auth/weak-password':
                    Alert.alert("Error", "La nueva contraseña es demasiado débil.");
                    break;
                case 'auth/requires-recent-login':
                    Alert.alert("Error", "Inicia sesión de nuevo para realizar este cambio.");
                    break;
                default:
                    Alert.alert("Error", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cambiar Contraseña</Text>

            <TextInput
                style={styles.input}
                placeholder="Contraseña actual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <Button
                title={isLoading ? "Cambiando..." : "Cambiar Contraseña"}
                onPress={handleChangePassword}
                disabled={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        width: '80%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
});

export default ChangePasswordForm;
