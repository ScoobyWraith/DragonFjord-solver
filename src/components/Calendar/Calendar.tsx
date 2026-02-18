import styles from './styles.module.css'

import React from 'react';

interface ICalendarProps {
    setDateForSolution: React.Dispatch<React.SetStateAction<Date>>
    setIsLoaderVisible: React.Dispatch<React.SetStateAction<boolean>>
    initDate: Date
}

const Calendar: React.FC<ICalendarProps> = ({ setDateForSolution, setIsLoaderVisible, initDate }) => {
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const v: string = e.target.value.trim();

        if (v) {
            setIsLoaderVisible(true);
            setDateForSolution(new Date(v));
        }
    };

    return (
        <div className={styles["custom-date-input"]}>
            <input type="date" className={styles["custom-date-input__field"]} placeholder="Выберите дату" onChange={onChange} value={initDate.toISOString().split("T")[0]} />
        </div>
    );
};

export default Calendar;
