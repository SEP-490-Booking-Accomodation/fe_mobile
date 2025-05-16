import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import TicketScreen from "../../components/TicketComponents/TicketScreen";
import { useGetBookingByIdQuery } from "../../api/bookingApi";

const TicketDetail = ({ route, navigation }) => {
  const { bookingId } = route.params || {};
  const {
    data: bookingData,
    isLoading: bookingLoading,
    isError: bookingError,
  } = useGetBookingByIdQuery(bookingId);

  const handleClose = () => {
    navigation.goBack();
  };

  // Show loading indicator while data is being fetched
  if (bookingLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#7B9EF0" }}>
        <StatusBar barStyle="light-content" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginTop: 10 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error message if there was an error fetching data
  if (bookingError || !bookingData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#7B9EF0" }}>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, textAlign: "center" }}>
            There was an error loading the booking information. Please try
            again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Check if password should be viewable based on status and payment status
  const isPasswordViewable =
    (bookingData.status === 2 || bookingData.status === 3) &&
    bookingData.paymentStatus === 3;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <TicketScreen
        onClose={handleClose}
        isPasswordViewable={isPasswordViewable}
        password={bookingData.passwordRoom || ""}
        bookingData={bookingData}
      />
    </SafeAreaView>
  );
};

export default TicketDetail;
