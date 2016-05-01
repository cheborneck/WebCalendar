var Planning = Planning || {};

Planning.SECalendar = (function ($) {

    var init = function () {

        var persistentData = "";
        var thisDate = new Date();

        if (Modernizr.sessionstorage) {
            persistentData = window.sessionStorage;
            thisDate = new Date(persistentData.getItem("keySpecialEventsCalendar"));
            if (Date.parse(thisDate)) {// this is how you check for a valid date
                persistentData.setItem("keySpecialEventsCalendar", thisDate);
            } else {
                persistentData.setItem("keySpecialEventsCalendar", new Date());
            }
        }

        var Calendar = function (id) {

            this.id = id;

            this.DaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            this.CurrentMonth = thisDate.getMonth();
            this.CurrentYear = thisDate.getFullYear();
            this.CurrentDay = thisDate.getDate();

            this.thisMonth = this.CurrentMonth;
            this.thisYear = this.CurrentYear;
        };

        var specialEvent = {
            CaseId: "",
            CaseName: "",
            CaseDescription: ""
        }

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

        // Show current month
        Calendar.prototype.showCurrent = function () {
            if (Modernizr.sessionstorage) { persistentData.setItem("keySpecialEventsCalendar", new Date(this.CurrentYear, this.CurrentMonth, this.CurrrentDay)); }
            this.showMonth(this.CurrentYear, this.CurrentMonth);
        };

        // Show this month
        Calendar.prototype.showThisMonth = function () {
            this.showMonth(this.thisYear, this.thisMonth);
        };

        var specialEvents = [specialEvent];

        // Show month (year, month)
        Calendar.prototype.showMonth = function (y, m) {

            var firstDayOfMonth = new Date(y, m, 1).getDay();
            var lastDateOfMonth = new Date(y, m + 1, 0).getDate();
            var lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();

            var html = '<table class="table table-bordered">';

            html += '<tr><td colspan="7" class="text-center text-uppercase bg-info" style="font-weight: bold">' + this.Months[m] + ' - ' + y + '</td></tr>';

            // Write the header of the days of the week
            html += '<tr class="text-center bg-info">';
            for (var i = 0; i < this.DaysOfWeek.length; i++) {
                html += '<td>' + this.DaysOfWeek[i] + '</td>';
            }
            html += '</tr>';

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
                        html += '<td style="background-color: whitesmoke; line-height: 50%">' + k + '</td>';
                        k++;
                    }
                }

                //var today = new Date(y, m, d);
                //$.ajax({
                //    cache: true,
                //    async: false,
                //    type: 'get',
                //    url: ApplicationOptions.BaseUrl + '/Cases/GetSpecialEvents',
                //    contentType: 'application/json; charset=utf-8',
                //    data: { date: today.toISOString() },
                //    datatype: 'json',
                //    success: function (data) {
                //        specialEvents = $.map(data.result, function (el) { return el });
                //    },
                //    error: function (request, status, error) {;
                //        alert(request.responseText);
                //    }
                //});

                // Write the current day in the loop
                if (d == this.CurrentDay && m == this.thisMonth && y == this.thisYear) {
                    html += '<td class="bg-success" style="font-weight: bold; line-height: 50%">' + d + '<br/><br/>';
                } else {
                    html += '<td style="font-weight: bold; line-height: 50%">' + d + '<br/><br/>';
                }
                // add data
                //if (specialEvents.length > 0) {
                //    specialEvents.forEach(function (event) {
                //        html += '<a style="font-weight: bold; font-size: x-small" href="https://eservices.scottsdaleaz.gov/bldgresources/cases/details/' + event.CaseId + '" data-toggle="tooltip" title="' + event.CaseDescription + '">' + event.CaseName + '</a><br/><br/>';
                //    });
                //};
                //html += '</td>';

                // If Saturday, closes the row
                if (dow == 6) {
                    html += '</tr>';
                } else if (d == lastDateOfMonth) {
                    // If not Saturday, but last day of the selected month
                    // it will write the next few days from the next month
                    var k = 1;
                    for (dow; dow < 6; dow++) {
                        html += '<td style="background-color: whitesmoke; line-height: 50%">' + k + '</td>';
                        k++;
                    }
                }

                d++;
            } while (d <= lastDateOfMonth);

            html += '</table>';

            // Write HTML to the div
            document.getElementById(this.id).innerHTML = html;
        };

        window.onload = function () {

            // Start calendar
            var calendar = new Calendar('calendar');
            calendar.showCurrent();

            // Bind next and previous button clicks
            getId('btnNext').onclick = function () {
                calendar.nextMonth();
            };
            getId('btnPrev').onclick = function () {
                calendar.previousMonth();
            };
            getId('btnToday').onclick = function () {
                persistentData.clear();
                thisDate = new Date();
                persistentData.setItem("keySpecialEventsCalendar", thisDate);
                calendar.showThisMonth();
            };
        }

        // Get element by id
        function getId(id) {
            return document.getElementById(id);
        }
    }

    return {
        Init: init
    };

}(window.jQuery));
