

angular.module('vacationlistApp', [])
    .controller('vacationlistController', function ($scope, $http) {
        $http.get('demodata.json').then(function (response) {
            $scope.employees = response.data.employees;
            $scope.startdate = new Date(response.data.startdate);
            $scope.enddate = new Date(response.data.enddate);
        });

        //Listen on date changes
        $scope.$watchGroup(['startdate', 'enddate'], function (newValues, oldValues, scope) {
            var startdate = newValues[0];
            if (startdate !== undefined) {
                startdate = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate());
                var enddate = new Date(newValues[1]);
                enddate = new Date(enddate.getFullYear(), enddate.getMonth(), enddate.getDate());
                const year = startdate.getFullYear();
                const month = startdate.getMonth();
                var day = startdate.getDate();

                $scope.dates = [startdate];
                var monthObject = {};
                monthObject.name = startdate.toLocaleString('sv-se', { month: 'long' });
                monthObject.numDays = 1;
                monthObject.gridColumnStart = 2;
                $scope.months = {};
                $scope.months[month] = monthObject;
                var nextGridColumnStart = 3;
                while ($scope.dates[$scope.dates.length - 1] < enddate) {
                    var inLoopDate = new Date(year, month, ++day);
                    $scope.dates.push(inLoopDate);
                    var inMonthObject = $scope.months[inLoopDate.getMonth()]
                    if (inMonthObject === undefined) {
                        inMonthObject = {};
                        inMonthObject.name = inLoopDate.toLocaleString('sv-se', { month: 'long' });
                        inMonthObject.numDays = 1;
                        inMonthObject.gridColumnStart = nextGridColumnStart;
                        $scope.months[inLoopDate.getMonth()] = inMonthObject;
                    } else {
                        inMonthObject.numDays++;
                        inMonthObject.gridColumnEnd = nextGridColumnStart + 1;
                    }
                    nextGridColumnStart++;
                }
            }
        });

        $scope.getRightGridColumn = function (inDate) {
            const date = new Date(inDate);
            if (date >= $scope.startdate && date <= $scope.enddate) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const diffDays = Math.round(Math.abs(( $scope.startdate.getTime() - date.getTime()) / (oneDay)));
                return diffDays + 1;
            }
        }

    });

