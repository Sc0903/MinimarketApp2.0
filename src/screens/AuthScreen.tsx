import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { countries, states, cities } from '../utils/locations';

type AuthMode = 'login' | 'register';

export const AuthScreen: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleAuth = async () => {
    try {
      if (mode === 'login') {
        if (!username || !password) {
          Alert.alert('Error', 'Por favor completa todos los campos');
          return;
        }
        await login(username, password);
      } else {
        if (!username || !email || !password || !phone || !address || !country || !state || !city) {
          Alert.alert('Error', 'Por favor completa todos los campos');
          return;
        }
        await register(username, email, password, phone, address, country, state, city);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Ocurrió un error');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MiniMarket App</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Inicia sesión' : 'Regístrate'}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
          />

          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          )}

          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={address}
              onChangeText={setAddress}
              editable={!isLoading}
            />
          )}

          {mode === 'register' && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>País</Text>
              <Picker
                selectedValue={country}
                onValueChange={(itemValue) => {
                  setCountry(itemValue);
                  setState(''); // Reset state when country changes
                  setCity(''); // Reset city
                }}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un país" value="" />
                {countries.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          )}

          {mode === 'register' && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Estado</Text>
              <Picker
                selectedValue={state}
                onValueChange={(itemValue) => {
                  setState(itemValue);
                  setCity(''); // Reset city when state changes
                }}
                style={styles.picker}
                enabled={!!country}
              >
                <Picker.Item label="Selecciona un estado" value="" />
                {country && states[country]?.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          )}

          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Escribe tu ciudad"
              value={city}
              onChangeText={setCity}
              editable={!!state}
            />
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            Para desarrollo: Ingresa cualquier usuario y contraseña
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  infoText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    fontStyle: 'italic',
  },
});