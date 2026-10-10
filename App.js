import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TeacherDashboardScreen from './src/screens/Teacher/TeacherDashboardScreen';
import ResourceFormScreen from './src/screens/Teacher/ResourceFormScreen';
import ResourceListScreen from './src/screens/Student/ResourceListScreen';
import FavoritesScreen from './src/screens/Student/FavoritesScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a splash screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      {!user ? (
        // No user is signed in
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        </>
      ) : user.role === 'Docente' ? (
        // Teacher Flow
        <>
          <Stack.Screen 
            name="TeacherDashboard" 
            component={TeacherDashboardScreen} 
            options={{ title: 'Panel de Docente' }} 
          />
          <Stack.Screen 
            name="ResourceForm" 
            component={ResourceFormScreen} 
            // Title handled in the component dynamically
          />
        </>
      ) : (
        // Student Flow
        <>
          <Stack.Screen 
            name="ResourceList" 
            component={ResourceListScreen} 
            options={{ title: 'Recursos Disponibles' }} 
          />
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ title: 'Mis Favoritos' }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
