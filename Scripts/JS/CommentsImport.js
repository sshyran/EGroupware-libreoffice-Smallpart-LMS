function FunkHideForCallCommentsImport() {
    $('.DisableAfterSaveInput, .DisableAfterSaveInputTop').prop('disabled', true).hide()
    $('#SaveToDbAndPlay').hide()
    $('#DropAndPlay').hide()
    $('#EditCommentAndPlay').hide()
    // $('#DeleteCommentAndPlay').hide()
    $('#UndeleteCommentAndPlay').hide()
    $('.containerRadioButton').hide()
    $('#InputVideoComment').hide()
    $('#KillCommentsAndPlayAdmin').show().prop('disabled', true)

    $('#CommentsShowArea').empty()
}

function FunkCallCommentsImportAdmin(AjaxGet) {
    // alert(arguments.callee.name +" - "+ AjaxGet.FunktionFinished)
    // if (AjaxGet.FunktionFinished) {
    //     AjaxGet.FunktionFinished = false;

    var StopTime = Math.round($('#' + AjaxGet.VideoElementId).get(0).currentTime)
    var $AddedComment = $('#InputVideoComment').val()


    var ArraySavedInput = {
        VideoElementId: AjaxGet.VideoElementId,
        StopTime: StopTime,
        KursID: AjaxGet.KursID
    }


    $('.DisableAfterSaveInput').prop('disabled', true)
    $('#SaveToDbAndPlay').hide()
    $('.DisableAfterSaveInput').hide()
    $('#DropAndPlay').hide()
    $('#EditCommentAndPlay').hide()
    $('#DeleteCommentAndPlay').hide()
    $('#UndeleteCommentAndPlay').hide()
    $('.containerRadioButton').hide()
    $('#InputVideoComment').hide()


    $('#CommentsShowArea').empty()

    // $("#VideobarStudent").empty();
    // $("#VideobarExpert").empty();


    AjaxSend('database/DbInteraktion.php', {
        DbRequest: 'Select',
        DbRequestVariation: 'FunkShowCommentsAdmin',
        AjaxDataToSend: ArraySavedInput
    }, 'FunkShowComments')

    $('#KillCommentsAndPlayAdmin').on('click', function () {
        FunkVideoPlayPause(AjaxGet)
    })
}

function FunkShowComments(AjaxGet) {


    var DivToAddInTo = $("#CommentsShowArea");

    // var CommentsBoxTitle = $('<div class="CommentsBoxTitle"><u>' + AjaxGet.CommentsTimePoint + '</u></div>');
    var CommentsBoxTitle = $('<div class="CommentsBoxTitle StandartTextH1"></div>');
    var $AddingContentTopBox = $('<div class="CommentsTopBox"></div>');
    var CommentsBoxComments = $('<div id="CommentsBoxComments" class="StandartTextKomments"></div>');
    var SavedCommentsContents = AjaxGet.ShowSavedComments;
    var ShowUserNameList = AjaxGet.ShowUserNameList;
    var AllowdToSeeNames = false
    var IndexNicknameUserNameList = [];
    var NicknameUserNameList = [];
    var SelectNicknameUserNameListOptios = '';
    var NicknameAddedCommentOrRetweet = [];
    var MarkedAreaColorFromDB = [];
    var MarkedAreaFromDB = [];
    var MarkedAreaExistOrNot = '';
    let vid = $("#" + AjaxGet.VideoElementId).get(0);
    let barStudent = $("#VideobarStudent");
    // let barExpert = $("#VideobarExpert");
    var VideoPausiertOnMouseover = false;

    //var EditCommentsClicked = false;

    if (AjaxGet.Superadmin == '1' || AjaxGet.UserId == AjaxGet.AllowdToSeeNames[0].KursOwner) {
        AllowdToSeeNames = true;

        for (i in ShowUserNameList) {
            IndexNicknameUserNameList[i] = [ShowUserNameList[i].nickname, ShowUserNameList[i].nachname, ShowUserNameList[i].id];
            //This User added Comment or Retweet
            NicknameAddedCommentOrRetweet[ShowUserNameList[i].nickname] = {addedComment: 0, retweet: 0}

            NicknameUserNameList[ShowUserNameList[i].nickname] = "<div style='border: 1px dotted #1C6EA4; border-radius: 4px; padding: 2px'><b><u></u></b> " + ShowUserNameList[i].nachname + ", " + ShowUserNameList[i].vorname + "</div>"

        }
    } else {

        for (i in ShowUserNameList) {
            IndexNicknameUserNameList[i] = [ShowUserNameList[i].nickname, ShowUserNameList[i].nachname];
            NicknameAddedCommentOrRetweet[ShowUserNameList[i].nickname] = {addedComment: 0, retweet: 0}

            NicknameUserNameList[ShowUserNameList[i].nickname] = ""

        }
    }


    function FunkCommetarinhalteschleife(Videozeit, Return_ture_false) {


        // For-in-Schleife
        var CommentNumber = 0;
        var CommentsVorVideozeit = "";
        var CommentsVideozeitPlus = "";
        var CommentsVideozeit = "";
        var CommentsText = "";
        var Comments = "";
        var TimeBarStudentMarks = "";
        var ParrentI = '';
        var tabing = ""
        var RetweetOwner = "";
        var JumpingArray = false;
        $AddedCommentFromDB = [];

        Comments += "<div id='CommentsBox'>"
        for (i in SavedCommentsContents) {
            // User added Comments

            NicknameAddedCommentOrRetweet[SavedCommentsContents[i].UserNickname].addedComment += 1;


            // Farben namen geben:
            switch (SavedCommentsContents[i].AmpelColor.toLowerCase()) {
                case "ff0000":
                    SavedCommentsContents[i].AmpelColorName = "Rot negativ";
                    break;
                case "00ff00":
                    SavedCommentsContents[i].AmpelColorName = "Grün positiv";
                    break;
                case "ffffff":
                    SavedCommentsContents[i].AmpelColorName = "Weiß neutral";
                    break;
            }

            // Saving Markesarea Color
            MarkedAreaColorFromDB[i] = SavedCommentsContents[i].MarkedAreaColor;
            // Saving Markesarea Color
            MarkedAreaFromDB[i] = SavedCommentsContents[i].MarkedArea;

            // Check if MarkedArea is used
            if (jQuery.inArray('1', MarkedAreaFromDB[i]) !== -1) {
                MarkedAreaExistOrNot = '<span class="glyphicon glyphicon-film MarkedAreaExistOrNot" aria-hidden="true" "></span>';
            } else {
                // MarkedAreaExistOrNot += '<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>';
                // MarkedAreaExistOrNot += '<span class="glyphicon glyphicon-retweet" aria-hidden="true"></span>';
                MarkedAreaExistOrNot = '';
            }

            // Search for User in Comments
            if (AjaxGet.CommentAmpelColorChoice && AjaxGet.CommentAmpelColorChoice != '') {
                if (AjaxGet.CommentAmpelColorChoice != SavedCommentsContents[i].AmpelColor) {
                    continue;
                }
            }

            // Search for Colors in Comments
            if (AjaxGet.SelectNicknameUserNameList && AjaxGet.SelectNicknameUserNameList != '') {
                var CommentSearchChoiceExist = 0;

                for (ii in SavedCommentsContents[i]) {

                    if (IsJsonString(SavedCommentsContents[i][ii])) {
                        var $AddedCommentFromDBIsObject = jQuery.parseJSON(SavedCommentsContents[i][ii]);
                        for (iii in $AddedCommentFromDBIsObject) {

                            if ($AddedCommentFromDBIsObject[iii] && $AddedCommentFromDBIsObject[iii].toLowerCase().includes(AjaxGet.SelectNicknameUserNameList.toLowerCase())) {
                                CommentSearchChoiceExist++;

                            }
                        }

                    } else {
                        if (SavedCommentsContents[i][ii].toLowerCase().includes(AjaxGet.SelectNicknameUserNameList.toLowerCase())) {
                            CommentSearchChoiceExist++;
                        }
                    }
                }
                if (CommentSearchChoiceExist == 0) {

                    continue;
                }
            }

            // Search for word in Comments
            if (AjaxGet.CommentSearchChoice) {
                var CommentSearchChoiceExist = 0;

                for (ii in SavedCommentsContents[i]) {
                    if (IsJsonString(SavedCommentsContents[i][ii])) {
                        var $AddedCommentFromDBIsObject = jQuery.parseJSON(SavedCommentsContents[i][ii]);
                        for (iii in $AddedCommentFromDBIsObject) {
                            if ($AddedCommentFromDBIsObject[iii] && $AddedCommentFromDBIsObject[iii].toLowerCase().includes(AjaxGet.CommentSearchChoice.toLowerCase())) {
                                CommentSearchChoiceExist++;
                            }
                        }

                    } else {
                        if (SavedCommentsContents[i][ii].toLowerCase().includes(AjaxGet.CommentSearchChoice.toLowerCase())) {
                            CommentSearchChoiceExist++;
                        }
                    }
                }
                // }

                if (CommentSearchChoiceExist == 0) {
                    continue;
                }
            }

            // place results on Studetbar and Expertbar

            TimeBarStudentMarks += '<span class="NewCommentTimeBarStuentMarker TimeClass' + SavedCommentsContents[i].StartTime + ' " style="background-color: #' + SavedCommentsContents[i].AmpelColor + '; left: ' + (SavedCommentsContents[i].StartTime / vid.duration * AjaxGet.VideoWidth) + 'px; z-index: 1000; position: absolute; "></span>'


            //Aufbau Comments
            CommentNumber++ //Damit die  Nummerierung der Kommentare nicht bei 0 sondern 1 beginnt
            var CommentsStartTime = new Date(null);
            CommentsStartTime.setSeconds(parseInt(SavedCommentsContents[i].StartTime)); // specify value for SECONDS here
            var CommentsStartTimeDone = CommentsStartTime.toISOString().substr(11, 8)
            if (SavedCommentsContents[i].StartTime <= (Math.ceil(Videozeit) - 2)) {
                // ComentarBox
                CommentsVorVideozeit += "<div id='" + i + "__CommentInputBox' class='CommentsVorVideozeit CommentInputBox'>"
                // Comentarinfos

                CommentsVorVideozeit += "<div class='CommentsInfo'>"
                CommentsVorVideozeit += MarkedAreaExistOrNot
                CommentsVorVideozeit += "<span class='glyphicon glyphicon-bookmark CommentsMarkedColor' style='color:#" + SavedCommentsContents[i].AmpelColor + ";' ></span>";
                CommentsVorVideozeit += "<b>Kommentar</b> " + CommentNumber + ": "
                CommentsVorVideozeit += "<br><b>ID:</b> " + SavedCommentsContents[i].ID
                CommentsVorVideozeit += "<br><b>Zeit:</b> " + CommentsStartTimeDone

                //------


                // if ((AjaxGet.UserId == SavedCommentsContents[i].UserID && SavedCommentsContents[i].Deleted == 0) || AjaxGet.UserRole == 'Admin') {
                if ((AjaxGet.UserId == SavedCommentsContents[i].UserID) || AjaxGet.UserRole == 'Admin') {
                    CommentsVorVideozeit += '&nbsp; &nbsp;  <a href="#" id="' + i + '__EditCommentsIcon_Top" class="EditComments_Top"><span id="' + i + '__EditCommentsIcon" class="glyphicon glyphicon-pencil EditComments"></span></a>'

                }

                //----------
                CommentsVorVideozeit += "<br><b>Name:</b> " + SavedCommentsContents[i].UserNickname

                // if (AllowdToSeeNames) {
                CommentsVorVideozeit += "<br>" + NicknameUserNameList[SavedCommentsContents[i].UserNickname]
                // }

                CommentsVorVideozeit += " </div>"
                // Comentarvalues

                if (SavedCommentsContents[i].Deleted == '1') {
                    CommentsVorVideozeit += "<div class='CommentsValues' id='" + i + "__CommentsValues'>" +
                        " - gelöscht - "
                } else {

                    if (IsJsonString(SavedCommentsContents[i].AddedComment)) {
                        $AddedCommentFromDB = jQuery.parseJSON(SavedCommentsContents[i].AddedComment);
                        ParrentI = i;
                        CommentsVorVideozeit += "<div class='CommentsValues' id='" + ParrentI + "__CommentsValues'>"
                        tabing = ""
                        RetweetOwner = "";
                        JumpingArray = false;
                        var RetweetIDNumberPre=0;
                        for (i in $AddedCommentFromDB) {

                            if (JumpingArray) {
                                tabing += "&nbsp;&nbsp;&nbsp;&nbsp;"
                                RetweetOwner = "<span class='glyphicon glyphicon-arrow-right' aria-hidden='true' style='padding: 0 5px 0 5px;'> </span>" + $AddedCommentFromDB[i] + " ) ";
                                JumpingArray = false;
                                // User added retweet
                                if($AddedCommentFromDB[i]){
                                    NicknameAddedCommentOrRetweet[$AddedCommentFromDB[i]].retweet += 1;
                                }

                            } else {
                                CommentsVorVideozeit += "<div class='CommentsValuesSub' id='" + ParrentI + "-" + RetweetIDNumberPre + "__CommentsValuesSubs'><p class='CommentsValuesSubComments'>" + tabing + RetweetOwner + $AddedCommentFromDB[i] + "</p>"

                                CommentsVorVideozeit += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
                                JumpingArray = true;
                                RetweetIDNumberPre++
                            }
                        }
                        CommentsVorVideozeit += '<a href="#" id="' + ParrentI + '__RetweetCommentsIcon_Top" class="RetweetComments_Top" >'


                        CommentsVorVideozeit += '<span id="' + ParrentI + '-' + i + '__RetweetCommentsIcon" class="glyphicon glyphicon-retweet RetweetComments"</span></a>';
                        CommentsVorVideozeit += "</div>"
                    } else {
                        CommentsVorVideozeit += "<div class='CommentsValues' id='" + i + "__CommentsValues' > " + SavedCommentsContents[i].AddedComment+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

                        CommentsVorVideozeit += '<a href="#" id="' + ParrentI + '__RetweetCommentsIcon_Top" class="RetweetComments_Top" >'


                        CommentsVorVideozeit += '<span id="' + ParrentI + '-' + i + '__RetweetCommentsIcon" class="glyphicon glyphicon-retweet RetweetComments"</span></a>';

                        CommentsVorVideozeit += "</div>"
                    }


                }

                CommentsVorVideozeit += "</div>"


            } else {


                if (SavedCommentsContents[i].StartTime <= (Math.ceil(Videozeit) + 1) && SavedCommentsContents[i].StartTime >= (Math.ceil(Videozeit) - 1)) {
                    CommentsText = ''
                } else {
                    CommentsText = ''
                }

                // ComentarBox
                CommentsVideozeitPlus += "<div id='" + i + "__CommentInputBox' class='CommentsVideozeitPlus CommentInputBox' style='" + CommentsText + "'>"
                // Comentarinfos
                // CommentsVideozeitPlus += "<div class='CommentsInfo' style='background-color:#" + SavedCommentsContents[i].AmpelColor + ";'>"
                CommentsVideozeitPlus += "<div class='CommentsInfo'>"
                CommentsVideozeitPlus += MarkedAreaExistOrNot
                CommentsVideozeitPlus += "<span class='glyphicon glyphicon-bookmark CommentsMarkedColor' style='color:#" + SavedCommentsContents[i].AmpelColor + ";' ></span>";
                CommentsVideozeitPlus += "<b>Kommentar</b> " + CommentNumber + ": "
                CommentsVideozeitPlus += "<br><b>ID:</b> " + SavedCommentsContents[i].ID
                CommentsVideozeitPlus += "<br><b>Zeit:</b> " + CommentsStartTimeDone

                //------
                // if ((AjaxGet.UserId == SavedCommentsContents[i].UserID || AjaxGet.UserRole == 'Admin') && SavedCommentsContents[i].Deleted==0)

                // if ((AjaxGet.UserId == SavedCommentsContents[i].UserID && SavedCommentsContents[i].Deleted == 0) || AjaxGet.UserRole == 'Admin') {
                if ((AjaxGet.UserId == SavedCommentsContents[i].UserID) || AjaxGet.UserRole == 'Admin') {
                    // alert(AjaxGet.UserId + "==" + SavedCommentsContents[i].UserID)

                    CommentsVideozeitPlus += '&nbsp; &nbsp;  <a href="#" id="' + i + '__EditCommentsIcon_Top" class="EditComments_Top"><span id="' + i + '__EditCommentsIcon" class="glyphicon glyphicon-pencil EditComments"></span></a>'
                }


                //----------

                CommentsVideozeitPlus += "<br><b>Name:</b> " + SavedCommentsContents[i].UserNickname

                // if (AllowdToSeeNames) {
                CommentsVideozeitPlus += "<br>" + NicknameUserNameList[SavedCommentsContents[i].UserNickname]
                // }

                CommentsVideozeitPlus += "</div>"

                // Comentarvalues

                if (SavedCommentsContents[i].Deleted == 1) {
                    CommentsVideozeitPlus += "<div class='CommentsValues' id='" + i + "__CommentsValues' > " +
                        "- gelöscht - "
                    CommentsVideozeitPlus += "</div>"
                } else {


                    if (IsJsonString(SavedCommentsContents[i].AddedComment)) {
                        // var $AddedCommentFromDB = SavedCommentsContents[i].AddedComment;
                        $AddedCommentFromDB = jQuery.parseJSON(SavedCommentsContents[i].AddedComment);

                        ParrentI = i;
                        CommentsVideozeitPlus += "<div class='CommentsValues' id='" + ParrentI + "__CommentsValues'>"
                        tabing = ""
                        RetweetOwner = "";
                        JumpingArray = false;
                        var RetweetIDNumber=0;
                        for (i in $AddedCommentFromDB) {
                            if (JumpingArray) {
                                tabing += "&nbsp;&nbsp;&nbsp;&nbsp;"
                                RetweetOwner = "<span class='glyphicon glyphicon-arrow-right' aria-hidden='true' style='padding: 0 5px 0 5px;'></span>" + $AddedCommentFromDB[i] + ") ";
                                JumpingArray = false;
                                // User added retweet
                                if($AddedCommentFromDB[i]){
                                    NicknameAddedCommentOrRetweet[$AddedCommentFromDB[i]].retweet += 1;
                                }
                            } else {
                                CommentsVideozeitPlus += "<div class='CommentsValuesSub' id='" + ParrentI + "-" + RetweetIDNumber + "__CommentsValuesSubs'><p class='CommentsValuesSubComments'>" + tabing + RetweetOwner + $AddedCommentFromDB[i] + "</p>"

                                CommentsVideozeitPlus += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
                                JumpingArray = true;
                                RetweetIDNumber++
                            }
                        }
                        CommentsVideozeitPlus += '<a href="#" id="' + ParrentI + '__RetweetCommentsIcon_Top" class="RetweetComments_Top" >'


                        CommentsVideozeitPlus += '<span id="' + ParrentI + '-' + i + '__RetweetCommentsIcon" class="glyphicon glyphicon-retweet RetweetComments"</span></a>';
                        CommentsVideozeitPlus += "</div>"
                    } else {
                        CommentsVideozeitPlus += "<div class='CommentsValues' id='" + i + "__CommentsValues' > " + SavedCommentsContents[i].AddedComment + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

                        CommentsVideozeitPlus += '<a href="#" id="' + ParrentI + '__RetweetCommentsIcon_Top" class="RetweetComments_Top" >'


                        CommentsVideozeitPlus += '<span id="' + ParrentI + '-' + i + '__RetweetCommentsIcon" class="glyphicon glyphicon-retweet RetweetComments"</span></a>';

                        CommentsVideozeitPlus += "</div>"
                    }

                }
                CommentsVideozeitPlus += "</div>"


            }


        }

        // Comments += CommentsVorVideozeit
        Comments += "<div id='CommentsVorVideozeitTop'>" + CommentsVorVideozeit + "</div>";
        Comments += CommentsVideozeitPlus;
        Comments += "</div>";

        CommentsBoxComments.empty();
        CommentsBoxComments.append(Comments);


        //Choose if Comment to show or edit on Click
        $(".CommentInputBox").on("click", function (e) {
            vid.pause();
            $('#DeleteCommentConfirm').remove()
            //extractin Comment_ID in AjaxGet out of Node-ID
            var Comment_ID = $(this).attr("id");
            var lastword = Comment_ID.lastIndexOf("__");
            Comment_ID = Comment_ID.substring(0, lastword);

            AjaxGet.Comment_DB_ID = SavedCommentsContents[Comment_ID].ID;
            AjaxGet.MarkedAreaColorFromDBbyID = MarkedAreaColorFromDB[Comment_ID];

            // var DeletedComment = SavedCommentsContents[Comment_ID].Deleted
            var DeletedComment = 0;


            //EditCommentsClicked = true;
            FunkKillFunctionalityOverlay(AjaxGet)
            // $('#SearchMarkedArea').toggle();
            if (!$("#" + AjaxGet.VideoElementId + "FunkVideoPlayPause").is(":hidden")) {
                $($("#" + AjaxGet.VideoElementId + "FunkVideoPlayPause")).hide();
            }
            FunkAmpelFunktion(AjaxGet);
            var EditIsClicked = e.target.className
            if ($(e.target).hasClass('EditComments')) {
                FunkEditComments(AjaxGet, Comment_ID, DeletedComment)
            } else if ($(e.target).hasClass('RetweetComments')) {
                FunkRetweetthisComment(AjaxGet, Comment_ID, DeletedComment)
            } else {
                FunkShowthisComment(AjaxGet, Comment_ID, DeletedComment)
            }


        })

        if (Return_ture_false) {
            return TimeBarStudentMarks
        }
    }

    DivToAddInTo.empty();
    DivToAddInTo.append($AddingContentTopBox);
    $AddingContentTopBox.append(CommentsBoxTitle);
    $AddingContentTopBox.after(CommentsBoxComments);


    $('.CommentsBoxTitle').html('Alle Kommentare:')

    $('#KillCommentsAndPlayAdmin').show().prop('disabled', false)


    barStudent.empty()

    barStudent.append(FunkCommetarinhalteschleife(vid.currentTime, true));

    var z = 0;
    for (z = 0; z < vid.duration; z++) {
        if ($('.TimeClass' + z).length > 1) {
            $('.TimeClass' + z).css('background-color', '').addClass('CommentTimeBarStuentMultimarks')
        }
    }

    $('#SelectMarkedAreaTypeInput').html(
        '<option value="">Alle</option>' +
        '<option value="ff0000">Negativ</option>' +
        '<option value="00ff00">Positiv</option>' +
        '<option value="ffffff">Neutral</option>'
    )

    var participantsnumberInKurs = '';
    var participantsnumber = 0;
    var Notpaticipating = '';
    var participantsWithoutSuperAdmin = 0;

    if (AllowdToSeeNames) {

        for (i in ShowUserNameList) {

            // User added comment or retweet
            var participated = NicknameAddedCommentOrRetweet[ShowUserNameList[i].nickname]

            if (participated.addedComment == 0 && participated.retweet == 0) {

                if (ShowUserNameList[i].id == AjaxGet.AllowdToSeeNames[0].KursOwner) {
                    continue
                }
                if (ShowUserNameList[i].id == '19') {
                    participantsWithoutSuperAdmin++
                    continue
                }
                Notpaticipating += '<option value="' + ShowUserNameList[i].nickname + '">' + ShowUserNameList[i].nachname + ', ' + ShowUserNameList[i].vorname + ' {&nbsp;' + ShowUserNameList[i].nickname + ' }</option>'
                continue
            }

            participantsnumber++

            var CommentAndRetweets = '( K: ' + participated.addedComment + ' | R: ' + participated.retweet + ' )'

            SelectNicknameUserNameListOptios += '<option value="' + ShowUserNameList[i].nickname + '">' + ShowUserNameList[i].nachname + ', ' + ShowUserNameList[i].vorname + ' :&nbsp;&nbsp; ' + CommentAndRetweets + ' &nbsp;&nbsp;&nbsp;{&nbsp;' + ShowUserNameList[i].nickname + ' }</option>'

        }

        var TotalParticipants = parseInt(i) +1 ;

        participantsnumberInKurs = '(' + participantsnumber + '/' + TotalParticipants + ')'



    } else {

        for (i in ShowUserNameList) {

            // User added comment or retweet
            var participated = NicknameAddedCommentOrRetweet[ShowUserNameList[i].nickname]
            if (participated.addedComment == 0 && participated.retweet == 0) {
                continue
            }

            participantsnumber++


            SelectNicknameUserNameListOptios += '<option value="' + ShowUserNameList[i].nickname + '">' + ShowUserNameList[i].nickname + '</option>'

        }

        participantsnumberInKurs = participantsnumber
    }


    $('#SearchMarkedAreaMid').empty().html("<div id='SelectNicknameUserNameListSelection' class='SearchMarkedAreaElements'>" +
        '<span class="SearchMarkedAreaElements">' +
        participantsnumberInKurs +
        ' Teilnehmende:' +
        '</span>' +
        '<select name="SelectNicknameUserNameList" id="SelectNicknameUserNameList" class="SearchMarkedAreaElements">' +
        '<option value="" selected hidden>-Alle Teilnehmenden-</option>'
        + SelectNicknameUserNameListOptios +
        '</select>' +
        '<button id="SelectNicknameUserNameListReset"><span class="glyphicon glyphicon-repeat flipped-glyphicon"  aria-hidden="true"></span></button>' +
        '</div>')

    $('#SearchMarkedAreaDown').empty().html("<div id='SelectNicknameUserNameListNotpaticipating' class='SearchMarkedAreaElements'>" +
        '<select name="SelectNotpaticipating" id="SelectNotpaticipating" class="SearchMarkedAreaElements">' +
        '<option value="" selected hidden>- Ohne Kommentareintrag (ausgenommen Kursersteller*in) -</option>'
        + Notpaticipating +
        '</select></div>')

    $('#SelectNotpaticipating').on('change', function () {
        $(this).get(0).selectedIndex = 0;

    })

    $(function () {
        // choose target dropdown
        var select = $('#SelectNicknameUserNameList');
        select.html(select.find('option').sort(function (x, y) {
            // to change to descending order switch "<" for ">"

            return $(x).text() > $(y).text() ? 1 : -1;

        }));

        // select default item after sorting (first item)
        $('#SelectNicknameUserNameList').get(0).selectedIndex = 0;
    });

    //Filter
    $('#SelectMarkedAreaTypeInput').on("change", function () {
        AjaxGet.CommentAmpelColorChoice = $(this).val().toLowerCase();
        AjaxGet.CommentSearchChoice = $('#SearchMarkedAreaInput').val();
        // FunkCommetarinhalteschleife(vid.currentTime, true);
        barStudent.empty()
        barStudent.append(FunkCommetarinhalteschleife(vid.currentTime, true));

    })

    //Teilnehmer Suche
    $('#SelectNicknameUserNameList').on("change", function () {
        AjaxGet.SelectNicknameUserNameList = $(this).val().toLowerCase();
        AjaxGet.CommentSearchChoice = $('#SearchMarkedAreaInput').val();
        // FunkCommetarinhalteschleife(vid.currentTime, true);
        barStudent.empty()
        barStudent.append(FunkCommetarinhalteschleife(vid.currentTime, true));

    })

    //Teilnehmer Suche Reset
    $('#SelectNicknameUserNameListReset').on("click", function () {
        $('#SelectNicknameUserNameList').val('');
        AjaxGet.SelectNicknameUserNameList = '';
        // FunkCommetarinhalteschleife(vid.currentTime, true);
        barStudent.empty()
        barStudent.append(FunkCommetarinhalteschleife(vid.currentTime, true));


    })
    //Schlagwort Suche
    $("#SearchMarkedAreaButton").on("click", function () {
        AjaxGet.CommentSearchChoice = $('#SearchMarkedAreaInput').val();
        // FunkCommetarinhalteschleife(vid.currentTime, true);
        barStudent.empty()
        barStudent.append(FunkCommetarinhalteschleife(vid.currentTime, true));

    })

    //Reset Filter+Schlagwort Suche
    $("#SearchMarkedAreaButtonReset").on("click", function () {
        $("#SelectMarkedAreaTypeInput").val('')
        $('#SelectNicknameUserNameList').val('');
        $('#SearchMarkedAreaInput').val('').trigger('change');
        AjaxGet.CommentAmpelColorChoice = ''
        // AjaxGet.AjaxGet.SelectNicknameUserNameList = $(this).val().toLowerCase();
        AjaxGet.SelectNicknameUserNameList = '';
        AjaxGet.CommentSearchChoice = '';
        // FunkCommetarinhalteschleife(vid.currentTime, true);
        barStudent.empty()
        barStudent.append(FunkCommetarinhalteschleife(vid.currentTime, true));

    })

    //On Click on Bar show Comments
    barStudent.on('click', function () {
        FunkCommetarinhalteschleife(vid.currentTime, true);
        $('#CommentsBoxComments').animate({
            scrollTop: $('#CommentsVorVideozeitTop').height()
        }, 100);
    })


    $("#CommentsShowArea, #SearchMarkedAreaTop").on({
        mouseenter: function () {

            if (!vid.paused && $('#OnMouseoverPause').is(':checked')) {
                // $("#CommentsShowArea, #SearchMarkedAreaTop").on('mouseenter', mouse)

                vid.pause();
                VideoPausiertOnMouseover = true;

                $('.CommentsBoxTitle').html('<span style="color: #cecece;">! Video pausiert ! &nbsp;&nbsp;&nbsp;</span> <u>Alle Kommentare:</u> <span style="color: #cecece;">&nbsp;&nbsp;&nbsp; ! Video pausiert !</span>')

            } else {
                VideoPausiertOnMouseover = false;

            }

        }
        ,

        mouseleave: function () {
            $('.CommentsBoxTitle').html('Alle Kommentare:')
            // if (EditCommentsClicked) {
            //     EditCommentsClicked = false;
            // } else { }


            if (VideoPausiertOnMouseover) {
                if (!$('#FunctionalityOverlay').length) {
                    vid.play();
                    VideoPausiertOnMouseover = false;
                }
            }

        }

    });


    window.setInterval(function () {

        if (!vid.paused) {

            FunkCommetarinhalteschleife(vid.currentTime, false);

            $('#CommentsBoxComments').animate({
                scrollTop: $('#CommentsVorVideozeitTop').height()
            }, 100);
        }

        if (vid.paused) {
        }

    }, 1000);

}

function FunkRetweetthisComment(AjaxGet, Comment_ID, DeletedComment) {
    $("#" + AjaxGet.VideoElementId + "FunkOnlyPaus").hide();

    var SavedCommentsContents = AjaxGet.ShowSavedComments;
    let vid = $("#" + AjaxGet.VideoElementId).get(0);
    AjaxGet.$AddedCommentArray = [];

    // Take Comments Value
    var CommentsStartTime = new Date(null);
    CommentsStartTime.setSeconds(parseInt(SavedCommentsContents[Comment_ID].StartTime)); // specify value for SECONDS here
    var CommentsStartTimeDone = CommentsStartTime.toISOString().substr(11, 8)
    var RetweetsComments = '';
    var RetweetOwner = "";


    if (IsJsonString(SavedCommentsContents[Comment_ID].AddedComment)) {
        var $AddedCommentFromDB = jQuery.parseJSON(SavedCommentsContents[Comment_ID].AddedComment);
        var ParrentI = Comment_ID;
        RetweetsComments += '<div id="RetweetsCommentsArea" class="RetweetsCommentsTop" >'
        var tabing = ""
        var JumpingArray = false;
        for (i in $AddedCommentFromDB) {
            CommentsStartTimeDone = '(' + CommentsStartTimeDone + ')';
            if (i > 0) {
                tabing += "&nbsp;&nbsp;&nbsp;&nbsp;"
                CommentsStartTimeDone = '';
            }

            if (JumpingArray) {
                RetweetOwner = $AddedCommentFromDB[i];
                AjaxGet.$AddedCommentArray.push($AddedCommentFromDB[i])
                JumpingArray = false;

            } else {
                RetweetsComments += '<span class="RetweetsComments"><span class="RetweetsCommentsOwner" >' + tabing + CommentsStartTimeDone +
                    RetweetOwner + ': </span><span class="RetweetsCommentsText" >' +
                    $AddedCommentFromDB[i] +
                    '</span></span>'
                AjaxGet.$AddedCommentArray.push($AddedCommentFromDB[i])
                JumpingArray = true;
            }
        }

    } else {
        RetweetsComments += '<div id="RetweetsCommentsArea" class="RetweetsCommentsTop"><span lass="RetweetsComments">(' + CommentsStartTimeDone + ')' +
            SavedCommentsContents[Comment_ID].UserNickname + ': </span><span class="RetweetsCommentsText">' +
            SavedCommentsContents[Comment_ID].AddedComment +
            '</span></div>'
    }


    $("#InputVideoComment").before(RetweetsComments)
    // $('#InputVideoComment').remove()

    // Jump to Videotime
    vid.currentTime = SavedCommentsContents[Comment_ID].StartTime;


    $('.DisableAfterSaveInput').prop('disabled', true).hide()
    $('#GridOverlay td').unbind('click');
    $('#BackgroundColorTransparency').show().prop('disabled', false);
    /* $('#SaveToDbAndPlay').text("Fortfahren").attr('id', 'KillCommentsAndPlayAdmin').css('backgroundColor', '#008000'); */
    $('#SaveToDbAndPlay').hide()
    $('#EditCommentAndPlay').hide()
    $('#DeleteCommentAndPlay').hide()
    $('#UndeleteCommentAndPlay').hide()
    $('.containerRadioButton').hide()

    $('#DropAndPlay').show().prop('disabled', false)
    $('#RetweetCommentAndPlay').show()


    var WhichIsChecked = ''
    switch (SavedCommentsContents[Comment_ID].AmpelColor.toLowerCase()) {
        case "ff0000":
            WhichIsChecked = '<span style="background-color: #ff0000;"><u> Negativ </u></span>'
            break;
        case "00ff00":
            WhichIsChecked = '<span style="background-color: #00ff00;"><u> Positiv </u></span>'
            break;
        default:
            WhichIsChecked = '<span style="background-color: #ffffff;"><u> Neutral </u></span>'
    }
    $('#RetweetCommentAndPlay').before('<span style="padding-right: 40px; Font-size: 1.5em;">Kommentar ist als ' + WhichIsChecked + ' markiert.</span>')

    $('#RetweetCommentAndPlay').show()
    //
    // $('#KillCommentsAndPlayAdmin').on('click', function () {
    //     FunkVideoPlayPause(AjaxGet)
    // })


};

function FunkShowthisComment(AjaxGet, Comment_ID, DeletedComment) {
    $("#" + AjaxGet.VideoElementId + "FunkOnlyPaus").hide();
    var SavedCommentsContents = AjaxGet.ShowSavedComments;
    let vid = $("#" + AjaxGet.VideoElementId).get(0);
    vid.pause();


    var CommentsStartTime = new Date(null);
    CommentsStartTime.setSeconds(parseInt(SavedCommentsContents[Comment_ID].StartTime)); // specify value for SECONDS here
    var CommentsStartTimeDone = CommentsStartTime.toISOString().substr(11, 8)
    var ShowthisComment = '';
    var RetweetOwner = "";


    if (IsJsonString(SavedCommentsContents[Comment_ID].AddedComment)) {
        var $AddedCommentFromDB = jQuery.parseJSON(SavedCommentsContents[Comment_ID].AddedComment);
        var ParrentI = Comment_ID;
        ShowthisComment += '<div class="ShowthisCommentTop">'
        var tabing = ""
        var JumpingArray = false;
        for (i in $AddedCommentFromDB) {
            CommentsStartTimeDone = '(' + CommentsStartTimeDone + ')';
            if (i > 0) {
                tabing += "&nbsp;&nbsp;&nbsp;&nbsp;"
                CommentsStartTimeDone = '';
            }

            if (JumpingArray) {
                RetweetOwner = $AddedCommentFromDB[i];
                JumpingArray = false;

            } else {
                ShowthisComment += '<span class="ShowthisComment" ><span class="ShowthisCommentOwner">' + tabing + CommentsStartTimeDone +
                    RetweetOwner + ': </span><span class="ShowthisCommentText" >' +
                    $AddedCommentFromDB[i] +
                    '</span></span>'
                JumpingArray = true;
            }
        }

    } else {
        ShowthisComment += '<div class="ShowthisComment"><span class="ShowthisCommentOwner">(' + CommentsStartTimeDone + ')' +
            SavedCommentsContents[Comment_ID].UserNickname + ': </span><span class="ShowthisCommentText">' +
            SavedCommentsContents[Comment_ID].AddedComment +
            '</span></div>'
    }


    $("#InputVideoComment").before(ShowthisComment)
    // $('#InputVideoComment').remove()

    // Jump to Videotime
    vid.currentTime = SavedCommentsContents[Comment_ID].StartTime;


    $('.DisableAfterSaveInput').prop('disabled', true).hide()
    $('#GridOverlay td').unbind('click');
    $('#BackgroundColorTransparency').show().prop('disabled', false);
    /* $('#SaveToDbAndPlay').text("Fortfahren").attr('id', 'KillCommentsAndPlayAdmin').css('backgroundColor', '#008000'); */
    $('#SaveToDbAndPlay').hide()
    $('#DropAndPlay').hide()
    $('#EditCommentAndPlay').hide()

    $('#DeleteCommentAndPlay').hide()
    $('#UndeleteCommentAndPlay').hide()
    $('.containerRadioButton').hide()


    $('#InputVideoComment').remove()

    var WhichIsChecked = ''
    switch (SavedCommentsContents[Comment_ID].AmpelColor.toLowerCase()) {
        case "ff0000":
            WhichIsChecked = '<span style="background-color: #ff0000;"><u> Negativ </u></span>'
            break;
        case "00ff00":
            WhichIsChecked = '<span style="background-color: #00ff00;"><u> Positiv </u></span>'
            break;
        default:
            WhichIsChecked = '<span style="background-color: #ffffff;"><u> Neutral </u></span>'
    }
    $('#KillCommentsAndPlayAdmin').before('<span style="padding-right: 40px; Font-size: 1.5em;">Kommentar ist als ' + WhichIsChecked + ' markiert.</span>')
    $('#KillCommentsAndPlayAdmin').show()
    $('#KillCommentsAndPlayAdmin').on('click', function () {

        FunkVideoPlayPause(AjaxGet)
    })


};

function FunkEditComments(AjaxGet, Comment_ID, DeletedComment) {
    $("#" + AjaxGet.VideoElementId + "FunkOnlyPaus").hide();

    var SavedCommentsContents = AjaxGet.ShowSavedComments;
    let vid = $("#" + AjaxGet.VideoElementId).get(0);
    AjaxGet.$AddedCommentArray = [];
    AjaxGet.$EditedCommentHistory = [];


    if (IsJsonString(SavedCommentsContents[Comment_ID].AddedComment)) {
        var $AddedCommentFromDB = jQuery.parseJSON(SavedCommentsContents[Comment_ID].AddedComment);
        for (i in $AddedCommentFromDB) {
            AjaxGet.$AddedCommentArray.push($AddedCommentFromDB[i])
        }

    } else {
        AjaxGet.$AddedCommentArray.push(SavedCommentsContents[Comment_ID].AddedComment)
    }

    if (IsJsonString(SavedCommentsContents[Comment_ID].EditedCommentsHistory)) {
        var $EditedCommentHistoryFromDB = jQuery.parseJSON(SavedCommentsContents[Comment_ID].EditedCommentsHistory);
        for (i in $EditedCommentHistoryFromDB) {
            AjaxGet.$EditedCommentHistory.push($EditedCommentHistoryFromDB[i])
        }

    } else {
        AjaxGet.$EditedCommentHistory.push(SavedCommentsContents[Comment_ID].EditedCommentsHistory)
        // AjaxGet.$EditedCommentHistory=[];
    }


    // fixme
    // Take Comments Value

    // $("#InputVideoComment").val(SavedCommentsContents[Comment_ID].StartTime + " <- Starttime  ||  " +
    //     SavedCommentsContents[Comment_ID].ID + " <- Comment_DB_ID \n" +
    //     Comment_ID + " <- CommentInputBox ID \n" +
    //     Comment_ID + " <- Editicon ID " +
    //     "\n-----------------------------------\n" +
    //     SavedCommentsContents[Comment_ID].AddedComment)

    if (IsJsonString(SavedCommentsContents[Comment_ID].AddedComment)) {
        var $AddedCommentFromDB = jQuery.parseJSON(SavedCommentsContents[Comment_ID].AddedComment);
        $("#InputVideoComment").val($AddedCommentFromDB[0])
    } else {
        $("#InputVideoComment").val(SavedCommentsContents[Comment_ID].AddedComment)
    }


    // Jump to Videotime
    /*if (SavedCommentsContents[Comment_ID].StartTime<1){
        vid.currentTime = SavedCommentsContents[Comment_ID].StartTime;
    }else {
        vid.currentTime = SavedCommentsContents[Comment_ID].StartTime-0.5;
    }*/
    vid.currentTime = SavedCommentsContents[Comment_ID].StartTime;


    // Take Comments Color
    function FunkPickChoosenAmpelColorButton() {
        switch (SavedCommentsContents[Comment_ID].AmpelColor.toLowerCase()) {
            case "ff0000":
                $("#ColorRed").attr('checked', 'checked');
                break;
            case "00ff00":
                $("#ColorGreen").attr('checked', 'checked');
                break;
            default:
                $("#ColorWhite").attr('checked', 'checked');
        }
    }

    AjaxGet.AmpelColor = SavedCommentsContents[Comment_ID].AmpelColor;
    FunkPickChoosenAmpelColorButton()

    // Take Markedarea Colors


    //let vid = $("#" + AjaxGet.VideoElementId).get(0);
    if (DeletedComment == 1) {

        $('#FunctionalityOverlay').after('<div id="DeleteCommentConfirm" style="text-align: center;">' +
            '</div>')
        $('#FunctionalityOverlay').hide()
        $('#DeleteCommentConfirm').html('<p><h2>Löschen rückgängig machen?</h2></p>' +
            '<input type="button" id="DeleteCommentConfirmYes" class="button_std" style="margin: 10px; background-color:red; font-weight: bold;" value="Ja ">' +
            '<input type="button" id="DeleteCommentConfirmNo" class="button_std"  style="margin: 10px;  background-color:green;font-weight: bold;" value="Nein">'
        )

        $('#DeleteCommentConfirmNo').on('click', function () {
            $('#FunctionalityOverlay').show()
            $('#DeleteCommentConfirm').remove()
            // AjaxGet.FunktionFinished = true;
            FunkCallCommentsImportAdmin(AjaxGet)
        });

        $('#DeleteCommentConfirmYes').on('click', function () {

            $('#FunctionalityOverlay').show()
            $('#DeleteCommentConfirm').remove()

            $('#DeleteCommentAndPlay').hide()
            $('#SaveToDbAndPlay').hide()
            $('#UndeleteCommentAndPlay').show()
            $('#SaveToDbAndPlay').hide()
            // $('#DropAndPlay').hide()

        });

    } else {
        $('#EditCommentAndPlay').show()
        $('#ResetInput').show()
        $('#DeleteCommentAndPlay').show()
        $('#SaveToDbAndPlay').hide()
        $('#DeleteCommentConfirm').remove()
    }


};



