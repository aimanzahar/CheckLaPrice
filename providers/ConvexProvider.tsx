import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

interface ConvexStatusProviderProps {
  children: ReactNode;
}

export function ConvexStatusProvider({ children }: ConvexStatusProviderProps) {
  const [isConnecting, setIsConnecting] = useState<boolean>(!!convexUrl);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Only create client if URL is configured
  const [client] = useState(() => {
    if (convexUrl) {
      return new ConvexReactClient(convexUrl);
    }
    return null;
  });

  const styles = StyleSheet.create({
    statusContainer: {
      position: "absolute",
      top: 50,
      right: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      zIndex: 9999,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statusText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
  });

  useEffect(() => {
    // Check if URL is configured
    if (!convexUrl) {
      console.log("EXPO_PUBLIC_CONVEX_URL is not configured - running in offline mode");
      setIsConnecting(false);
      setIsConnected(false);
      return;
    }

    // Simulate connection check with a delay
    const connectionTimer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      console.log("Convex client initialized with URL:", convexUrl);
    }, 2000);

    return () => clearTimeout(connectionTimer);
  }, []);

  // If Convex is not configured, just render children without the provider
  if (!client) {
    return <>{children}</>;
  }

  return (
    <ConvexProvider client={client}>
      {children}
      {/* Only show when connecting */}
      {isConnecting && (
        <View style={[styles.statusContainer, { backgroundColor: "#2196F3" }]}>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.statusText}>Connecting to Convex...</Text>
        </View>
      )}
    </ConvexProvider>
  );
}
