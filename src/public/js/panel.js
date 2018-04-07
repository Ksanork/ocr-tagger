if(typeof dataset_id == "undefined" || typeof sumbittedImages == "undefined" ||
    typeof uploadedImages == "undefined") {
    window.dataset_id = null;
    window.sumbittedImages = 0;
    window.uploadedImages = 0;
}

$(() => {

    // ustawienia usera
    $("#username-wrapper").click(() => {
       $("#user-settings").fadeIn(200);

       $("#logout-btn").click(() => {
           console.log("logout");
          $.post("/logout").done((data) => {
             let json = JSON.parse(data);

              if(json.status == "true") {
                  $("#content-wrapper").fadeOut(300, () => {
                      $("#content-wrapper").html(json.html).fadeIn(300);
                  });
              }

          });
       });

       $("#user-settings").mouseleave(() => {
           $("#user-settings").fadeOut(400);
        });
    });

    initDatasetButtonsEvents();

    $("#add-dataset-btn").click(() => {
        $.post("/open-add-dataset").done((data) => {
            console.log(data);

            let json = JSON.parse(data);

            if($("#white-aside").hasClass("tagging-form"))
                $("#white-aside").removeClass("tagging-form");

            $("#white-aside").html(json.html);
            $("#white-aside").fadeIn(200);
            $("#close-form-button").click(() => {
                $("#white-aside").fadeOut(200);
            });

            dataset_id = null;
            sumbittedImages = 0;
            uploadedImages = 0;

            let fileUploader = $("#fileuploader").uploadFile({
                url: "/add-dataset-image",
                dragDropStr: "<span><b>Przeciągnij i upuść obrazy</b></span>",
                uploadStr:"Dodaj obrazy",
                cancelStr: "Usuń",
                doneStr: "Wysłany",
                sequential:true,
                showFileCounter: true,
                // showPreview:true,
                autoSubmit:false,
                acceptFiles:"image/*",
                dynamicFormData: function() {
                    var data = { dataset_id: dataset_id };
                    return data;
                },

                onSelect: function(files) {
                    sumbittedImages += files.length;
                    $("#form-dataset-count").text(sumbittedImages)
                },

                onSuccess: function(files, data, xhr, pd) {
                    uploadedImages++;
                    let percent = Math.round(uploadedImages/sumbittedImages * 100);
                    $("#black-dialog-desc").text(uploadedImages + " / " + sumbittedImages + " (" + percent + "%)");
                },

                afterUploadAll:function(obj) {
                  $("#white-aside").fadeOut(200, () => {
                      $("#black-dialog").fadeOut(200);

                      refreshDatasets();
                  });
                },

                onCancel: function(files, pd) {
                    // sumbittedImages++;
                    $("#form-dataset-count").text(--sumbittedImages)
                },
            });

            $("#form-dataset-btn").click((event) => {
                event.preventDefault();

                sendDataset(fileUploader);

                // fileUploader.startUpload();
            });
        });
    });
});

function initDatasetButtonsEvents() {
    $(".dataset").each((idx, elem) => {
       $(elem).click(() => {
          console.log("start tagging - " + $(elem).attr("attr-id"));
          startTagging($(elem).attr("attr-id"));
       });
    });
}

// + wyłączyć black-dialog po błędach
function sendDataset(fileUploader) {
    $("#black-dialog.title").text("Trwa dodawanie zbioru danych...");
    $("#black-dialog").fadeIn(200);

    $.post("/add-dataset", {
        name: $("#inputDatasetName").val(),
        desc: $("#inputDatasetDesc").val()
    }).done((data) => {
        let json = JSON.parse(data);

        if(json.status == "true") {
            dataset_id = json.dataset_id;

            fileUploader.startUpload();
        }
    });
}

function closeWhiteDialog() {
    $("#white-aside").fadeOut(200);
    refreshDatasets();
}

function refreshDatasets() {
    console.log("refresh");

    $.post("/get-datasets").done((data) => {
        console.log("get-datasets");
        console.log(data);
        let json = JSON.parse(data);
        $("#datasets").html(json.html);
        initDatasetButtonsEvents();
    });
}

function startTagging(dataset_id) {
    $.post("/get-dataset-image", {
        dataset_id: dataset_id
    }).done((data, status) => {
        console.log(status);
        if(status != "success") {
            closeWhiteDialog();
            return;
        }

        let json = JSON.parse(data);

        console.log(json.html);


        if(!$("#white-aside").hasClass("tagging-form"))
            $("#white-aside").addClass("tagging-form");

        $("#white-aside").html(json.html);

        $("#white-aside").fadeIn(200, () => {
            let img = new Image();
            let parentWidth = $("#white-aside").width() * 0.75;
            let parentHeight = $("#white-aside").height() * 0.75;

            console.log(parentHeight);
            console.log(parentWidth);
            console.log(json.width);
            console.log(json.height);

            if(json.width < json.height) {
                $(img).height(parentHeight);

                // if(json.width > parentWidth)
            }
            else {
                console.log("!");
                console.log(parentWidth * json.width / json.height);
                if((parentWidth * json.width / json.height) > json.height)
                    $(img).height(parentHeight);
                else
                    $(img).width(parentWidth);
                // }
            }
            // });
            img.src = json.src;

            $("#image-wrapper").append(img);
            // $(img).animate({
            //     opacity: 1.0
            // }, 300);
        });

        $("#tagging-submit-btn").click((event) => {
            event.preventDefault();

            $.post("/add-tag", {
                datasetImage_id: $("#tagging-id").val(),
                tag: $("#inputTag").val()
            }).done((data) => {
                if(data == "true") {
                    console.log("Dodanto tag");
                    startTagging(dataset_id);
                }
            });
        });

        $("#close-form-button").click(() => {
            $("#white-aside").fadeOut(200);
            refreshDatasets();
        });
    })
    .fail((data, status) => {
        console.log("fail");
        closeWhiteDialog();
    });
}