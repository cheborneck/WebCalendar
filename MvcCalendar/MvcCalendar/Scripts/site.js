var Planning = Planning || {};

Planning.Site = (function ($) {
    var init = function () {
        $('#thisList').change(function() {
            var value = $(this).val();
            $('#thisTime').html(convertTime(value));
        });

        function convertTime(time) {
            var d = new Date(),
            parts = time.match(/(\d+)\:(\d+) (\w+)/),
            hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10) + 12,
            minutes = parseInt(parts[2], 10);

            d.setHours(hours, minutes, 0);
            return d;
        }
    }
    return {
        Init: init
    };

}(window.jQuery));