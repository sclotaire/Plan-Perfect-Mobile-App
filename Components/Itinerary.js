import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, FlatList, ActivityIndicator } from "react-native";
import ActivityCard from "./ActivityCard";
import { db } from "../firebase";
import { doc, getDocs, collection } from "firebase/firestore";

export const Itinerary = ({ route }) => {
  const [isLoading, setIsLoading] = useState(false)
  const itineraryId = route.params.itineraryId;
  const itineraryName = route.params.itineraryName

  const [userItinerary, setUserItinerary] = useState([]);
  useEffect(() => {
    setIsLoading(true)
    const itineraryRef = collection(db, "test-activities");
    getDocs(itineraryRef).then((snapshot) => {
      const itinerary = [];
      snapshot.docs.forEach((doc) => {
        if (doc.id === itineraryId) {
          itinerary.push({ ...doc.data(), id: doc.id });
        }
      });
      setUserItinerary(itinerary);
      setIsLoading(false)
    });
  }, [setUserItinerary, itineraryId]);

  
  function compare( a, b ) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }

if(userItinerary[0]){
  userItinerary[0].activities.sort( compare );
}

  return isLoading ? ( <ActivityIndicator/> ) : (
    <View style={styles.itinerary}>
      <View style={styles.containerItineraryName}>
        <Text style={styles.itineraryName}>
          {" "}
          {itineraryName}{" "}
        </Text>
      </View>

      {userItinerary.length === 0 ? 
        <Text> Empty Itinerary </Text>
       : (
        <FlatList
          style={{ width: "90%", height: "70%", padding: "10%" }}
          data={userItinerary[0].activities}
          renderItem={({ item: activity }) => (
            <ActivityCard activity={activity} setUserItinerary = {setUserItinerary} itineraryId ={itineraryId} />
          )}
        />   
      )}
    </View>
  )
};

export const styles = StyleSheet.create({
  itinerary: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: 'linear-gradient(to bottom right, transparent, #7743DB)',
  },

  containerItineraryName: {
    backgroundColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: "0.1px",
    padding: 5,
    // borderRadius: 10,
    width: "100%",
  },

  itineraryName: { 
    marginTop: "5%", 
    fontSize: "140%", 
    fontWeight: "bold",
    color: "black",
    textAlign: "center"
  }
});
