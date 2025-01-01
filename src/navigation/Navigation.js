import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/Home';
import CalendarScreen from '../screens/Calendar';
import LibraryScreen from '../screens/Library';
import MypageScreen from '../screens/Mypage';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (

    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black', // 탭이 선택됐을때 글씨(폰트) 색상
        tabBarInactiveTintColor: 'gray', // 탭이 선택되지 않았을때 글씨(폰트) 색상
      }}
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={size || 24}
              color={color || 'gray'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CALENDAR"
        component={CalendarScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size || 24}
              color={color || 'gray'}
            />
          ),
        }}
      />


      <Tab.Screen
        name="LIBRARY"
        component={LibraryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'barbell' : 'barbell-outline'}
              size={size || 24}
              color={color || 'gray'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MY PAGE"
        component={MypageScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              size={size || 24}
              color={color || 'gray'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
