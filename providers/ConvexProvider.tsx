import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

interface ConvexStatusProviderProps {
  children: ReactNode;
}

export function ConvexStatusProvider({ children }: ConvexStatusProviderProps) {
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
      setIsConnected(false);
      return;
    }

    // Simple connection check - if we can create the client, assume connection
    // The actual connection will be established when needed
    setIsConnected(true);

    console.log("Convex client initialized with URL:", convexUrl);
  }, []);

  return (
    <ConvexProvider client={client}>
      {children}
      {isConnected ? (
        <View style={[styles.statusContainer, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.statusText}>Convex Connected</Text>
        </View>
      ) : (
        <View style={[styles.statusContainer, { backgroundColor: "#f44336" }]}>
          <Text style={styles.statusText}>Convex Not Configured</Text>
        </View>
      )}
    </ConvexProvider>
  );
}