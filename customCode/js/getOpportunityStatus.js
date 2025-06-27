window.getOpportunityStatus = (rowData) => {
    let quoteBy = new Date(rowData.quoteBy);
    let now = new Date();

    // Strip the time from the dates, making them represent the start of the day
    quoteBy.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (quoteBy.getTime() === now.getTime()) {
        return {
            title: "Due Tomorrow",
            color: "yellow"
        };
    } else if (quoteBy > now) {
        return {
            title: "Due Soon",
            color: "lime"
        };
    } else {
        return {
            title: "Past Due",
            color: "red"
        };
    }
}
