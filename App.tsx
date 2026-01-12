import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ProductProvider } from './src/context/ProductContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
