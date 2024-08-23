import React, { useState, useMemo } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TouchableHighlight,
    I18nManager,
} from 'react-native'
import moment from 'moment'
import Color from '../../../style/Color'
import LeftArrow from '../../../assets/svg/left-indicator.svg'
import RightArrow from '../../../assets/svg/right-indicator.svg'
import TextBold from '../../../components/TextBold'
import Style from '../../../style/Style'

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(moment())
    const [selectedDate, setSelectedDate] = useState(null)

    const daysOfWeek = useMemo(
        () =>
            I18nManager.isRTL
                ? ['أحد', 'إثن', 'ثلث', 'أرب', 'خمس', 'جمع', 'سبت']
                : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        []
    )

    const getDaysInMonth = () => {
        const startOfMonth = currentDate.startOf('month')
        const startDay = startOfMonth.day()
        const totalDays = currentDate.daysInMonth()

        const days = Array.from({ length: startDay }, (_, i) => ({
            date: startOfMonth
                .clone()
                .subtract(startDay - i, 'days')
                .date(),
            isCurrentMonth: false,
        }))

        for (let i = 1; i <= totalDays; i++) {
            days.push({ date: i, isCurrentMonth: true })
        }

        return days
    }

    const handleMonthChange = (offset) => {
        setCurrentDate(currentDate.clone().add(offset, 'months'))
        setSelectedDate(null)
    }

    const handleDateSelect = (day) => {
        if (day.isCurrentMonth && day.date !== selectedDate) {
            setSelectedDate(day.date)
        }
    }

    const renderDayNames = () => {
        return daysOfWeek.map((day, index) => (
            <View key={index} style={styles.dayNameContainer}>
                <TextBold
                    style={[Style.label, Style.colorBlack, styles.textPadding]}>
                    {day}
                </TextBold>
            </View>
        ))
    }

    const renderItem = ({ item }) => {
        const isToday =
            item.date === moment().date() &&
            currentDate.isSame(moment(), 'month')
        const isSelected = item.date === selectedDate && item.isCurrentMonth

        return (
            <TouchableOpacity
                onPress={() => handleDateSelect(item)}
                disabled={!item.isCurrentMonth}
                style={[
                    styles.dayContainer,
                    !item.isCurrentMonth && Style.backgroundWhite,
                    isSelected && styles.selectedDateContainer,
                    isToday && !selectedDate && styles.todayContainer,
                ]}>
                <TextBold
                    style={[
                        Style.alignCenter,
                        Style.subLabel,
                        Style.colorBlack,
                        !item.isCurrentMonth && styles.disabledDayText,
                        isSelected && styles.selectedDateText,
                        isToday && !selectedDate && styles.todayText,
                    ]}>
                    {item.date}
                </TextBold>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextBold style={[Style.labelButton, Style.colorBlack]}>
                    {currentDate.format('MMMM YYYY')}
                </TextBold>

                <View style={styles.navButtons}>
                    <TouchableHighlight
                        underlayColor={Color.buttonHighLitColor}
                        onPress={() => handleMonthChange(-1)}
                        style={[
                            styles.navButton,
                            styles.touchable,
                            Style.iconDirection,
                        ]}>
                        <LeftArrow />
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={Color.buttonHighLitColor}
                        onPress={() => handleMonthChange(1)}
                        style={[
                            styles.navButton,
                            styles.touchable,
                            Style.iconDirection,
                        ]}>
                        <RightArrow />
                    </TouchableHighlight>
                </View>
            </View>
            <View style={[Style.alignCenter, Style.justifyCenter]}>
                <FlatList
                    ListHeaderComponent={
                        <View style={styles.dayNamesContainer}>
                            {renderDayNames()}
                        </View>
                    }
                    data={getDaysInMonth()}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={7}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 18,
    },
    textPadding: {
        paddingVertical: I18nManager.isRTL ? 5 : null,
    },
    touchable: {
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navButtons: {
        flexDirection: 'row',
    },
    navButton: {
        marginLeft: 16,
        height: 30,
        width: 30,
    },
    dayNamesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    dayNameContainer: {
        width: I18nManager.isRTL ? 40 : 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        margin: 8,
    },
    todayContainer: {
        backgroundColor: '#018076',
    },
    selectedDateContainer: {
        backgroundColor: '#018076',
    },
    todayText: {
        color: Color.white,
    },
    selectedDateText: {
        color: Color.white,
    },
    disabledDayText: {
        color: Color.gray,
    },
})

export default Calendar
