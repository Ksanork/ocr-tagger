"use strict";

var dataset_id = null;
var sumbittedImages = 0,
    uploadedImages = 0;

$(function () {
    console.log("initPanel");

    initDatasetButtonsEvents();

    $("#add-dataset-btn").click(function () {
        $.post("/open-add-dataset").done(function (data) {
            console.log(data);

            var json = JSON.parse(data);

            if ($("#white-aside").hasClass("tagging-form")) $("#white-aside").removeClass("tagging-form");

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
    }).done(function (data) {
        console.log("ahoj");
        var json = JSON.parse(data);

        if (!$("#white-aside").hasClass("tagging-form")) $("#white-aside").addClass("tagging-form");

        $("#white-aside").html(json.html);
        $("#white-aside").fadeIn(200, function () {
            var parentWidth = $("#white-aside").width() * 0.75;
            var parentHeight = $("#white-aside").height() * 0.75;

            if ($("#tagging-image").width() < $("#tagging-image").height()) {
                if ($("#tagging-image").width() > parentWidth) $("#tagging-image").width(parentWidth);
            } else {
                if ($("#tagging-image").height() > parentHeight) {
                    $("#tagging-image").height(parentHeight);
                }
            }
        });

        $("#tagging-submit-btn").click(function (event) {
            event.preventDefault();

            $.post("/add-tag", {
                datasetImage_id: $("#tagging-id").val(),
                tag: $("#inputTag").val()
            }).done(function (data) {
                if (data == "true") {
                    console.log("okkkkkk");
                    startTagging(dataset_id);
                }
            });
        });

        $("#close-form-button").click(function () {
            $("#white-aside").fadeOut(200);
            refreshDatasets();
        });
    });
}
//# sourceMappingURL=panel.js.map