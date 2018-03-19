let dataset_id = null;
let sumbittedImages = 0, uploadedImages = 0;

$(() => {
    console.log("initPanel");

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

                showFileCounter: true,
                showPreview:true,
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
    }).done((data) => {
        console.log("ahoj");
        let json = JSON.parse(data);

        if(!$("#white-aside").hasClass("tagging-form"))
            $("#white-aside").addClass("tagging-form");

        $("#white-aside").html(json.html);
        $("#white-aside").fadeIn(200, () => {
            let parentWidth = $("#white-aside").width() * 0.75;
            let parentHeight = $("#white-aside").height() * 0.75;

            if($("#tagging-image").width() < $("#tagging-image").height()) {
                if($("#tagging-image").width() > parentWidth)
                    $("#tagging-image").width(parentWidth);
            }
            else {
                if($("#tagging-image").height() > parentHeight) {
                    $("#tagging-image").height(parentHeight);
                }
            }
        });

        $("#tagging-submit-btn").click((event) => {
            event.preventDefault();

            $.post("/add-tag", {
                datasetImage_id: $("#tagging-id").val(),
                tag: $("#inputTag").val()
            }).done((data) => {
                if(data == "true") {
                    console.log("okkkkkk");
                    startTagging(dataset_id);
                }
            });


        });

        $("#close-form-button").click(() => {
            $("#white-aside").fadeOut(200);
            refreshDatasets();
        });
    });
}