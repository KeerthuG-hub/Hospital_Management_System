$(document).ready(function () {

    const DOCTOR_URL = "http://localhost:3000/doctors";
    const REPORT_URL = "http://localhost:3000/reports";

    // TAB SWITCHING
    $("#doctorTab").click(() => {
        $("#doctorSection").show();
        $("#reportSection").hide();
    });

    $("#reportTab").click(() => {
        $("#doctorSection").hide();
        $("#reportSection").show();
        populateDoctorDropdown();
        loadReports();
    });

    // ================= DOCTORS =================

    function loadDoctors() {
        $.ajax({
            url: DOCTOR_URL,
            type: "GET", //GET
            success: function (data) {

                $("#doctorTable tbody").empty();

                data.forEach(doctor => {
                    $("#doctorTable tbody").append(`
                        <tr>
                            <td>${doctor.id}</td>
                            <td>${doctor.name}</td>
                            <td>${doctor.specialization}</td>
                            <td>
                                <button class="editDoctor editBtn" data-id="${doctor.id}">Edit</button>
                                <button class="deleteDoctor deleteBtn" data-id="${doctor.id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }

    loadDoctors();

    $("#doctorForm").submit(function (e) {
        e.preventDefault();

        let id = $("#doctorId").val();
        let name = $("#doctorName").val();
        let specialization = $("#specialization").val();

        if (id) {

            $.ajax({
                url: DOCTOR_URL + "/" + id,
                type: "PUT", //PUT
                data: JSON.stringify({
                    id: id,
                    name: name,
                    specialization: specialization
                }),
                contentType: "application/json",
                success: function () {
                    loadDoctors();
                    populateDoctorDropdown();
                }
            });

        } else {

            $.ajax({
                url: DOCTOR_URL,
                type: "POST", //POST
                data: JSON.stringify({
                    name: name,
                    specialization: specialization
                }),
                contentType: "application/json",
                success: function () {
                    loadDoctors();
                    populateDoctorDropdown();
                }
            });
        }

        this.reset();
        $("#doctorId").val("");
    });

    $(document).on("click", ".editDoctor", function () {

        let id = $(this).data("id");

        $.ajax({
            url: DOCTOR_URL + "/" + id,
            type: "GET", //GET single
            success: function (doctor) {
                $("#doctorId").val(doctor.id);
                $("#doctorName").val(doctor.name);
                $("#specialization").val(doctor.specialization);
            }
        });
    });

    $(document).on("click", ".deleteDoctor", function () {

        let id = $(this).data("id");

        $.ajax({
            url: DOCTOR_URL + "/" + id,
            type: "DELETE", //DELETE
            success: function () {
                loadDoctors();
                populateDoctorDropdown();
            }
        });
    });

    // PATCH example (double click edit button)
    $(document).on("dblclick", ".editDoctor", function () {

        let id = $(this).data("id");
        let newName = prompt("New Name");

        if (newName) {
            $.ajax({
                url: DOCTOR_URL + "/" + id,
                type: "PATCH", //PATCH
                data: JSON.stringify({ name: newName }),
                contentType: "application/json",
                success: function () {
                    loadDoctors();
                }
            });
        }
    });

    function populateDoctorDropdown() {
        $.ajax({
            url: DOCTOR_URL,
            type: "GET", //GET
            success: function (data) {

                $("#assignedDoctor").empty().append(`<option value="">Select Doctor</option>`);

                data.forEach(d => {
                    $("#assignedDoctor").append(
                        `<option value="${d.id}">${d.name}</option>`
                    );
                });
            }
        });
    }

    // ================= REPORTS =================

    function loadReports() {
        $.ajax({
            url: REPORT_URL,
            type: "GET", //GET
            success: function (reports) {

                $.ajax({
                    url: DOCTOR_URL,
                    type: "GET", //GET doctors
                    success: function (doctors) {

                        $("#reportTable tbody").empty();

                        reports.forEach(report => {

                            let doctor = doctors.find(d => d.id == report.doctorId);

                            $("#reportTable tbody").append(`
                                <tr>
                                    <td>${report.id}</td>
                                    <td>${report.patient}</td>
                                    <td>${report.diagnosis}</td>
                                    <td>${doctor ? doctor.name : "Not Assigned"}</td>
                                    <td>
                                        <button class="editReport editBtn" data-id="${report.id}">Edit</button>
                                        <button class="deleteReport deleteBtn" data-id="${report.id}">Delete</button>
                                    </td>
                                </tr>
                            `);
                        });
                    }
                });
            }
        });
    }

    $("#reportForm").submit(function (e) {
        e.preventDefault();

        let id = $("#reportId").val();
        let patient = $("#patientName").val();
        let diagnosis = $("#diagnosis").val();
        let doctorId = parseInt($("#assignedDoctor").val());

        if (id) {

            $.ajax({
                url: REPORT_URL + "/" + id,
                type: "PUT", //PUT
                data: JSON.stringify({
                    id: id,
                    patient: patient,
                    diagnosis: diagnosis,
                    doctorId: doctorId
                }),
                contentType: "application/json",
                success: function () {
                    loadReports();
                }
            });

        } else {

            $.ajax({
                url: REPORT_URL,
                type: "POST", //POST
                data: JSON.stringify({
                    patient: patient,
                    diagnosis: diagnosis,
                    doctorId: doctorId
                }),
                contentType: "application/json",
                success: function () {
                    loadReports();
                }
            });
        }

        this.reset();
        $("#reportId").val("");
    });

    $(document).on("click", ".editReport", function () {

        let id = $(this).data("id");

        $.ajax({
            url: REPORT_URL + "/" + id,
            type: "GET", //GET single
            success: function (report) {
                $("#reportId").val(report.id);
                $("#patientName").val(report.patient);
                $("#diagnosis").val(report.diagnosis);
                $("#assignedDoctor").val(report.doctorId);
            }
        });
    });

    $(document).on("click", ".deleteReport", function () {

        let id = $(this).data("id");

        $.ajax({
            url: REPORT_URL + "/" + id,
            type: "DELETE", //DELETE
            success: function () {
                loadReports();
            }
        });
    });

});