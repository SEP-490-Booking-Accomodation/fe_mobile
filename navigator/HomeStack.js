import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProductScreen from "../screens/ProductScreen";
import { Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import SearchScreen from "../screens/SearchScreen";
import BreedScreen from "../screens/BreedScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import BreedDetailScreen from "../screens/BreedDetailScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import PaymentPage from "../screens/PaymentCarePage";

const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation }) => {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#272d2b" },
          headerTintColor: "#fff",
          animationTypeForReplace: "push", // Để có hiệu ứng chuyển đổi từ trái qua phải
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Koi Thé",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ padding: 10 }}
              >
                <Icon name="menu" size={24} color="#fff" />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: "#272d2b",
            },
            headerTintColor: "#fff",
          })}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{
            title: "Product",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            // headerShown: false,
            title: "Detail",
          }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{
            title: "Giỏ hàng",
            // headerShown: false,
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            title: "Check out",
            // headerShown: false,
          }}
        />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />

        <Stack.Screen
          name="Breed"
          component={BreedScreen}
          options={{
            title: "Breed",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="BreedDetail"
          component={BreedDetailScreen}
          options={{
            title: "Breed Detail",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: "Search",
            headerLeft: () => null,

            headerShown: false, // Hide the header for ProductScreen
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default HomeStack;
