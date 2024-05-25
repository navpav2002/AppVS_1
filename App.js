import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import Write from './components/Write';
import Read from './components/Read';
import CustomImage from './components/CustomImage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import RecentProducts from './components/RecentProducts';
import LineChartComponent from './components/LineChartComponent';
import { MaterialIcons } from '@expo/vector-icons';
import GlassButton from './components/GlassButton';
import { MenuProvider } from 'react-native-popup-menu';
import ReadUser from './components/ReadUser';
import LastOrder from './components/LastOrder';


const app = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

// AuthScreen
const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <ImageBackground source={require('./assets/Glassmorphism2.jpg')} style={styles.backgroundImage} >
      <View style={styles.container}>
        <CustomImage />
        <View style={styles.authContainer}>
          <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          <TextInput
            style={styles.authInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.authInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <GlassButton title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" fontFamily={'Kalam-Bold'} />
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account?' : 'Already have an account?'}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

// AuthenticatedScreen
const AuthenticatedScreen = ({ user, handleAuthentication, navigation, email, theme }) => {
  const [flip, setFlip] = useState(true);

  const switchColors = () => {
    setFlip(!flip);
    console.log(flip);
  }

  return (
    <View style={theme === 'light' ? styles.container2 : styles.containerSwitched2}>
      <View>
        <View>
          <View style={styles.authContainer2}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <RecentProducts email={user.email} />
            </View>
            <LastOrder email={user.email} />
          </View>
        </View>
      </View>
    </View>
  );
};

const ProductListScreen = ({ email, theme }) => {
  return (
    email === 'admin@admin.com'
      ? (
        <View style={theme === 'light' ? styles.container2 : styles.containerSwitched2}>
          <Read email={email} theme={theme} />
        </View>
      )
      : (
        <View style={theme === 'light' ? styles.container2 : styles.containerSwitched2}>
          <ReadUser email={email} theme={theme} />
        </View>
      )
  );
};

const NewListScreen = ({ email, theme }) => {
  return (
    <View style={theme === 'light' ? styles.container2 : styles.containerSwitched2}>
      <Write email={email} theme={theme} />
    </View>
  );
};

const StatisticsScreen = ({ email, theme }) => {
  return (
    <View style={theme === 'light' ? styles.container2 : styles.containerSwitched3}>
      <LineChartComponent email={email} theme={theme} />
    </View>
  );
};

const Tab = createBottomTabNavigator();
// App
export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);
  const [theme, setTheme] = useState('light'); // State for theme

  let [fontsLoaded] = useFonts({
    'PoetsenOne-Regular': require('./assets/fonts/PoetsenOne-Regular.ttf'),
    'Courgette-Regular': require('./assets/fonts/Courgette-Regular.ttf'),
    'Kalam-Bold': require('./assets/fonts/Kalam-Bold.ttf'),
    'Kalam-Light': require('./assets/fonts/Kalam-Light.ttf'),
    'Kalam-Regular': require('./assets/fonts/Kalam-Regular.ttf'),
  });

  // Setting up Firebase authentication
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {      // auf Änderungen bei auth achten
      setUser(user);  // wenn sich etwas ändert, soll setUser(user) aufgerufen werden, um den neuen Benutzer zu aktualisieren.
    });

    return () => unsubscribe();  // aufhört, da hier es nicht mehr gebraucht wird.
  }, [auth]);

  // Function to handle login, signup, and logout
  const handleAuthentication = async () => {
    try {
      if (user) { // überprüft, ob der Benutzer bereits angemeldet ist. Wenn ja, meldet es den Benutzer ab.
        console.log('User logged out successfully!');
        await signOut(auth);
      }
      else // Wenn der Benutzer nicht angemeldet ist, führt es den Code in diesem Block aus
      {
        // Login user
        if (isLogin) { // überprüft, ob der Benutzer versucht, sich anzumelden. Wenn ja, versucht es, den Benutzer anzumelden.
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        }
        else // Wenn der Benutzer nicht versucht, sich anzumelden (was bedeutet, dass er versucht, sich zu registrieren), versucht es, einen neuen Benutzer zu erstellen.
        {
          // Register new user
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) { // Wenn bei irgendeinem Teil des Codes ein Fehler auftritt, wird dieser Block ausgeführt
      console.error('Authentication error:', error.message);
    }
  };

  const switchColors = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <MenuProvider>
      <NavigationContainer>
        {user ? (
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              options={{
                headerStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333', // Setzt die Hintergrundfarbe der Kopfzeile
                  borderBottomWidth: 4,  // Setzt eine Linie unter dem Header
                  borderBottomColor: 'white'
                },
                headerTitleAlign: 'center', // Zentriert den Titel
                headerTintColor: '#fff', // Setzt die Farbe des Titels
                headerTitleStyle: {
                  fontFamily: 'Kalam-Bold', // Setzt die Schriftfamilie
                  fontSize: 34, // Setzt die Schriftgröße
                },
                tabBarLabel: 'Home',
                tabBarActiveTintColor: '#e84c3c', // Farbe des Icons und Texts, wenn aktiv
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333',
                  height: 70,
                },
                tabBarIcon: ({ focused, color, size }) => (
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {focused && <View style={{ height: 4, width: '100%', backgroundColor: '#e84c3c' }} />}
                    <MaterialCommunityIcons name="home" color={color} size={size * 1.5} />
                  </View>
                ),
                tabBarLabelStyle: {
                  fontSize: 20, // Setzt die Schriftgröße des Labels
                  fontFamily: 'Kalam-Regular',
                  color: '#fff',
                },
                headerRight: () => <HeaderProfileButton handleAuthentication={handleAuthentication} switchColors={switchColors} />
              }}
            >
              {(props) => <AuthenticatedScreen {...props} email={email} user={user} handleAuthentication={handleAuthentication} theme={theme} />}
            </Tab.Screen>

            <Tab.Screen
              name="Create Product List"
              options={{
                headerStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333', // Setzt die Hintergrundfarbe der Kopfzeile
                  borderBottomWidth: 4,  // Setzt eine Linie unter dem Header
                  borderBottomColor: 'white'
                },
                headerTitleAlign: 'center', // Zentriert den Titel
                headerTintColor: '#fff', // Setzt die Farbe des Titels
                headerTitleStyle: {
                  fontFamily: 'Kalam-Bold', // Setzt die Schriftfamilie
                  fontSize: 34, // Setzt die Schriftgröße
                },
                tabBarLabel: 'New List',
                tabBarActiveTintColor: '#e60b75', // Farbe des Icons und Texts, wenn aktiv
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333',
                  height: 70,
                },
                tabBarLabelStyle: {
                  fontSize: 20, // Setzt die Schriftgröße des Labels
                  fontFamily: 'Kalam-Regular',
                  color: '#fff',
                },
                tabBarIcon: ({ focused, color, size }) => (
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {focused && <View style={{ height: 4, width: '100%', backgroundColor: '#e60b75' }} />}
                    <Entypo name="add-to-list" color={color} size={size * 1.5} />
                  </View>
                ),
              }}
            >
              {(props) => <NewListScreen {...props} email={email} user={user} theme={theme} />}
            </Tab.Screen>

            <Tab.Screen
              name="Statistics"
              options={{
                headerStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333', // Setzt die Hintergrundfarbe der Kopfzeile
                  borderBottomWidth: 4,  // Setzt eine Linie unter dem Header
                  borderBottomColor: 'white'
                },
                headerTitleAlign: 'center', // Zentriert den Titel
                headerTintColor: '#fff', // Setzt die Farbe des Titels
                headerTitleStyle: {
                  fontFamily: 'Kalam-Bold', // Setzt die Schriftfamilie
                  fontSize: 34, // Setzt die Schriftgröße
                },
                tabBarLabel: 'Statistics',
                tabBarActiveTintColor: '#a1eb34', // Farbe des Icons und Texts, wenn aktiv
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333',
                  height: 70,
                },
                tabBarLabelStyle: {
                  fontSize: 20, // Setzt die Schriftgröße des Labels
                  fontFamily: 'Kalam-Regular',
                  color: '#fff',
                },
                tabBarIcon: ({ focused, color, size }) => (
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {focused && <View style={{ height: 4, width: '100%', backgroundColor: '#a1eb34' }} />}
                    <MaterialIcons name="query-stats" size={size * 1.5} color={color} />
                  </View>
                ),
              }}
            >
              {(props) => <StatisticsScreen {...props} email={email} user={user} theme={theme} />}
            </Tab.Screen>

            <Tab.Screen
              name="Product List"
              options={{
                headerStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333', // Setzt die Hintergrundfarbe der Kopfzeile
                  borderBottomWidth: 4,  // Setzt eine Linie unter dem Header
                  borderBottomColor: 'white'
                },
                headerTitleAlign: 'center', // Zentriert den Titel
                headerTintColor: '#fff', // Setzt die Farbe des Titels
                headerTitleStyle: {
                  fontFamily: 'Kalam-Bold', // Setzt die Schriftfamilie
                  fontSize: 34, // Setzt die Schriftgröße
                },
                tabBarLabel: 'Products',
                tabBarActiveTintColor: '#FFC90E', // Farbe des Icons und Texts, wenn aktiv
                tabBarInactiveTintColor: '#fff',
                tabBarIcon: ({ focused, color, size }) => (
                  <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {focused && <View style={{ height: 4, width: '100%', backgroundColor: '#FFC90E' }} />}
                    <MaterialCommunityIcons name="view-list" color={color} size={size * 1.5} />
                  </View>
                ),
                tabBarLabelStyle: {
                  fontSize: 20, // Setzt die Schriftgröße des Labels
                  fontFamily: 'Kalam-Regular',
                  color: '#fff',
                },
                tabBarStyle: {
                  backgroundColor: theme === 'light' ? '#21ABA5' : '#333',
                  height: 70,
                },
              }}
            >
              {(props) => <ProductListScreen {...props} email={email} user={user} theme={theme} />}
            </Tab.Screen>
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Shopping Cart"
              options={{
                headerTransparent: true, // Macht den Header transparent
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontFamily: 'Kalam-Bold',
                  fontSize: 34,
                },
              }}
            >
              {(props) => (
                <AuthScreen
                  {...props}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                  handleAuthentication={handleAuthentication}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </MenuProvider>
  );
}

const workInProgress = require('./assets/WorkInProgress.jpg');

const HeaderProfileButton = ({ handleAuthentication, switchColors }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleProfileToggle = () => {
    setMenuVisible(false);
    setProfileVisible(true);
  };

  const closeProfile = () => {
    setProfileVisible(false);
  };

  return (
    <View style={{ paddingRight: 10 }}>
      <TouchableOpacity onPress={handleMenuToggle}>
        <MaterialCommunityIcons name="account-circle" size={28} color="black" />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuOption} onPress={handleProfileToggle}>
                <Text>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuOption} onPress={() => {
                setMenuVisible(false);
                switchColors();
              }}>
                <Text>Change Theme</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuOption} onPress={() => {
                setMenuVisible(false);
                handleAuthentication();
              }}>
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={profileVisible}
        animationType="fade"
        onRequestClose={closeProfile}
      >
        <TouchableWithoutFeedback onPress={closeProfile}>
          <View style={styles.modalOverlay}>
            <View style={styles.profileContainer}>
              <Image
                source={workInProgress}
                style={styles.profileImage}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: '#B4DEE4',
  },
  container2: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#B4DEE4',
    flex: 1,
  },
  containerSwitched2: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000',
    flex: 1,
  },
  containerSwitched3: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4D648D',
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Transparenz für den Glas-Effekt
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000', // Schattenfarbe
    shadowOffset: { width: 0, height: 4 }, // Position des Schattens
    shadowOpacity: 0.3, // Transparenz des Schattens
    shadowRadius: 4, // Weichheit des Schattens
    alignItems: 'center', // Zentriert die Inhalte horizontal
    justifyContent: 'center', // Zentriert die Inhalte vertikal
  },
  authContainer2: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    width: 300,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Kalam-Bold',
    color: '#fff',
    width: 200,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  authInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    width: 200,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Kalam-Bold',
    width: 200,
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 50, // Platz für das Symbol oben
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    width: 200,
    marginRight: 10, // Platz zum Rand des Bildschirms
  },
  menuOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 370,
    height: 370,
    borderRadius: 100,
    marginBottom: 20,
    marginRight: 10,
    marginTop: 140,
  },
});