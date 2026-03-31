$(document).ready(function(){

    // ID Selector
    $("#addBtn").click(function(){

        let name = $("#name").val();
        let age = $("#age").val();
        let disease = $("#disease").val();

        if(name == "" || age == "" || disease == ""){
            alert("All fields required");
            return;
        }

        let row = "<tr class='highlight'>" +
                  "<td>New</td>" +
                  "<td>"+name+"</td>" +
                  "<td>"+age+"</td>" +
                  "<td>"+disease+"</td>" +
                  "</tr>";

        $("#patientTable").append(row);

        // Attribute selector
        $("input[type='text']").css("border","2px solid blue");

        $("#name").val("");
        $("#age").val("");
        $("#disease").val("");
    });


    // Descendant selector + filter
    $("#search").on("keyup", function(){
        let value = $(this).val().toLowerCase();

        $("#patientTable tr").filter(function(){
            $(this).toggle(
                $(this).text().toLowerCase().indexOf(value) > -1
            );
        });
    });


    // Element selector
    $("#hideBtn").click(function(){
        $("table").hide();
    });

    $("#showBtn").click(function(){
        $("table").show();
    });


    // Pseudo selectors
    $("#patientTable").on("click","tr:first",function(){
        $(this).css("font-weight","bold");
    });

    $("#patientTable").on("click","tr:last",function(){
        $(this).css("color","red");
    });

});
