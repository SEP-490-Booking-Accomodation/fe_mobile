import { View, Text } from "lucide-react-native";
/**
 * ConfirmBooking Component
 *
 * @param {Object} route - React Navigation route object
 * @param {Object} navigation - React Navigation navigation object
 *
 * This component displays the details of a booking confirmation.
 * It extracts room data from the props and renders the room name.
 *
 * @returns {React.ReactElement} The rendered component
 */

export default function ConfirmBooking({ route, navigation }) {
  const { roomData } = route.params || {};
  return (
    <View>
      <Text>{roomData?.name || "No room selected"}</Text>
    </View>
  );
}
