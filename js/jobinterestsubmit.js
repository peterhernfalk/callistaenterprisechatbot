(function () {
    'use strict';

    /**
        Formspree do a redirect on common html form submit.
        We want to stay on the same page and thus we need to
        submit an Ajax call instead to Formspree that do not give a
        crap about their redirect thank-you-page.

        For more information: https://formspree.io/
     */
    $("#jobinterestform").submit(function(event) {
        event.preventDefault();

        if (mandatoryFilledForm()) {
            var formData = $("#jobinterestform").serialize();
            $.ajax({
                url: "https://formspree.io/f/xjvpwewp",
                method: "POST",
                data: formData,
                dataType: "json"
            });

            $("#jobinterestform").trigger("reset");

            $(".ce-signup-form-thank-you").css("display", "block");
        }
        return false;
    });

    function formIsEmpty() {
        var contactFilled = $("#contact").val().trim() !== '';
        //var emailFilled = $("#email").val().trim() !== '';
        //var linkedInUrlFilled = $("#linkedin-url").val().trim() !== '';
        //var phoneFilled = $("#phone").val().trim() !== '';
        var extraInfoFilled = $("#extrainfo").val().trim() !== '';

        //return !(contactFilled || emailFilled || linkedInUrlFilled || phoneFilled || extraInfoFilled);
        return !(contactFilled || extraInfoFilled);
    }

    function mandatoryFilledForm() {
        // Check mandatory fields (it suffice with one field to be filled)
        var contactFilled = $("#contact").val().trim() !== '';
        //var emailFilled = $("#email").val().trim() !== '';
        //var linkedInUrlFilled = $("#linkedin-url").val().trim() !== '';
        //var phoneFilled = $("#phone").val().trim() !== '';

        //return !formIsEmpty() && (contactFilled || emailFilled || linkedInUrlFilled || phoneFilled);
        return !formIsEmpty() && contactFilled;
    }

    function updateFormAvailability() {
        if (formIsEmpty()) {
            $("#contact").removeClass("error");
            //$("#email").removeClass("error");
            //$("#linkedin-url").removeClass("error");
            //$("#phone").removeClass("error");
            $("#sendButton").addClass("disabled");
            $("#sendButton").prop('disabled', true);
        } else if (mandatoryFilledForm()) {
            $("#contact").removeClass("error");
            //$("#email").removeClass("error");
            //$("#linkedin-url").removeClass("error");
            //$("#phone").removeClass("error");
            $("#sendButton").removeClass("disabled");
            $("#sendButton").prop('disabled', false);
        } else {
            $("#contact").addClass("error");
            //$("#email").addClass("error");
            //$("#linkedin-url").addClass("error");
            //$("#phone").addClass("error");
            $("#sendButton").addClass("disabled");
            $("#sendButton").prop('disabled', true);
        }
    }

    $("#contact").keyup(function () {
        updateFormAvailability();
    });

/*
    $("#email").keyup(function () {
        updateFormAvailability();
    });

    $("#phone").keyup(function () {
        updateFormAvailability();
    });

    $("#linkedin-url").keyup(function () {
        updateFormAvailability();
    });
*/
    $("#extrainfo").keyup(function () {
        updateFormAvailability();
    });

})();