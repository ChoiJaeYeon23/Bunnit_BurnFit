// 상/하 스와이프에 따른 주간달력 or 월간달력 표시 컴포넌트(주간,월간 달력 부모 컴포넌트)


import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MonthCalendar from './MonthCalendar'  // 월간 달력 컴포넌트
import WeekCalendar from './WeekCalendar'   // 주간 달력 컴포넌트


const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())  // 현재 날짜
    const [viewMode, setViewMode] = useState('month')  // 현재 화면에 보이는 달력 모드 ( 주간 or 월간 )
    const [selectedDate, setSelectedDate] = useState(null)  // 선택된 날짜

    // 스와이프 제스처 처리 함수
    const handleGestureEvent = (event) => {
        const { translationY } = event.nativeEvent // Y축이니까 위/아래 스와이프

        // 아래로 스와이프 (주간 -> 월간)
        if (translationY > 50) {
            if (viewMode === 'week') {
                setViewMode('month')
            }
        }
        // 위로 스와이프 (월간 -> 주간)
        else if (translationY < -50) {
            if (viewMode === 'month') {
                setViewMode('week')
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <PanGestureHandler onGestureEvent={handleGestureEvent}>
                    <View style={styles.calendarArea}>
                        {viewMode === 'month' ? (
                            <MonthCalendar
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                selectedDate={selectedDate}  // selectedDate 전달
                                setSelectedDate={setSelectedDate}  // 상태 변경 함수 전달
                            />
                        ) : (
                            <WeekCalendar
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                selectedDate={selectedDate}  // selectedDate 전달
                                setSelectedDate={setSelectedDate}  // 상태 변경 함수 전달
                            />
                        )}
                    </View>
                </PanGestureHandler>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarArea: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})

export default Calendar