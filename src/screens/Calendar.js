import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler' 
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MonthCalendar from './MonthCalendar'  // 월간 달력 컴포넌트
import WeekCalendar from './WeekCalendar'   // 주간 달력 컴포넌트


const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())  // 현재 날짜
    const [viewMode, setViewMode] = useState('month')  // 'month' or 'week' (현재 보여지는 달력 모드)
    const [selectedDate, setSelectedDate] = useState(null)  // 선택된 날짜

    // 위/아래 스와이프 제스처 처리
    const handleGestureEvent = (event) => {
        const { translationY } = event.nativeEvent  // Y축 스와이프 방향

        if (translationY > 50) {
            // 아래로 스와이프 (주간 -> 월간)
            if (viewMode === 'week') {
                setViewMode('month')
            }
        } else if (translationY < -50) {
            // 위로 스와이프 (월간 -> 주간)
            if (viewMode === 'month') {
                setViewMode('week')
            }
        }
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>

                {/* 날짜를 위/아래로 스와이프할 영역 */}
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
            </SafeAreaView>
        </GestureHandlerRootView>
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
