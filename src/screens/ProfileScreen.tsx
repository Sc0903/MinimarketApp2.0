import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { countries, states, cities } from '../utils/locations';

export const ProfileScreen: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    country: user?.country || '',
    state: user?.state || '',
    city: user?.city || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile(editedUser);
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleCancel = () => {
    setEditedUser({
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      country: user?.country || '',
      state: user?.state || '',
      city: user?.city || '',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.location}>📍 {user?.country}, {user?.state}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Teléfono:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUser.phone}
              onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
            />
          ) : (
            <Text style={styles.value}>{user?.phone}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Dirección:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUser.address}
              onChangeText={(text) => setEditedUser({ ...editedUser, address: text })}
            />
          ) : (
            <Text style={styles.value}>{user?.address}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>País:</Text>
          {isEditing ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedUser.country}
                onValueChange={(itemValue) => {
                  setEditedUser({ ...editedUser, country: itemValue, state: '', city: '' });
                }}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un país" value="" />
                {countries.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          ) : (
            <Text style={styles.value}>{user?.country}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Estado:</Text>
          {isEditing ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedUser.state}
                onValueChange={(itemValue) => {
                  setEditedUser({ ...editedUser, state: itemValue, city: '' });
                }}
                style={styles.picker}
                enabled={!!editedUser.country}
              >
                <Picker.Item label="Selecciona un estado" value="" />
                {editedUser.country && states[editedUser.country]?.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          ) : (
            <Text style={styles.value}>{user?.state}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ciudad:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Escribe tu ciudad"
              value={editedUser.city}
              onChangeText={(text) => setEditedUser({ ...editedUser, city: text })}
              editable={!!editedUser.state}
            />
          ) : (
            <Text style={styles.value}>{user?.city}</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleSave}>
              <Text style={styles.editButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  actions: {
    padding: 16,
    gap: 12,
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#666',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
