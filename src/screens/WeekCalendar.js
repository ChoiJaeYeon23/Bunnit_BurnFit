import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAtom } from 'jotai'
import { currentDateAtom, selectedDateAtom } from '../store' // Zotai 상태 관리

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

    // 날짜 클릭 시 선택된 날짜 처리
    const handleDayPress = (date) => {
        setSelectedDate(date)
    }

    // 좌우 스와이프 처리
    const handleSwipe = (direction) => {
        const newDate = new Date(currentDate)
        if (direction === 'left') {
            newDate.setDate(currentDate.getDate() - 7) // 한 주 전으로 이동
        } else if (direction === 'right') {
            newDate.setDate(currentDate.getDate() + 7) // 한 주 후로 이동
        }
        setCurrentDate(newDate)
    }

    // 주 범위 표시 계산
    const getWeekTitle = () => {
        return `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`
    }

    // 날짜 렌더링
    const renderDay = ({ item }) => {
        const isSelected = selectedDate && isSameDay(item, selectedDate)

        return (
            <TouchableOpacity
                style={[styles.dayContainer, isSelected && styles.selectedDayContainer]}
                onPress={() => handleDayPress(item)}
            >
                <Text
                    style={[ 
                        styles.dayText, 
                        isSelected && styles.boldText, 
                        item.getDay() === 0 && styles.sundayText, 
                        item.getDay() === 6 && styles.saturdayText, 
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

    // 요일 헤더 렌더링
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
                <TouchableOpacity onPress={() => handleSwipe('left')}>
                    <Icon name="chevron-back-sharp" size={30} color="#333" />
                </TouchableOpacity>

                <Text style={styles.monthText}>{getWeekTitle()}</Text>

                <TouchableOpacity onPress={() => handleSwipe('right')}>
                    <Icon name="chevron-forward-sharp" size={30} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 주간 달력 영역 */}
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
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
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        flex: 1,
    },
    calendarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // 세로 가운데 정렬
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
        fontWeight: 'bold',
        color: '#B0B0B0',
    },
    dayContainer: {
        display:'flex',
        width: Dimensions.get('window').width / 7.5,
        height: Dimensions.get('window').width / 7.5, // width와 height를 같게 설정
        justifyContent: 'center', // 세로 가운데 정렬
        alignItems: 'center', // 가로 가운데 정렬
    },
    dayText: {
        fontSize: 20,
        color: '#333'
    },
    boldText: {
        fontWeight: 'bold',
    },
    grayText: {
        color: '#B0B0B0',
    },
    sundayText: {
        color: 'red',
    },
    saturdayText: {
        color: 'skyblue',
    },
    selectedDayContainer: {
        borderWidth: 2,
        borderColor: 'skyblue', // 동그라미 스타일
        borderRadius: 100, // 동그라미 모양
    },
})

export default WeekCalendar
