import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, RadioButton } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/validation';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Estudiante');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert("Contraseña débil", passwordError);
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);

    if (result.success) {
      Alert.alert("Éxito", "Usuario registrado correctamente. Ahora puedes iniciar sesión.", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>Crear Cuenta</Title>

        <TextInput
          label="Nombre completo"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholder="Mín. 12 chars, 1 Mayus, 1 Min, 1 Num, 1 Esp (!@#$%^&*)"
          right={
            <TextInput.Icon 
              icon={showPassword ? "eye-off" : "eye"} 
              onPress={() => setShowPassword(!showPassword)} 
            />
          }
        />

        <Text style={styles.roleLabel}>Selecciona tu rol:</Text>
        <RadioButton.Group onValueChange={value => setRole(value)} value={role}>
          <View style={styles.radioGroup}>
            <View style={styles.radioItem}>
              <RadioButton value="Estudiante" />
              <Text>Estudiante</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="Docente" />
              <Text>Docente</Text>
            </View>
          </View>
        </RadioButton.Group>

        <Button 
          mode="contained" 
          onPress={handleRegister} 
          loading={loading}
          style={styles.button}
        >
          Registrarse
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
  }
});
