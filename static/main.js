function refreshOne(e) {
    postData({"Id": $(this).attr("itemId")});
    e.preventDefault();
}

function postData(data) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:9999/queue",
        data: JSON.stringify(data),
        dataType: "json",
        success: function () {
            $("tr[itemid='" + data["Id"] + "']").find(".spinner").show();
            $("tr[itemid='" + data["Id"] + "']").find(".item_link").hide();
        },
        error: function (message) {
            console.error("error has occurred");
            console.error(message);
        }
    });
};

function bindEvents() {
    $("#check_all").unbind().click(function(a){
        $("input[name=itemId]").prop("checked", $("#check_all")[0].checked);
    });

    $(".queue_all").unbind().click(function(e){
        cboxes = $("input[name=itemId]");
        for (var i=0; i<cboxes.length; i++){
            if (cboxes[i].checked){
                console.log($(cboxes[i]).val());
                postData({"Id": $(cboxes[i]).val()});
            }
        }
        e.preventDefault();
    });
}

function listen2Queue() {
    var xhr = new XMLHttpRequest();
    var lastLoaded = 0;
    xhr.open("GET", "/queue", true);
    xhr.onprogress = function (a) {
      s = xhr.responseText.substr(lastLoaded, a.loaded - lastLoaded).replace(/}{/g, "}|{").split("|");
      for (var k=0; k<s.length;k++){
          console.log(k, ":", s[k]);
          queue = JSON.parse(s[k])["queue"];
          if (!(queue instanceof Array)) {
            queue = [queue];
          }

          for (var i=0; i<queue.length;i++){
            let c = queue[i];
            if (c["status"] == "QUEUED"){
                $("tr[itemid='" + c["Id"] + "']").find(".spinner").show();
                $("tr[itemid='" + c["Id"] + "']").find(".item_link").hide();
            }

            if (c["status"] == "DONE"){
                $("tr[itemid='" + c["Id"] + "']").find(".spinner").hide();
                $("tr[itemid='" + c["Id"] + "']").find(".item_link").show();
                $("tr[itemid='" + c["Id"] + "']").find(".last_date").text(c["last_date"]);
            }
          }
      }
      lastLoaded = a.loaded;
    };
    xhr.send();
}

function getItems() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:9999/getIds",
        dataType: "json",
        success: function (r) {
            $("#items_list tbody").empty();

            r.forEach(function (a) {
                $("#items_list tbody").append(
                    $("<tr itemId='" + a.Id + "'>"
                    + ' <td><input type="checkbox" name="itemId" value="'
                    + a.Id + '" /></td>'
                    + " <td>" + a.Id + "</td>"
                    + " <td class='last_date'>" + a.last_date + "</td>"
                    + " <td>"
                    + "     <a href='#' class='item_link' itemId='"
                    + a.Id + "'> <i class=\"fas fa-sync\"></i></a>"
                    + "<img src='/static/spinner.svg' class='spinner' style='display:none;' />"
                    + " </td>"
                    + "</tr>"));


            });

            $("input").click(function(){
                cboxes = $("input[name=itemId]");
                checked = 0;
                for (var i=0; i<cboxes.length; i++){
                    checked += (cboxes[i].checked)?1:0;
                }

                if (checked > 0){
                    document.getElementById("mySidenav").style.width = "56px";
                }
                else{
                    document.getElementById("mySidenav").style.width = "0px";
                }
            });

            $(".item_link").unbind().click(refreshOne);
        },
        error: function (message) {
            console.error("error has occurred");
            console.error(message);
        }
    });
}

$(document).ready(function(){
    getItems();
    listen2Queue();
    bindEvents();
});
