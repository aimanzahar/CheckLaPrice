import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

interface ConvexStatusProviderProps {
  children: ReactNode;
}

export function ConvexStatusProvider({ children }: ConvexStatusProviderProps) {
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [client] = useState(() => new ConvexReactClient(convexUrl!));

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
      console.error("EXPO_PUBLIC_CONVEX_URL is not configured");
      setIsConnecting(false);
      setIsConnected(false);
      return;
    }

    // Simulate connection check with a delay
    const connectionTimer = setTimeout(() => {
      // The actual connection will be established when needed
      setIsConnecting(false);
      setIsConnected(true);
      console.log("Convex client initialized with URL:", convexUrl);
    }, 2000); // Show connecting status for 2 seconds

    return () => clearTimeout(connectionTimer);
  }, []);

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
      {/* Show error only if not configured */}
      {!convexUrl && (
        <View style={[styles.statusContainer, { backgroundColor: "#f44336" }]}>
          <Text style={styles.statusText}>Convex Not Configured</Text>
        </View>
      )}
    </ConvexProvider>
  );
}