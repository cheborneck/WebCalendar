var Planning = Planning || {};

Planning.SECalendar = (function ($) {

    var init = function () {

        var persistentData = "";
        var thisDate = new Date();
        var thisMonth = thisDate.getMonth();
        var thisYear = thisDate.getFullYear();
        var thisDay = thisDate.getDate();

        if (Modernizr.sessionstorage) {
            persistentData = window.sessionStorage;
            thisDate = persistentData.getItem("keySpecialEventsCalendar");
            thisDate = new Date(thisDate);
            if (!(Date.parse(thisDate))) {// this is an invalid date
                thisDate = new Date();
            }
            persistentData.setItem("keySpecialEventsCalendar", thisDate);
        }

        var Calendar = function (id) {

            this.id = id;

            this.DaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            this.CurrentMonth = thisDate.getMonth();
            this.CurrentYear = thisDate.getFullYear();

            this.thisMonth = this.CurrentMonth;
            this.thisYear = this.CurrentYear;
        };

        var specialEvents = [];

        // Goes to next month
        Calendar.prototype.nextMonth = function () {
            if (this.CurrentMonth == 11) {
                this.CurrentMonth = 0;
                this.CurrentYear += 1;
            } else {
                this.CurrentMonth += 1;
            }
            this.showCurrent();
        };

        // Goes to previous month
        Calendar.prototype.previousMonth = function () {
            if (this.CurrentMonth == 0) {
                this.CurrentMonth = 11;
                this.CurrentYear -= 1;
            } else {
                this.CurrentMonth -= 1;
            }
            this.showCurrent();
        };

        // reset the current month
        Calendar.prototype.currentMonth = function() {
            thisDate = new Date();
            this.CurrentMonth = thisDate.getMonth();
            this.CurrentYear = thisDate.getFullYear();
            this.showCurrent();
        };

        // Show current month
        Calendar.prototype.showCurrent = function () {
            if (Modernizr.sessionstorage) {
                var tempDate = new Date();
                tempDate.setFullYear(this.CurrentYear, this.CurrentMonth, 1);
                persistentData.setItem("keySpecialEventsCalendar", tempDate);
            }
            this.showMonth(this.CurrentYear, this.CurrentMonth);
        };

        // Show month (year, month)
        Calendar.prototype.showMonth = function (y, m) {

            var today = new Date(y, m, 1);
            // write the title
            var html = '<table class="table table-bordered">';
            html += '<tr><td colspan="7" class="text-center text-uppercase bg-info" style="font-weight: bold">' + this.Months[m] + ' - ' + y + '</td></tr>';

            // Write the header of the days of the week
            html += '<tr class="text-center bg-info">';
            for (var i = 0; i < this.DaysOfWeek.length; i++) {
                html += '<td>' + this.DaysOfWeek[i] + '</td>';
            }
            html += '</tr>';

            $.ajax({
                cache: true,
                async: false,
                type: 'get',
                url: '/Home/GetSpecialEvents',
                contentType: 'application/json; charset=utf-8',
                data: { date: today.toISOString() },
                datatype: 'json',
                success: function (data) {
                    specialEvents = data.result;

                    var firstDayOfMonth = new Date(y, m, 1).getDay();
                    var lastDateOfMonth = new Date(y, m + 1, 0).getDate();
                    var lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();

                    // Write the days
                    var d = 1;
                    do {
                        var dow = new Date(y, m, d).getDay();

                        // If Sunday, start new row
                        if (dow == 0) {
                            html += '<tr>';
                        } else if (d == 1) {
                            // If not Sunday but first day of the month
                            // it will write the last days from the previous month
                            html += '<tr>';
                            var k = lastDayOfLastMonth - firstDayOfMonth + 1;
                            for (var j = 0; j < firstDayOfMonth; j++) {
                                html += '<td style="background-color: whitesmoke">' + k + '</td>';
                                k++;
                            }
                        }

                        // Write the current day in the loop
                        if (d == thisDay && m == thisMonth && y == thisYear) {
                            html += '<td class="bg-success" style="font-weight: bold; margin-top: 0">' + d + '<br/>';
                        } else {
                            html += '<td style="font-weight: bold; margin-top: 0">' + d + '<br/>';
                        }
                        // add data
                        if (specialEvents[d - 1].length > 0) {
                            specialEvents[d - 1].forEach(function (event) {
                                html += '<a style="font-weight: bold; font-size: small; display: block; line-height: 1; margin-bottom: 5px;" href="https://eservices.scottsdaleaz.gov/bldgresources/cases/details/' + event.ID + '" data-toggle="tooltip" title="' + event.Description + '">' + event.Title + '</a>';
                            });
                        };
                        html += '</td>';

                        // If Saturday, closes the row
                        if (dow == 6) {
                            html += '</tr>';
                        } else if (d == lastDateOfMonth) {
                            // If not Saturday, but last day of the selected month
                            // it will write the next few days from the next month
                            var k = 1;
                            for (dow; dow < 6; dow++) {
                                html += '<td style="background-color: whitesmoke">' + k + '</td>';
                                k++;
                            }
                        }

                        d++;
                    } while (d <= lastDateOfMonth);

                    html += '</table>';
                },
                error: function (request, status, error) {;
                    html = request.responseText;
                }
            });

            // Write HTML to the div
            document.getElementById(this.id).innerHTML = html;
        };

        window.onload = function () {

            if (Modernizr.sessionstorage) {
                persistentData = window.sessionStorage;
                thisDate = new Date(persistentData.getItem("keySpecialEventsCalendar"));
                if (!(Date.parse(thisDate))) { // this is how you check for a valid date
                    thisDate = new Date();
                }
                persistentData.setItem("keySpecialEventsCalendar", thisDate);
            }

            // Start calendar
            var calendar = new Calendar('calendar');

            calendar.showCurrent();

            // Bind next and previous button clicks
            getId('btnNext').onclick = function() {
                calendar.nextMonth();
            };
            getId('btnPrev').onclick = function() {
                calendar.previousMonth();
            };
            getId('btnToday').onclick = function() {
                calendar.currentMonth();
            };
        };

        // Get element by id
        function getId(id) {
            return document.getElementById(id);
        }
    }

    return {
        Init: init
    };

}(window.jQuery));
