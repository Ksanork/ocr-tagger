$("#login-btn").click((event) => {
   event.preventDefault();

   console.log("send");

    $.post("/login", {
        name: $("#inputLogin").val(),
        password: $("#inputPassword").val()
   }).done((data) => {
       console.log(data);

       let json = JSON.parse(data);
       if(json.status == "true") {
           $("#content-wrapper").fadeOut(300, () => {
               $("#content-wrapper").html(json.html).fadeIn(300);
               // initPanel();
           });
       }
       else {
           $("#bad-loging").fadeIn(300);
       }
   });
});


$("#register-btn").click((event) => {
    event.preventDefault();

    console.log("click");

    if($("#inputRegisterLogin").val() == "" || $("#inputRegisterPassword").val() == "" ||
        $("#inputRegisterPasswordAgain").val()  == "") {
        $("#bad-loging").fadeIn(300);
         $("#error-text").text("Wypełnij wszystkie pola");
         return;
    }

    if($("#inputRegisterPassword").val() != $("#inputRegisterPasswordAgain").val()) {
        $("#bad-loging").fadeIn(300);
        $("#error-text").text("Hasła się nie zgadzają");
        return;
    }

    $.post("/new-register", {
        name: $("#inputRegisterLogin").val(),
        password: $("#inputRegisterPassword").val()
    }).done((data) => {
        console.log(data);

        let json = JSON.parse(data);

        console.log(json.status);
        if(json.status == "user-exists") {
            $("#bad-loging").fadeIn(300);
            $("#error-text").text("Login już zajęty");
            return;
        }
        $("#main-containter").fadeOut(300, () => {
            $("#main-containter").html(json.html).fadeIn(300);
        });

    });
});

// $("#register-open").click((event) => {
//     // event.preventDefault();
//
//     $.post("/open-register").done((data) => {
//         // console.log(data);
//
//         let json = JSON.parse(data);
//         // if(json.status == "true") {
//             $("#login-section").fadeOut(200, () => {
//                 $("#content-wrapper").html(json.html);
//             });
//         // }
//         // else {
//         //     $("#bad-loging").fadeIn(300);
//         // }
//     });
// });