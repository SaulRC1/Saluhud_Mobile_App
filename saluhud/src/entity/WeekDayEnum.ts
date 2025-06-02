export const enum WeekDayEnum {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export const fromWeekDayName = (weekDayName: string) => {
    if(weekDayName === "MONDAY") {
        return WeekDayEnum.MONDAY;
    }

    if(weekDayName === "TUESDAY") {
        return WeekDayEnum.TUESDAY;
    }

    if(weekDayName === "WEDNESDAY") {
        return WeekDayEnum.WEDNESDAY;
    }

    if(weekDayName === "THURSDAY") {
        return WeekDayEnum.THURSDAY;
    }

    if(weekDayName === "FRIDAY") {
        return WeekDayEnum.FRIDAY;
    }

    if(weekDayName === "SATURDAY") {
        return WeekDayEnum.SATURDAY;
    }

    if(weekDayName === "SUNDAY") {
        return WeekDayEnum.SUNDAY;
    }

    return null;
}