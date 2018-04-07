"use strict";

if (typeof dataset_id == "undefined" || typeof sumbittedImages == "undefined" || typeof uploadedImages == "undefined") {
    window.dataset_id = null;
    window.sumbittedImages = 0;
    window.uploadedImages = 0;
}

$(function () {

    // ustawienia usera
    $("#username-wrapper").click(function () {
        $("#user-settings").fadeIn(200);

        $("#logout-btn").click(function () {
            console.log("logout");
            $.post("/logout").done(function (data) {
                var json = JSON.parse(data);

                if (json.status == "true") {
                    $("#content-wrapper").fadeOut(300, function () {
                        $("#content-wrapper").html(json.html).fadeIn(300);
                    });
                }
            });
        });

        $("#user-settings").mouseleave(function () {
            $("#user-settings").fadeOut(400);
        });
    });

    initDatasetButtonsEvents();

    // obsługa dodawania datasetu
    $("#add-dataset-btn").click(function () {
        $.post("/open-add-dataset").done(function (data) {
            console.log(data);

            var json = JSON.parse(data);

            if ($("#white-aside").hasClass("tagging-form")) $("#white-aside").removeClass("tagging-form");

            if (!$("#white-aside").hasClass("add-form")) $("#white-aside").addClass("add-form");

            $("#white-aside").html(json.html);
            $("#white-aside").fadeIn(200);
            $("#close-form-button").click(function () {
                $("#white-aside").fadeOut(200);
            });

            dataset_id = null;
            sumbittedImages = 0;
            uploadedImages = 0;

            var fileUploader = $("#fileuploader").uploadFile({
                url: "/add-dataset-image",
                dragDropStr: "<span><b>Przeciągnij i upuść obrazy</b></span>",
                uploadStr: "Dodaj obrazy",
                cancelStr: "Usuń",
                doneStr: "Wysłany",
                sequential: true,
                showFileCounter: true,
                // showPreview:true,
                autoSubmit: false,
                acceptFiles: "image/*",
                dynamicFormData: function dynamicFormData() {
                    var data = { dataset_id: dataset_id };
                    return data;
                },

                onSelect: function onSelect(files) {
                    sumbittedImages += files.length;
                    $("#form-dataset-count").text(sumbittedImages);
                },

                onSuccess: function onSuccess(files, data, xhr, pd) {
                    uploadedImages++;
                    var percent = Math.round(uploadedImages / sumbittedImages * 100);
                    $("#black-dialog-desc").text(uploadedImages + " / " + sumbittedImages + " (" + percent + "%)");
                },

                afterUploadAll: function afterUploadAll(obj) {
                    $("#white-aside").fadeOut(200, function () {
                        $("#black-dialog").fadeOut(200);

                        refreshDatasets();
                    });
                },

                onCancel: function onCancel(files, pd) {
                    // sumbittedImages++;
                    $("#form-dataset-count").text(--sumbittedImages);
                }
            });

            $("#form-dataset-btn").click(function (event) {
                event.preventDefault();

                sendDataset(fileUploader);

                // fileUploader.startUpload();
            });
        });
    });
});

function initDatasetButtonsEvents() {
    $(".dataset").each(function (idx, elem) {
        $(elem).click(function () {
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
    }).done(function (data) {
        var json = JSON.parse(data);

        if (json.status == "true") {
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

    $.post("/get-datasets").done(function (data) {
        console.log("get-datasets");
        console.log(data);
        var json = JSON.parse(data);
        $("#datasets").html(json.html);
        initDatasetButtonsEvents();
    });
}

function startTagging(dataset_id) {
    $.post("/get-dataset-image", {
        dataset_id: dataset_id
    }).done(function (data, status) {
        console.log(status);
        if (status != "success") {
            closeWhiteDialog();
            return;
        }

        var json = JSON.parse(data);

        if (!$("#white-aside").hasClass("tagging-form")) $("#white-aside").addClass("tagging-form");

        if ($("#white-aside").hasClass("add-form")) $("#white-aside").removeClass("add-form");

        $("#white-aside").html(json.html);

        // otwieranie okna i dopasowanie obrazu
        $("#white-aside").fadeIn(200, function () {
            var img = new Image();
            var parentWidth = $("#white-aside").width() * 0.75;
            var parentHeight = $("#white-aside").height() * 0.75;

            console.log(parentHeight);
            console.log(parentWidth);
            console.log(json.width);
            console.log(json.height);

            if (json.width < json.height) {
                $(img).height(parentHeight);
            } else {
                console.log(parentWidth * json.width / json.height);
                if (parentWidth * json.width / json.height > json.height) $(img).height(parentHeight);else $(img).width(parentWidth);
            }
            img.src = json.src;

            $("#image-wrapper").append(img);
            $("#inputTag").focus();
        });

        // obsługa przycisków zgłaszajacych problemy
        $(".green-problem-button").each(function (idx, elem) {
            $(elem).click(function () {
                $.post("/add-problem", {
                    datasetImage_id: $("#tagging-id").val(),
                    problem_id: $(elem).attr("attr-id")
                }).done(function (data) {
                    if (data == "true") {
                        console.log("Dodanto problem");
                        startTagging(dataset_id);
                    }
                });
            });
        });

        // obsługa przycisku dodawania tagu
        $("#tagging-submit-btn").click(function (event) {
            event.preventDefault();

            $.post("/add-tag", {
                datasetImage_id: $("#tagging-id").val(),
                tag: $("#inputTag").val()
            }).done(function (data) {
                if (data == "true") {
                    console.log("Dodanto tag");
                    startTagging(dataset_id);
                }
            });
        });

        // obsługa zamknięcia okna
        $("#close-form-button").click(function () {
            $("#white-aside").fadeOut(200);
            refreshDatasets();
        });
    }).fail(function (data, status) {
        console.log("fail");
        closeWhiteDialog();
    });
}
//# sourceMappingURL=panel.js.map