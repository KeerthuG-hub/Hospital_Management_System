$(document).ready(function () {

    // $.ajax() full method
    $("#loadBtn").click(function () {

        $.ajax({
            url: "patients.json",
            method: "GET",
            dataType: "json",

            success: function (data) {

                $("#patientTable").empty();

                $.each(data, function (index, p) {

                    $("#patientTable").append(
                        "<tr>" +
                        "<td>" + p.id + "</td>" +
                        "<td>" + p.name + "</td>" +
                        "<td>" + p.age + "</td>" +
                        "<td>" + p.disease + "</td>" +
                        "</tr>"
                    );
                });

                // Even row styling (pseudo selector)
                $("#patientTable tr:even").css("background-color", "#f2f2f2");

            },

            error: function () {
                alert("Error loading data");
            },

            complete: function () {
                console.log("AJAX Completed");
            }
        });

    });


    // .load() method
    $("#noticeBtn").click(function () {
        $("#noticeArea").load("notice.html");
    });


    // $.getJSON() example
    $.getJSON("patients.json", function (data) {
        console.log("Total Patients: " + data.length);
    });

});
