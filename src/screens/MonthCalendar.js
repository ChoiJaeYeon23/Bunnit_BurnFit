// 월간달력 컴포넌트



import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAtom } from 'jotai'
import { currentDateAtom, selectedDateAtom } from '../store'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

const MonthCalendar = () => {
    const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
    const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom)
    const [daysInMonth, setDaysInMonth] = useState([])

    // 해당 달의 날짜 배열 생성
    const generateCalendar = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const days = []
        let currentDay = new Date(startOfMonth)

        // 이전 달 날짜 추가
        const prevMonthDays = startOfMonth.getDay()
        if (prevMonthDays > 0) {
            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
            for (let i = prevMonth.getDate() - prevMonthDays + 1; i <= prevMonth.getDate(); i++) {
                days.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i))
            }
        }

        // 이번 달 날짜 추가
        while (currentDay <= endOfMonth) {
            days.push(new Date(currentDay))
            currentDay.setDate(currentDay.getDate() + 1)
        }

        // 다음 달 날짜 추가
        const nextMonthDays = 7 - (days.length % 7)
        if (nextMonthDays < 7) {
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            for (let i = 1; i <= nextMonthDays; i++) {
                days.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i))
            }
        }

        setDaysInMonth(days)
    }

    useEffect(() => {
        generateCalendar()
    }, [currentDate])
    
    // 날짜 클릭 시 해당날짜를 선택된 날짜로 처리
    const handleDayPress = (date) => {
        setSelectedDate(date)
    }

    // 전 월로 넘어가는 버튼(벡터아이콘 쓴 버튼)
    const handlePrevMonth = () => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() - 1)
        setCurrentDate(newDate)
    }

    // 익 월로 넘어가는 버튼(벡터아이콘 쓴 버튼)
    const handleNextMonth = () => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() + 1)
        setCurrentDate(newDate)
    }
    

    const handleSwipe = (gesture) => {
        const newDate = new Date(currentDate)
        if (gesture.translationX < -100) {  // 왼쪽으로 스와이프
            newDate.setMonth(currentDate.getMonth() + 1) // 다음 달로 이동
        } else if (gesture.translationX > 100) {  // 오른쪽으로 스와이프
            newDate.setMonth(currentDate.getMonth() - 1) // 이전 달로 이동
        }
        setCurrentDate(newDate)
    }


    const renderDay = ({ item }) => {
        const isToday = isSameDay(item, new Date())
        const isOutsideCurrentMonth = item.getMonth() !== currentDate.getMonth()
        const isSelected = selectedDate && isSameDay(item, selectedDate)

        return (
            <TouchableOpacity
                style={[styles.dayContainer, isSelected && styles.selectedDayContainer]}
                onPress={() => handleDayPress(item)}
            >
                <Text
                    style={[
                        styles.dayText,
                        isToday && styles.boldText,
                        isOutsideCurrentMonth && styles.grayText,
                    ]}
                >
                    {item.getDate()}
                </Text>
            </TouchableOpacity>
        )
    }

    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        )
    }

    const renderWeekHeader = () => {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return (
            <View style={styles.weekHeader}>
                {weekdays.map((day, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.weekdayText,
                            index === 0 && styles.sundayText,
                            index === 6 && styles.saturdayText,
                        ]}
                    >
                        {day}
                    </Text>
                ))}
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.monthNavigation}>
                <TouchableOpacity onPress={handlePrevMonth}>
                    <Icon name="chevron-back-sharp" size={30} color="#333" />
                </TouchableOpacity>

                <Text style={styles.monthText}>
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </Text>

                <TouchableOpacity onPress={handleNextMonth}>
                    <Icon name="chevron-forward-sharp" size={30} color="#333" />
                </TouchableOpacity>
            </View>

            <PanGestureHandler
                onGestureEvent={(e) => handleSwipe(e.nativeEvent)}
                activeOffsetX={[-10, 10]} // 좌(-10),우(10)로 10픽셀 이내의 이동 감지함
            >
                <View style={styles.calendarContainer}>
                    {renderWeekHeader()}
                    <FlatList
                        data={daysInMonth}
                        renderItem={renderDay}
                        numColumns={7}
                        keyExtractor={(item) => item.toISOString()}
                        contentContainerStyle={styles.flatListContent}
                    />
                </View>
            </PanGestureHandler>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
    },
    monthText: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    calendarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    weekdayText: {
        width: Dimensions.get('window').width / 7.5,
        textAlign: 'center',
        fontSize: 14,
        color: '#b2b2b2',
    },
    dayContainer: {
        display: 'flex',
        width: Dimensions.get('window').width / 7.5,
        height: Dimensions.get('window').width / 7.5, //width와 height를 같게 설정해야함. -> 정사각형 -> radius 줬을때 동그라미처럼 보임
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 20,
        color: '#333',
    },
    boldText: {
        fontWeight: 'bold',
    },
    grayText: {
        color: '#dee2e6',
    },
    sundayText: {
        color: 'red',
    },
    saturdayText: {
        color: 'skyblue',
    },
    selectedDayContainer: {
        borderWidth: 2,
        borderColor: 'skyblue',
        borderRadius: 100,
    },
})

export default MonthCalendar
