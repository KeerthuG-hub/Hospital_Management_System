$(document).ready(function () {

   
    // INITIAL DATA
    
    if (!localStorage.getItem("doctors")) {
        localStorage.setItem("doctors", JSON.stringify([]));
    }

    if (!localStorage.getItem("reports")) {
        localStorage.setItem("reports", JSON.stringify([]));
    }

    
    // TAB SWITCHING
   
    $("#doctorTab").click(() => {
        $("#doctorSection").show();
        $("#reportSection").hide();
    });

    $("#reportTab").click(() => {
        $("#doctorSection").hide();
        $("#reportSection").show();
        populateDoctorDropdown();
    });

    
    // DOCTOR CRUD
    

    function getDoctors() {   // GET
        return JSON.parse(localStorage.getItem("doctors"));
    }

    function saveDoctors(data) {
        localStorage.setItem("doctors", JSON.stringify(data));
    }

    function loadDoctors() {
        let doctors = getDoctors();
        $("#doctorTable tbody").empty();

        doctors.forEach(doctor => {
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

    loadDoctors();

    // POST & PUT
    $("#doctorForm").submit(function (e) {
        e.preventDefault();

        let doctors = getDoctors();
        let id = $("#doctorId").val();

        if (id) {
            // PUT (Update)
            doctors = doctors.map(d =>
                d.id == id
                    ? { ...d, name: $("#doctorName").val(), specialization: $("#specialization").val() }
                    : d
            );
        } else {
            // POST (Create)
            doctors.push({
                id: Date.now(),
                name: $("#doctorName").val(),
                specialization: $("#specialization").val()
            });
        }

        saveDoctors(doctors);
        this.reset();
        $("#doctorId").val("");
        loadDoctors();
        populateDoctorDropdown();
    });

    // DELETE
    $(document).on("click", ".deleteDoctor", function () {
        let id = $(this).data("id");
        let doctors = getDoctors().filter(d => d.id != id);
        saveDoctors(doctors);
        loadDoctors();
        populateDoctorDropdown();
    });

    // EDIT
    $(document).on("click", ".editDoctor", function () {
        let id = $(this).data("id");
        let doctor = getDoctors().find(d => d.id == id);

        $("#doctorId").val(doctor.id);
        $("#doctorName").val(doctor.name);
        $("#specialization").val(doctor.specialization);
    });

    
    // REPORT CRUD
   

    function getReports() {   // GET
        return JSON.parse(localStorage.getItem("reports"));
    }

    function saveReports(data) {
        localStorage.setItem("reports", JSON.stringify(data));
    }

    function populateDoctorDropdown() {
        let doctors = getDoctors();
        $("#assignedDoctor").empty().append(`<option value="">Select Doctor</option>`);

        doctors.forEach(d => {
            $("#assignedDoctor").append(`<option value="${d.id}">${d.name}</option>`);
        });
    }

    function loadReports() {
        let reports = getReports();
        let doctors = getDoctors();

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

    loadReports();

    // POST & PUT
    $("#reportForm").submit(function (e) {
        e.preventDefault();

        let reports = getReports();
        let id = $("#reportId").val();

        if (id) {
            // PUT
            reports = reports.map(r =>
                r.id == id
                    ? {
                        ...r,
                        patient: $("#patientName").val(),
                        diagnosis: $("#diagnosis").val(),
                        doctorId: parseInt($("#assignedDoctor").val())
                    }
                    : r
            );
        } else {
            // POST
            reports.push({
                id: Date.now(),
                patient: $("#patientName").val(),
                diagnosis: $("#diagnosis").val(),
                doctorId: parseInt($("#assignedDoctor").val())
            });
        }

        saveReports(reports);
        this.reset();
        $("#reportId").val("");
        loadReports();
    });

    // DELETE
    $(document).on("click", ".deleteReport", function () {
        let id = $(this).data("id");
        let reports = getReports().filter(r => r.id != id);
        saveReports(reports);
        loadReports();
    });

    // EDIT
    $(document).on("click", ".editReport", function () {
        let id = $(this).data("id");
        let report = getReports().find(r => r.id == id);

        $("#reportId").val(report.id);
        $("#patientName").val(report.patient);
        $("#diagnosis").val(report.diagnosis);
        $("#assignedDoctor").val(report.doctorId);
    });

});