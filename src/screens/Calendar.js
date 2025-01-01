import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Platform

 } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

const Calendar = () => {
    // 한국 시간으로 현재 시간 받기 (UTC+9)
    const [currentDate, setCurrentDate] = useState(new Date(new Date().getTime() + (9 * 60 * 60 * 1000))); // +9시간
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null); // 클릭된 날짜 상태 추가

    // 해당 월의 날짜 배열 생성
    const generateCalendar = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // currentDate 달의 첫 번째 날(일자)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // currentDate 달의 마지막 날(일자)

        const days = [];

        let currentDay = new Date(startOfMonth);  // 월의 첫 번째 주의 시작 날짜

        // 현재 달력에 이전 달 날짜 추가
        const prevMonthDays = startOfMonth.getDay(); // startOfMonth의 요일 (월요일이면 1, 일요일이면 7)
        if (prevMonthDays > 0) {
            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
            for (let i = prevMonth.getDate() - prevMonthDays + 1; i <= prevMonth.getDate(); i++) {
                days.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i));
            }
        }

        // 현재 달력에 이번 달 날짜 추가
        while (currentDay <= endOfMonth) {
            days.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        // 현재 달력에 다음 달 날짜 추가
        const nextMonthDays = 7 - (days.length % 7); // 다음 달에 추가될 날짜 수
        if (nextMonthDays < 7) {
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            for (let i = 1; i <= nextMonthDays; i++) {
                days.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i));
            }
        }

        setDaysInMonth(days);
    };

    useEffect(() => {
        generateCalendar();
    }, [currentDate]);

    // 달력 날짜 렌더링
    const renderDay = ({ item }) => {
        const isToday = isSameDay(item, new Date()); // 오늘 날짜 확인
        const isOutsideCurrentMonth = item.getMonth() !== currentDate.getMonth(); // 현재 달이 아닌 날짜
        const isSelected = selectedDate && isSameDay(item, selectedDate); // 클릭된 날짜 확인

        return (
            <TouchableOpacity
                style={[styles.dayContainer, isSelected && styles.selectedDayContainer]} // 클릭된 날짜에 동그라미 스타일 적용
                onPress={() => setSelectedDate(item)} // 날짜 클릭 시 해당 날짜를 selectedDate로 설정
            >
                <Text
                    style={[
                        styles.dayText,
                        isToday && styles.boldText, // 오늘 날짜 글씨를 진하게
                        isOutsideCurrentMonth && styles.grayText, // 현재 달이 아닌 날짜는 회색
                    ]}
                >
                    {item.getDate()} {/* 한국 시간 기준으로 날짜 표시 */}
                </Text>
            </TouchableOpacity>
        );
    };

    // 두 날짜가 같은지 비교하는 함수
    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    // 달력 헤더
    const renderWeekHeader = () => {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
        );
    };

    // 이전 월로 이동
    const handlePreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1); // 한 달 전으로 변경
        setCurrentDate(newDate);
    };

    // 이후 월로 이동
    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1); // 한 달 후로 변경
        setCurrentDate(newDate);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 월 navigation */}
            <View style={styles.monthNavigation}>
                <TouchableOpacity onPress={handlePreviousMonth}>
                    <Icon name="chevron-back-sharp" size={30} color="#333" />
                </TouchableOpacity>

                <Text style={styles.monthText}>
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </Text>

                <TouchableOpacity onPress={handleNextMonth}>
                    <Icon name="chevron-forward-sharp" size={30} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 달력 영역 */}
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
        </SafeAreaView>
    );
};

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
        paddingLeft: Platform.OS==='android' ? 5.5 : 0 , // 안드로이드일 경우 왼쪽패딩 6....
        fontSize: 20,
        color: '#333',
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
});

export default Calendar;
