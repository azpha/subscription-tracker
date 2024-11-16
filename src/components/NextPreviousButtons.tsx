import DateUtils from "../utils/DateUtils"
import Button from "./Button";

export default function NextPreviousButtons({
    shownDate,
    incrementDate,
    decrementDate
}: {
    shownDate: Date,
    incrementDate: (d: Date) => void,
    decrementDate: (d: Date) => void
}) {
    const isFutureDateMoreThanAYearAway = (d: Date) => {
        const testDate = d;
        testDate.setMonth(testDate.getMonth() + 1);

        return DateUtils.isMoreThanOneYearFromNow(testDate);
    }
    const isPastDateLessThanCurrentDate = (d: Date) => {
        const testDate = d;
        testDate.setMonth(testDate.getMonth() - 1);

        return DateUtils.isInThePast(testDate);
    }

    return (
        <div className="space-x-2">
            <Button disabled={isFutureDateMoreThanAYearAway(shownDate)} onClick={() => incrementDate(shownDate)}>
                <p>Next</p>
            </Button>
            <Button disabled={isPastDateLessThanCurrentDate(shownDate)} onClick={() => decrementDate(shownDate)}>
                <p>Previous</p>
            </Button>
        </div>
    )
}