// 주간달력 컴포넌트



import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAtom } from 'jotai'
import { currentDateAtom, selectedDateAtom } from '../store'
import { PanGestureHandler } from 'react-native-gesture-handler'

const WeekCalendar = () => {
    const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
    const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom)
    const [daysInWeek, setDaysInWeek] = useState([])

    // 해당 주의 날짜 배열 생성
    const generateWeek = () => {
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // 주의 시작 (일요일)

        const days = []

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i) // 각 요일의 날짜 계산
            days.push(day)
        }

        setDaysInWeek(days)
    }

    useEffect(() => {
        generateWeek()
    }, [currentDate])

    // 날짜 클릭 시 해당날짜를 선택된 날짜로 처리
    const handleDayPress = (date) => {
        setSelectedDate(date)
    }

    // 전 주로 넘어가는 버튼(벡터아이콘 쓴 버튼)
    const handlePrevWeek = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() - 7)
        setCurrentDate(newDate)
    }

    // 다음 주로 넘어가는 버튼(벡터아이콘 쓴 버튼)
    const handleNextWeek = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() + 7)
        setCurrentDate(newDate)
    }

    // 좌우 스와이프 처리
    const handleSwipe = (gesture) => {
        const newDate = new Date(currentDate)
        if (gesture.translationX < -100) {  // 왼쪽으로 스와이프
            newDate.setDate(currentDate.getDate() + 7) // 다음 주로 이동
        } else if (gesture.translationX > 100) {  // 오른쪽으로 스와이프
            newDate.setDate(currentDate.getDate() - 7) // 이전 주로 이동
        }
        setCurrentDate(newDate)
    }



    // 주 범위 표시 계산
    const getWeekTitle = () => {
        return `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`
    }

    // 날짜 렌더링
    const renderDay = ({ item }) => {
        const isToday = isSameDay(item, new Date())  // 오늘 날짜인지 확인
        const isSelected = selectedDate && isSameDay(item, selectedDate)  // 선택된 날짜 확인

        return (
            <TouchableOpacity
                style={[styles.dayContainer, isSelected && styles.selectedDayContainer]}
                onPress={() => handleDayPress(item)}
            >
                <Text
                    style={[
                        styles.dayText,
                        isToday && styles.boldText,  // 오늘 날짜는 bold 처리
                    ]}
                >
                    {item.getDate()}
                </Text>
            </TouchableOpacity>
        )
    }

    // 두 날짜가 같은지 비교하는 함수
    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        )
    }

    // 요일 헤더(Sun, Mon, Tue ... 등등 ) 렌더링
    const renderWeekHeader = () => {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return (
            <View style={styles.weekHeader}>
                {weekdays.map((day, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.weekdayText,
                            index === 0 && styles.sundayText, // 일요일 빨간색
                            index === 6 && styles.saturdayText, // 토요일 하늘색
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
                <TouchableOpacity onPress={handlePrevWeek}>
                    <Icon name="chevron-back-sharp" size={30} color="#333" />
                </TouchableOpacity>

                <Text style={styles.monthText}>{getWeekTitle()}</Text>

                <TouchableOpacity onPress={handleNextWeek}>
                    <Icon name="chevron-forward-sharp" size={30} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 주간 달력 영역 */}
            <PanGestureHandler
                onGestureEvent={(e) => handleSwipe(e.nativeEvent)}
                activeOffsetX={[-10, 10]} // 좌(-10),우(10)로 10픽셀 이내의 이동 감지함
            >
                <View style={styles.calendarContainer}>
                    {renderWeekHeader()}

                    <FlatList
                        data={daysInWeek}
                        renderItem={renderDay}
                        keyExtractor={(item) => item.toISOString()}
                        horizontal
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
        color: '#333'
    },
    boldText: {
        fontWeight: 'bold',
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

export default WeekCalendar
