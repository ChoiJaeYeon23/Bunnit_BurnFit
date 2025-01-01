import { NavigationContainer } from "@react-navigation/native"
import 'react-native-reanimated'

import Navigation from './src/navigation/Navigation'

const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  )
}


export default App