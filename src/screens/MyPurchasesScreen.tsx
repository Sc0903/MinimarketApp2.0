import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
} from 'react-native';

export const MyPurchasesScreen: React.FC = () => {
  const purchases: any[] = [];

  return (
    <View style={styles.container}>
      {purchases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes compras realizadas</Text>
          <Text style={styles.emptySubtext}>
            Comienza a explorar productos disponibles
          </Text>
        </View>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.purchaseCard}>
              <Image
                source={{ uri: item.productImage }}
                style={styles.productImage}
              />
              <View style={styles.purchaseInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.status}>{item.status}</Text>
                <Text style={styles.date}>{item.purchasedAt}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  purchaseCard: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
  },
  purchaseInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  status: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
