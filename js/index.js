/**
 * Created by Edwin on 15-3-2016.
 */


$( document ).ready(function() {
    console.log( "ready!" );

    // navigation switch
    $("nav ul li").click(function(){
        $("section.s-h").css("display", "none");
        $($(this).data("target")).css("display", "block");
    });

    // color preview div change color on selected
    $("#colorSelect").change(function () {
        switch($("#colorSelect").children("option").filter(":selected").text()) {
            case "red":
                $("#colorPreview").css("background-color", "red");
                break;
            case "blue":
                $("#colorPreview").css("background-color", "blue");
                break;
            case "yellow":
                $("#colorPreview").css("background-color", "yellow");
                break;
            case "green":
                $("#colorPreview").css("background-color", "green");
                break;
            default:
                "gray"
                $("#colorPreview").css("background-color", "gray");
        }

    });




    });


