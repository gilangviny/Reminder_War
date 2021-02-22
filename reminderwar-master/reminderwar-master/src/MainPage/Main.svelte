<script>
  import Input from "../Input/input_meeting.svelte";
  import Edit from "../Input/edit_meeting.svelte";
  import Update from "../Input/update_task.svelte";
  import Events from "../Layout/event.svelte";
  import GCalender from "./GCalender.svelte";
  import InputEvent from "../Input/add_event.svelte";
  import TodayEvent from "../Layout/today-event.svelte";
  import TodayRoom from "../Layout/today-room.svelte";
  import { db_reminder, db_attachment } from "../config";
  export let user;
  let evidence_url = "";
  let readData = [];
  let idMeeting = [];
  let selectMeeting = [];
  let unitData = [];
  let unitCount = [];
  let unitName = [
    "GM",
    "ASO",
    "OPTIMA",
    "CCAN&WAN",
    "HS_CS",
    "ARNET",
    "EGBIS",
    "CC",
    "HR&GS",
    "PCF",
    "WR",
    "TA",
    "DSW",
    "DATEL_PWJ",
    "DATEL_TEM",
    "DATEL_WOS",
    "DATEL_MUN",
    "DATEL_KBM",
    "OTHER"
  ];
  let unitTaskDone = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let unitTaskOGP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let meetingName = [];
  let taskName = [];
  let unitOut = [];
  let taskDetail = [];
  let unitDetails = [];
  let meetingStatus = [];
  let idTask = [];
  let taskId;
  let taskSelect = [];
  let select = [];
  let gotSelect;
  let taskModal = [];
  import { onMount, beforeUpdate } from "svelte";
  let chosenUnitName;
  let id = "";
  let url = "";
  let num = 0;

  let unitDone = 0;
  let unitOGP = 0;
  let colors = [
    "#50514f",
    "#f25f5c",
    "#ffe066",
    "#247ba0",
    "#70c1b3",
    "#f72585",
    "#7209b7",
    "#3a0ca3",
    "#4361ee",
    "#4cc9f0",
    "#3d5a80",
    "#98c1d9",
    "pink",
    "#ee6c4d",
    "#8d99ae",
    "#3a86ff",
    "#ef233c"
  ];

  let extreme = 0;
  let urgent = 0;
  let not_urgent = 0;
  let not_important = 0;
  onMount(async () => {
    let i = 0;
    let j = 0;
    var database = db_reminder.ref("/");
    database.on("value", function(snapshot) {
      unitDetails = [];
      selectMeeting = [];
      readData = [];
      idMeeting = [];
      meetingName = [];
      taskModal = [];
      unitTaskDone = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      unitTaskOGP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      snapshot.forEach(function(item) {
        readData[readData.length] = item.val();
        idMeeting[idMeeting.length] = item.key;
      });
      idTask = [];
      taskSelect = [];
      unitData = [];
      taskName = [];
      extreme = 0;
      urgent = 0;
      not_urgent = 0;
      not_important = 0;
      readData.forEach(function(item) {
        if (item.priority == "0") {
          extreme++;
        } else if (item.priority == "1") {
          urgent++;
        } else if (item.priority == "2") {
          not_urgent++;
        } else if (item.priority == "3") {
          not_important++;
        }

        for (i = 0; i < item.data_meeting.length; i++) {
          idTask[idTask.length] = idMeeting[j];
          taskSelect[taskSelect.length] = i;
          taskName[taskName.length] = item.meeting_name;
        }
        j = j + 1;
        unitData = [...unitData, ...item.data_meeting];
      });
      unitCount = [];
      for (i = 0; i < unitData.length; i++) {
        let data = {
          perihal: unitData[i].perihal,
          action: unitData[i].action_plan,
          date: unitData[i].due_date,
          status: unitData[i].status,
          uic: unitData[i].data_uic
        };
        unitCount[unitCount.length] = data;
      }
      let ok = [];
      let place = [];
      for (j = 0; j < unitCount.length; j++) {
        i = 0;
        while (i < unitCount[j].uic.length) {
          if (unitCount[j].uic[i].progress != "") {
            i++;
          } else {
            break;
          }
        }
        if (unitCount[j].uic.length > i) {
          ok[j] = false;
        } else {
          ok[j] = true;
        }
      }

      for (i = 0; i < ok.length; i++) {
        if (ok[i]) {
          if (idTask[i]) {
            if (taskSelect[i]) {
              if (unitCount[i].status == false) {
                db_reminder
                  .ref("/" + idTask[i] + "/data_meeting/" + taskSelect[i] + "/")
                  .update({
                    status: true
                  });
              }
            }
          }
        } else {
          if (unitCount[i].status) {
            if (idTask[i]) {
              if (taskSelect[i]) {
                db_reminder
                  .ref("/" + idTask[i] + "/data_meeting/" + taskSelect[i] + "/")
                  .update({
                    status: false
                  });
              }
            }
          }
        }
      }

      for (j = 0; j < readData.length; j++) {
        i = 0;
        while (i < readData[j].data_meeting.length) {
          if (readData[j].data_meeting[i].status) {
            i++;
          } else {
            break;
          }
        }
        if (readData[j].data_meeting.length > i) {
          meetingStatus[j] = false;
        } else {
          meetingStatus[j] = true;
        }
      }
      let z;

      for (i = 0; i < unitCount.length; i++) {
        for (j = 0; j < unitCount[i].uic.length; j++) {
          if (unitCount[i].uic[j].progress != "") {
            for (z = 0; z < unitName.length; z++) {
              if (unitName[z] == unitCount[i].uic[j].name) {
                unitTaskDone[z] = unitTaskDone[z] + 1;
              }
            }
          } else {
            for (z = 0; z < unitName.length; z++) {
              if (unitName[z] == unitCount[i].uic[j].name) {
                unitTaskOGP[z] = unitTaskOGP[z] + 1;
              }
            }
          }
        }
      }

      unitOut = [];
      for (i = 0; i < unitName.length; i++) {
        let out = {
          name: unitName[i],
          done: unitTaskDone[i],
          ogp: unitTaskOGP[i]
        };
        unitOut[unitOut.length] = out;
      }
      unitDone = 0;
      unitOGP = 0;
      for (i = 0; i < unitName.length; i++) {
        if (unitOut[i].ogp + unitOut[i].done > 0) {
          if (unitOut[i].ogp < 1) {
            unitDone++;
          } else {
            unitOGP++;
          }
        }
      }
    });
  });
</script>

<style>
  body {
    height: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Roboto Slab", serif;
  }
  .navbar {
    background-color: #15b7b9 !important;
    height: 80px;
  }

  .navbar-brand {
    color: black;
    font-family: "Roboto Slab", serif;
    font-weight: 600;
    color: red !important;
    font-size: 30px !important;
  }

  .navbar-brand span {
    color: white;
  }

  .navbar-nav .nav-item {
    color: white !important;
    font-weight: 400;
    font-size: 18px !important;
    margin-left: 10px;
  }

  .nav-item:hover {
    color: red !important;
  }

  .collapse.navbar-collapse {
    background-color: #15b7b9;
    opacity: 0.8;
  }
  .jumbotron {
    /* background: #15b7b9 !important; */
    background-color: black !important;
    background-attachment: fixed !important;
    color: #f5f5f5;
    height: 300px;
    -webkit-animation: fadeinout 1.5s linear;
    animation: fadeinout 1.5s linear;
    height: 50vh !important;
    width: 100% !important;
    /* opacity: 0.9; */
  }
  .jumbotron span {
    color: white;
  }

  .seksion {
    -webkit-animation: fadeinoutSeksion 3s linear;
    animation: fadeinoutSeksion 3s linear;
  }

  @-webkit-keyframes fadeinout {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fadeinout {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeinoutSeksion {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fadeinoutSeksion {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  .jumbotron h1 {
    color: black !important;
    font-weight: 700;
  }

  .jumbotron {
    height: 330px;
  }

  .jumbotron span {
    color: white;
  }

  .search {
    border: none !important;
    height: 44px !important;
    width: 100px !important;
  }

  .search:hover {
    background-color: #10ddc2 !important;
  }

  .create-meeting {
    border: none !important;
    height: 44px !important;
    width: 100px !important;
    /* margin-left: 250px !important; */
  }

  .create-meeting:hover {
    background-color: #15b7b9 !important;
  }

  .btn-periode:hover {
    background-color: #15b7b9 !important;
  }

  .table-wrap {
    height: 700px;
    overflow-y: auto;
  }

  .td-wrap {
    height: 100px;
    overflow-y: auto;
  }

  .footer {
    /* bottom: 0 !important; */
    margin-top: auto;
    height: 40px;
    width: 100%;
    background-color: black;
  }

  .modal-dialog .modal-lg {
    width: 80% !important;
  }

  .btn-back {
    border-color: none;
    color: white;
  }

  .modal-body {
    background-color: #f5f5f5;
  }

  .progres-update-task {
    height: 80vh;
    width: 100%;
  }

  .note-meeting {
    /* margin-top: 18px; */
    height: 100vh;
    width: 100% !important;
    background-color: #ffbd69 !important;
  }

  .search-date {
    margin-top: 25px !important;
    height: 42px !important;
    width: 50px !important;
  }

  .glow {
    color: #444;
    text-shadow: 1px 0px 1px #ccc, 0px 1px 1px #eee, 2px 1px 1px #ccc,
      1px 2px 1px #eee, 3px 2px 1px #ccc, 2px 3px 1px #eee, 4px 3px 1px #ccc,
      3px 4px 1px #eee, 5px 4px 1px #ccc, 4px 5px 1px #eee, 6px 5px 1px #ccc,
      5px 6px 1px #eee, 7px 6px 1px #ccc;
  }
  input {
    height: 42px !important;
    width: 155px;
    border-color: 0.5px solid black;
  }

  .progress-task {
    width: 100%;
    background-color: #ffffdd;
    /* height: 100vh; */
  }

  .chart {
    height: 190px;
  }
  .scroll {
    max-height: 190px;
    overflow-y: auto;
  }

  .scroll::-webkit-scrollbar {
    display: none;
  }

  .favicon:hover {
    cursor: pointer;
  }

  .progres-uic:hover {
    cursor: pointer;
  }

  hr {
    margin: 0px -20px 10px;
    left: -20px;
    right: -20px;
  }
  .card.today-meeting {
    height: 500px !important;
    border-radius: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card.today-meeting:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  .scroll-today-meeting {
    max-height: 500px;
    overflow-y: auto;
  }

  .scroll-today-meeting::-webkit-scrollbar {
    display: none;
  }

  .scroll-event-meeting {
    max-height: 45% !important;
    overflow-y: auto;
  }

  .scroll-event-meeting::-webkit-scrollbar {
    display: none;
  }

  .card.today-event {
    height: 300px !important;
    border-radius: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card.today-event:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  .opening {
    font-size: 90px !important;
    background: linear-gradient(to right, #2baf2b, #ffcc2f, #ef5734);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .opening-up {
    background: linear-gradient(to right, #fa1616 0%, #ef5734 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    /* font-family: 'Fredoka One', cursive !important; */
  }

  .opening span {
    color: #fa1616 !important;
    /* font-family: 'Fredoka One', cursive !important; */
  }
  /* media query */
  @media (min-width: 1000px) {
    .table-wrap {
      max-height: 400px !important;
    }
  }

  @media (min-width: 1500px) {
    .table-wrap {
      max-height: 700px !important;
    }
  }
  @media (max-width: 920px) {
    .table-wrap {
      max-height: 400px !important;
    }
  }
  @media (max-width: 600px) {
    .table-wrap {
      height: 420px;
    }
    .card {
      width: 350px;
    }
  }

  @media (max-width: 460px) {
    .card {
      width: 300px !important;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 10px;
    }
  }

  @media (max-width: 400px) {
    .card-group .totalDone {
      margin-left: 25px !important;
      height: 250px !important;
      /* margin-right: auto !important; */
    }
  }

  @media (max-width: 350px) {
    .table-wrap {
      height: 300px;
    }
  }
  @media (max-width: 250px) {
    .table-wrap {
      height: 200px;
    }
  }
  @media (min-width: 992px) {
    .navbar-brand {
      color: black;
      font-family: "Roboto Slab", serif;
      font-weight: 600;
      color: red !important;
      font-size: 30px;
    }

    .nav-link {
      text-transform: uppercase;
      margin-right: 10px;
    }
    h1.display-4 {
      font-size: 90px !important;
    }
    .nav-link:hover::after {
      /* border-bottom: 3px solid #0B63DC; */
      content: "";
      display: block;
      border-bottom: 3px solid red;
      width: 50%;
      margin: auto;
      padding-bottom: 5px;
      margin-bottom: -8px;
    }

    .navbar-nav .nav-item {
      color: white !important;
      font-weight: 400;
      font-size: 15px !important;
      margin-left: 10px;
    }

    .fas.fa-sign-out-alt {
      font-size: 35px !important;
      /* cursor: pointer !important; */
    }
  }
  @media (min-width: 600px) {
    ul {
      font-size: 10px;
      line-height: 20px;
    }
  }

  .table tr {
    cursor: pointer;
  }
  .hiddenRow {
    padding: 0 4px !important;
    background-color: #eeeeee;
    font-size: 13px;
  }
</style>

<body>
  <!-- Jumbotron -->
  <div
    class="jumbotron jumbotron-fluid d-flex align-items-center"
    style="margin-bottom:0 !important;">
    <div class="container">
      <img src="logo.png" alt="logo" style="width:60%" />
      <p class="lead">
        <a class="btn btn-primary btn-lg" href="#progress_update" role="button">
          Progress Task
        </a>
        <a class="btn btn-primary btn-lg" href="#note_meeting" role="button">
          Note Meeting
        </a>
        <a
          class="btn btn-primary btn-lg"
          data-toggle="modal"
          data-target="#input_event"
          href=""
          role="button">
          Add Event
        </a>
      </p>
    </div>
  </div>
  <!-- end jumbtron -->

  <!-- content -->

  <div class="progress-task">
    <div class="container seksion" id="progress_update">
      <h1
        class="mb-5 pt-4 text-center glow"
        style="font-family: 'Varela Round', sans-serif; font-weight:bold;">
        PROGRESS UPDATE TASK
      </h1>
      <div class="row card-chart mb-2 justify-content-center">
        <div class="col-md-4 mb-2">
          <div
            class="card chart"
            style="border-radius:10px !important; overflow:hidden;">
            <div class="card-header" style="background-color: #35495e;">
              <h4
                style="color: aliceblue; font-family: 'Varela Round',
                sans-serif; font-weight:bold;">
                UIC
              </h4>
            </div>
            <div class="card-body">
              <div
                class="d-flex flex-row bd-highlight mb-2 progres-uic"
                data-toggle="modal"
                data-target="#see_done">
                <h4 class="mr-auto">DONE</h4>
                <h5 class="mr-2">{unitDone}</h5>
                <div class="favicon">
                  <i
                    class="fa fa-check-circle"
                    aria-hidden="true"
                    style="color: blue" />
                </div>
              </div>
              <div
                class="modal fade"
                id="see_done"
                tabindex="-1"
                role="dialog"
                aria-labelledby="see_doneLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="add_meetingLabel">
                        UNIT DONE
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      {#each unitOut as prop}
                        {#if prop.ogp + prop.done > 0}
                          {#if prop.ogp < 1}
                            {prop.name}
                            <hr />
                          {/if}
                        {/if}
                      {/each}
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div
                class="d-flex flex-row bd-highlight mb-2 progres-uic"
                data-toggle="modal"
                data-target="#see_ogp">
                <h4 class="mr-auto">OGP</h4>
                <h5 class="mr-2">{unitOGP}</h5>
                <div class="favicon">
                  <i
                    class="fa fa-times-circle"
                    aria-hidden="true"
                    style="color: red;" />
                </div>
              </div>

              <div
                class="modal fade"
                id="see_ogp"
                tabindex="-1"
                role="dialog"
                aria-labelledby="see_ogpLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="add_meetingLabel">
                        UNIT OGP
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      {#each unitOut as prop}
                        {#if prop.ogp > 0}
                          {prop.name}
                          <hr />
                        {/if}
                      {/each}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-2">
          <div class="card chart scroll" style="border-radius:10px !important;">
            <div
              class="card-header"
              style="background-color:#ff5f40;position: sticky; top: 0;">
              <h4
                style="color: aliceblue; font-family: 'Varela Round',
                sans-serif; font-weight:bold;">
                PRIORITY
              </h4>
            </div>
            <div class="card-body">
              <div class="d-flex flex-row bd-highlight mb-2 progres-uic">
                <h6 class="mr-auto">EXTREMELY URGENT</h6>
                <h5 class="mr-2">{extreme}</h5>
                <div class="favicon star">
                  <i
                    class="fa fa-star"
                    aria-hidden="true"
                    style="color: yellow;" />
                  <i
                    class="fa fa-star"
                    aria-hidden="true"
                    style="color: yellow;" />
                  <i
                    class="fa fa-star"
                    aria-hidden="true"
                    style="color: yellow;" />
                </div>
              </div>
              <hr />
              <div class="d-flex flex-row bd-highlight mb-2 progres-uic">
                <h6 class="mr-auto">URGENT</h6>
                <h5 class="mr-2">{urgent}</h5>
                <div class="favicon star">
                  <i
                    class="fa fa-star"
                    aria-hidden="true"
                    style="color: yellow;" />
                  <i
                    class="fa fa-star"
                    aria-hidden="true"
                    style="color: yellow;" />
                </div>
              </div>
              <hr />
              <div class="d-flex flex-row bd-highlight mb-2 progres-uic">
                <h6 class="mr-auto">NOT URGENT</h6>
                <h5 class="mr-2">{not_urgent}</h5>
                <div class="favicon star">
                  <i
                    class="fa fa-star"
                    style="color:yellow;"
                    aria-hidden="true" />
                </div>
              </div>
              <hr />
              <div class="d-flex flex-row bd-highlight mb-2 progres-uic">
                <h6 class="mr-auto">NOT IMPORTANT</h6>
                <h5 class="mr-2">{not_important}</h5>
                <div class="favicon star">
                  <i
                    class="fa fa-star-o fa-lg"
                    style="color:yellow;"
                    aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div
            class="card chart"
            style="border-radius:10px !important; overflow:hidden;">
            <div class="card-header bg-success">
              <h4
                style="color: aliceblue; font-family: 'Varela Round',
                sans-serif; font-weight:bold;">
                TASK COMPLETED
              </h4>
            </div>
            <div class="card-body">
              <div class="d-flex flex-row bd-highlight mb-2 progres-uic">
                <h4 class="mr-auto">DONE</h4>
                <h5 class="mr-2">{unitTaskDone.reduce((a, b) => a + b, 0)}</h5>
                <div class="favicon">
                  <i
                    class="fa fa-tasks fa-lg"
                    style="color:blue;"
                    aria-hidden="true" />
                </div>
              </div>
              <hr />
              <div class="d-flex flex-row bd-highlight mb-2 progres-uic">
                <h4 class="mr-auto">OGP</h4>
                <h5 class="mr-2">{unitTaskOGP.reduce((a, b) => a + b, 0)}</h5>
                <div class="favicon">
                  <i
                    class="fa fa-tasks fa-lg"
                    style="color:red;"
                    aria-hidden="true" />

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- SCHEDULE MEETING -->
      <div class="row mb-3">
        <div class="col-md-5 mb-2">
          <GCalender />
        </div>

        <div class="col-md-7">
          <div class="card today-meeting scroll-today-meeting">
            <div class="card-header bg-danger">
              <h5 style="color:white;font-family: 'Varela Round', sans-serif;">
                ALL MEETING
              </h5>
            </div>
            <div class="card-body">
              <Events />
            </div>
          </div>
        </div>
      </div>
      <!-- END SCHEDULE MEETING -->

      <!-- TODAY EVENT -->
      <div class="row mb-3 justify-content-centere">
        <div class="col-md-6">
          <div class="card today-event scroll-today-meeting">
            <div class="card-header bg-dark">
              <h5
                style="color:white;font-family: 'Varela Round', sans-serif;
                font-weight:bold;">
                TODAY EVENT SCHEDULE
              </h5>
            </div>
            <div class="card-body">
              <TodayEvent />
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card today-event scroll-today-meeting">
            <div
              class="card-header"
              style="background-color:#7c3c21 !important;">
              <h5
                style="color:white;font-family: 'Varela Round', sans-serif;
                font-weight:bold;">
                TODAY RESERVED ROOM
              </h5>
            </div>
            <div class="card-body">
              <TodayRoom />
            </div>
          </div>
        </div>
      </div>
      <!-- End today event -->

      <!-- Search button -->
      <div class="row">
        <div class="col-sm-4 btn-group mt-2">
          <select
            class="btn dropdown-toggle text-white"
            style="background-color:#15b7b9;"
            name="search_by_unit"
            id="unit_search">
            <option value="all">All Unit</option>
            {#each unitName as props}
              <option value={props}>{props}</option>
            {/each}
          </select>
        </div>

        <div
          class="col-sm-4 btn-group mt-2"
          style="margin-left: -15% !important;">
          <button
            type="button"
            class="btn btn-primary btn-md search"
            style="background-color: #15b7b9;"
            on:click={() => {
              unitDetails = [];
              let i, j;
              chosenUnitName = document.getElementById('unit_search').value;
              for (i = 0; i < unitCount.length; i++) {
                for (j = 0; j < unitCount[i].uic.length; j++) {
                  if (document.getElementById('unit_search').value == unitCount[i].uic[j].name) {
                    unitDetails[unitDetails.length] = unitCount[i];
                    taskModal[taskModal.length] = idTask[i];
                    meetingName[meetingName.length] = taskName[i];
                    select[select.length] = taskSelect[i];
                  }
                }
              }
              if (unitDetails.length == 0) {
                alert('No Task');
              }
            }}>
            SEARCH
          </button>
        </div>
        {#if unitDetails.length != 0}
          <div class="col-sm-2 btn-group mt-2">
            <button
              type="button"
              style=""
              class="btn btn-danger btn-md btn-back"
              on:click={() => {
                unitDetails = [];
                meetingName = [];
                taskModal = [];
              }}>
              BACK
            </button>
          </div>
        {/if}
      </div>

      <!-- table progres -->
      <div class="progres-update-task">
        <div class="table-responsive mt-3">
          <div class="table-wrap">
            <table class="table table-bordered table-hover">
              <thead class="th-progress" style="background-color: #e9290f;">
                {#if unitDetails.length != 0}
                  <tr>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;">
                      NO
                    </th>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;">
                      PERIHAL
                    </th>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;">
                      ACTION
                    </th>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;">
                      DUE DATE
                    </th>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;">
                      PROGRESS
                    </th>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;">
                      ATTACHMENT
                    </th>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;">
                      STATUS
                    </th>
                    {#if chosenUnitName == user.email
                        .split('@')[0]
                        .toUpperCase()}
                      <th style="color:aliceblue;">ACTION</th>
                    {/if}
                  </tr>
                {:else}
                  <tr>
                    <th
                      class="text-center"
                      rowspan="2"
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;font-family: 'Varela
                      Round', sans-serif; font-weight:bold;">
                      UNIT
                    </th>
                    <th
                      class="text-center"
                      rowspan="2"
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;font-family: 'Varela
                      Round', sans-serif; font-weight:bold;">
                      TOTAL TASK
                    </th>
                    <th
                      colspan="2"
                      class="text-center"
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 0; color:aliceblue;font-family: 'Varela
                      Round', sans-serif; font-weight:bold;">
                      FOLLOW UP
                    </th>
                  </tr>
                  <tr>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 12.25%; color:aliceblue; font-family:
                      'Varela Round', sans-serif; font-weight:bold;">
                      DONE
                    </th>
                    <th
                      style="background-color: #c70039; position: sticky;
                      z-index: 5; top: 12.25%; color:aliceblue;font-family:
                      'Varela Round', sans-serif; font-weight:bold;">
                      OGP
                    </th>
                  </tr>
                {/if}
              </thead>
              <tbody style="background-color:white;">
                {#if unitDetails.length != 0}
                  {#each unitDetails as props, i}
                    {#if unitDetails.length < 2}
                      <tr>
                        <td
                          colspan="8"
                          on:click={() => {
                            var j;
                            var k;
                            num = i;
                            for (j = 0; j < meetingName.length; j++) {
                              var x = document.getElementsByClassName(meetingName[
                                  j
                                ]
                                  .split(' ')
                                  .join(''));
                              for (k = 0; k < x.length; k++) {
                                x[k].style.display = 'none';
                              }
                            }
                            var x = document.getElementsByClassName(meetingName[
                                i
                              ]
                                .split(' ')
                                .join(''));
                            for (j = 0; j < x.length; j++) {
                              x[j].style.display = 'table-row';
                            }
                          }}
                          class="text-left bg-warning"
                          style="font-family: 'Varela Round', sans-serif
                          !important; font-weight:bold;">
                          {meetingName[0]}
                        </td>
                      </tr>
                    {/if}
                    {#if meetingName[i] != meetingName[i - 1] && i + 1 < unitDetails.length}
                      <tr>
                        <td
                          colspan="8"
                          on:click={() => {
                            var j;
                            var k;
                            num = i;
                            for (j = 0; j < taskModal.length; j++) {
                              var x = document.getElementsByClassName(meetingName[
                                  j
                                ]
                                  .split(' ')
                                  .join(''));
                              for (k = 0; k < x.length; k++) {
                                x[k].style.display = 'none';
                              }
                            }
                            var x = document.getElementsByClassName(meetingName[
                                i
                              ]
                                .split(' ')
                                .join(''));
                            for (j = 0; j < x.length; j++) {
                              x[j].style.display = 'table-row';
                            }
                          }}
                          class="text-left bg-warning"
                          style="font-family: 'Varela Round', sans-serif
                          !important; font-weight:bold;">
                          {meetingName[i]}
                        </td>
                      </tr>
                    {/if}
                    <tr
                      class={meetingName[i].split(' ').join('')}
                      style="display: none">
                      <td>{i + 1 - num}</td>
                      <td>{props.perihal}</td>
                      <td>{props.action}</td>
                      <td>{props.date}</td>
                      {#each props.uic as unit}
                        {#if unit.name == chosenUnitName}
                          <td style="color:red; font-weight:600;">
                            {#if unit.progress == ''}
                              No Progress
                            {:else}
                              <span style="color:black;">{unit.progress}</span>
                            {/if}
                          </td>
                          <td>
                            {#if unit.attachment != ''}
                              <button
                                type="button"
                                class="btn btn-outline-primary"
                                on:click={() => {
                                  db_attachment
                                    .ref(unit.attachment)
                                    .getDownloadURL()
                                    .then(function(url) {
                                      var xhr = new XMLHttpRequest();
                                      xhr.responseType = 'blob';
                                      xhr.onload = function(event) {
                                        var blob = xhr.response;
                                      };
                                      xhr.open('GET', url);
                                      xhr.send();
                                      window.open(url);
                                    })
                                    .catch(function(error) {});
                                }}>
                                Download Attachment
                              </button>
                            {:else}No Attachment{/if}
                          </td>
                          <td style="color:red; font-weight:500; ">
                            {#if unit.progress != ''}
                              <span style="color:#228B22; font-weight:600;">
                                DONE
                              </span>
                            {:else}OGP{/if}
                          </td>
                        {/if}
                      {/each}
                      {#if chosenUnitName == user.email
                          .split('@')[0]
                          .toUpperCase()}
                        <td>
                          <button
                            class="btn btn-warning"
                            data-toggle="modal"
                            data-target="#update_task"
                            on:click={() => {
                              taskId = i;
                              gotSelect = select[i];
                            }}>
                            UPDATE
                          </button>
                        </td>
                      {/if}
                    </tr>
                  {/each}
                {:else}
                  {#each unitOut as props}
                    <tr>
                      <td
                        on:click={() => {
                          chosenUnitName = props.name;
                          unitDetails = [];
                          meetingName = [];
                          taskModal = [];
                          let i, j;
                          for (i = 0; i < unitCount.length; i++) {
                            for (j = 0; j < unitCount[i].uic.length; j++) {
                              if (props.name == unitCount[i].uic[j].name) {
                                unitDetails[unitDetails.length] = unitCount[i];
                                taskModal[taskModal.length] = idTask[i];
                                select[select.length] = taskSelect[i];
                                meetingName[meetingName.length] = taskName[i];
                              }
                            }
                          }
                          console.log(unitDetails);
                          if (unitDetails.length == 0) {
                            alert('No Task');
                          }
                        }}>
                        {props.name}
                      </td>
                      <td
                        on:click={() => {
                          chosenUnitName = props.name;
                          unitDetails = [];
                          meetingName = [];
                          taskModal = [];
                          let i, j;
                          for (i = 0; i < unitCount.length; i++) {
                            for (j = 0; j < unitCount[i].uic.length; j++) {
                              if (props.name == unitCount[i].uic[j].name) {
                                unitDetails[unitDetails.length] = unitCount[i];
                                taskModal[taskModal.length] = idTask[i];
                                select[select.length] = taskSelect[i];
                                meetingName[meetingName.length] = taskName[i];
                              }
                            }
                          }
                          if (unitDetails.length == 0) {
                            alert('No Task');
                          }
                        }}>
                        {props.done + props.ogp}
                      </td>
                      <td
                        on:click={() => {
                          chosenUnitName = props.name;
                          unitDetails = [];
                          meetingName = [];
                          taskModal = [];
                          let i, j;
                          for (i = 0; i < unitCount.length; i++) {
                            for (j = 0; j < unitCount[i].uic.length; j++) {
                              if (props.name == unitCount[i].uic[j].name && unitCount[i].uic[j].progress != '') {
                                unitDetails[unitDetails.length] = unitCount[i];
                                taskModal[taskModal.length] = idTask[i];
                                select[select.length] = taskSelect[i];
                                meetingName[meetingName.length] = taskName[i];
                              }
                            }
                          }
                          console.log(meetingName);
                          if (unitDetails.length == 0) {
                            alert('No Task DONE');
                          }
                        }}>
                        {props.done}
                      </td>
                      <td
                        on:click={() => {
                          chosenUnitName = props.name;
                          unitDetails = [];
                          meetingName = [];
                          taskModal = [];
                          let i, j;
                          for (i = 0; i < unitCount.length; i++) {
                            for (j = 0; j < unitCount[i].uic.length; j++) {
                              if (props.name == unitCount[i].uic[j].name && unitCount[i].uic[j].progress == '') {
                                unitDetails[unitDetails.length] = unitCount[i];
                                taskModal[taskModal.length] = idTask[i];
                                select[select.length] = taskSelect[i];
                                meetingName[meetingName.length] = taskName[i];
                              }
                            }
                          }
                          if (unitDetails.length == 0) {
                            alert('No Task OGP');
                          }
                        }}>
                        {props.ogp}
                      </td>
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- end table progres -->
    </div>
  </div>

  <!-- Table note meeting -->
  <div class="note-meeting" id="note_meeting">
    <div class="container">
      <!-- greetings -->
      <h1
        class="text-center pt-4 mb-5 "
        style="font-family: 'Varela Round', sans-serif !important;
        font-weight:bold; text-transform: uppercase;">
        Note Meeting
      </h1>
      <div class="row d-flex justify-content-end">
        <div class="col-sm-2 mr-auto">
          <!-- <h1>co1</h1> -->
          <div class="btn-group mr-auto mt-4">
            <div class="col-sm-2 mr-auto">
              <select
                style="background-color: #ff6107;"
                class="text-white btn btn-outline-secondary dropdown-toggle"
                name="search_by_unit"
                id="unit_search_year"
                on:change={() => {
                  var input, filter, table, tr, td, i, txtValue;
                  input = document.getElementById('unit_search_year');
                  filter = input.value.toUpperCase();
                  table = document.getElementById('all_meeting');
                  tr = table.getElementsByTagName('tr');
                  for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName('td')[3];
                    if (td) {
                      txtValue = td.textContent || td.innerText;
                      if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = '';
                      } else {
                        tr[i].style.display = 'none';
                      }
                    }
                  }
                }}>
                <option value="">Year</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
              </select>
            </div>

            <div class="col-sm-2 mr-auto">
              <select
                style="background-color: #ff6107;"
                class="text-white btn btn-outline-secondary dropdown-toggle"
                name="search_by_unit"
                id="unit_search_month"
                on:change={() => {
                  var input, filter, table, tr, td, i, txtValue;
                  input = document.getElementById('unit_search_month');
                  filter = input.value.toUpperCase();
                  table = document.getElementById('all_meeting');
                  tr = table.getElementsByTagName('tr');
                  for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName('td')[3];
                    if (td) {
                      txtValue = td.textContent || td.innerText;
                      if (txtValue
                          .split('-')[1]
                          .toUpperCase()
                          .indexOf(filter) > -1) {
                        tr[i].style.display = '';
                      } else {
                        tr[i].style.display = 'none';
                      }
                    }
                  }
                }}>
                <option value="">Month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div class="col-sm-1 mr-auto">
              <select
                style="background-color: #ff6107;"
                class="text-white btn btn-outline-secondary dropdown-toggle"
                name="priority_search"
                id="priority_search"
                on:change={() => {
                  var input, filter, table, tr, td, i, txtValue;
                  input = document.getElementById('priority_search');
                  filter = input.value.toUpperCase();
                  table = document.getElementById('all_meeting');
                  tr = table.getElementsByTagName('tr');
                  for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName('td')[8];
                    if (td) {
                      txtValue = td.childElementCount;
                      if (filter == 'ALL') {
                        tr[i].style.display = '';
                      } else {
                        if (txtValue == filter) {
                          tr[i].style.display = '';
                        } else {
                          tr[i].style.display = 'none';
                        }
                      }
                    }
                  }
                }}>
                <option value="all">Priority</option>
                <option value="3">Extremely Urgent</option>
                <option value="2">Urgent</option>
                <option value="1">Not Urgent</option>
                <option value="0">Not Important</option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-sm-2">
          <!-- <h1>co2</h1> -->
          <div class="btn-group mt-4">
            <!--<button
              class="btn btn-outline-primary"
              data-toggle="modal"
              data-target="#gcalender">
              AGENDA
            </button>-->
            <button
              type="button"
              class="btn btn-primary btn-md create-meeting"
              style="background-color: #ff6107;"
              data-toggle="modal"
              data-target="#add_meeting">
              + Meeting
            </button>
            {#if selectMeeting.length != 0}
              <button
                type="button"
                style="width:60px;"
                class="btn btn-danger btn-md text-center"
                on:click={() => {
                  selectMeeting = [];
                }}>
                BACK
              </button>
            {/if}
          </div>
          <div class="btn-group mt-4 search-date">
            <input
              type="text"
              id="search_bydate"
              placeholder="Search by date"
              on:change={() => {
                var input, filter, table, tr, td, i, txtValue;
                input = document.getElementById('search_bydate');
                filter = input.value.toUpperCase();
                table = document.getElementById('all_meeting');
                tr = table.getElementsByTagName('tr');
                for (i = 0; i < tr.length; i++) {
                  td = tr[i].getElementsByTagName('td')[3];
                  if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                      tr[i].style.display = '';
                    } else {
                      tr[i].style.display = 'none';
                    }
                  }
                }
              }} />
          </div>
        </div>
        <div class="col-sm-2">
          <!-- <h1>co3</h1> -->

        </div>

      </div>

      <!-- Table -->
      <div class="table-responsive mt-3">
        <div class="table-wrap">
          <table class="table table-bordered table-hover" id="all_meeting">
            <thead class="th-note">
              {#if selectMeeting.length != 0}
                <tr style="color: #f37121">
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold; color:white;">
                    NO
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold; color:white;">
                    PERIHAL
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold; color:white;">
                    ACTION PLAN
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold; color:white;">
                    DUE DATE
                  </th>
                </tr>
              {:else}
                <tr style="color:white;">
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold; color:white;">
                    NO
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    MEETING
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    TOPIK
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    DATE
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    LEAD
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    ATTENDEES
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    LOCATION
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    CITY
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    PRIORITY
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    STATUS
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    EVIDENCE
                  </th>
                  <th
                    scope="col"
                    style="background-color: #c70039; position: sticky; z-index:
                    5; top: 0;font-family: 'Varela Round', sans-serif
                    !important; font-weight:bold;">
                    ACTION
                  </th>
                </tr>
              {/if}
            </thead>
            <tbody style="background-color: white;">
              {#if selectMeeting.length != 0}
                {#each selectMeeting as props, i}
                  <tr class="text-white" style="background-color: #f37121">
                    <td>{i + 1}</td>
                    <td
                      style="height:100px !important;"
                      on:click={() => {
                        var j;
                        var k;
                        num = i;
                        for (j = 0; j < selectMeeting.length; j++) {
                          var x = document.getElementsByClassName(selectMeeting[
                              j
                            ].perihal
                              .split(' ')
                              .join(''));
                          for (k = 0; k < x.length; k++) {
                            x[k].style.display = 'none';
                          }
                        }
                        var x = document.getElementsByClassName(props.perihal
                            .split(' ')
                            .join(''));
                        for (j = 0; j < x.length; j++) {
                          x[j].style.display = 'table-row';
                        }
                      }}>
                      <div style="overflow-y:scroll; height:100%">
                        {props.perihal}
                      </div>
                    </td>
                    <td style="height:60px !important;">
                      <div style="overflow-y:scroll; height:100%">
                        {props.action_plan}
                      </div>

                    </td>
                    <td style="height:60px !important;">
                      <div style="height:100%">{props.due_date}</div>
                    </td>
                  </tr>
                  {#each props.data_uic as unit}
                    <tr
                      class={props.perihal.split(' ').join('')}
                      style="display: none">
                      <td style="height:60px !important;">
                        <div style="height:100%">{unit.name}</div>
                      </td>

                      <td style="color:red; font-weight:600;" colspan="2">
                        {#if unit.progress == ''}
                          No Progress
                        {:else}
                          <span style="color:black;">{unit.progress}</span>
                        {/if}
                      </td>
                      <td class="d-flex justify-content-center">
                        {#if unit.attachment != ''}
                          <button
                            type="button"
                            class="btn btn-outline-primary"
                            on:click={() => {
                              db_attachment
                                .ref(unit.attachment)
                                .getDownloadURL()
                                .then(function(url) {
                                  var xhr = new XMLHttpRequest();
                                  xhr.responseType = 'blob';
                                  xhr.onload = function(event) {
                                    var blob = xhr.response;
                                  };
                                  xhr.open('GET', url);
                                  xhr.send();
                                  window.open(url);
                                })
                                .catch(function(error) {});
                            }}>
                            Download Attachment
                          </button>
                        {:else}No Attachment{/if}
                      </td>
                    </tr>
                  {/each}
                {/each}
              {:else}
                {#each readData as props, i}
                  <tr>
                    <td
                      on:click={() => {
                        selectMeeting = props.data_meeting;
                        id = idMeeting[i];
                      }}>
                      {i + 1}
                    </td>
                    <td
                      on:click={() => {
                        selectMeeting = props.data_meeting;
                        id = idMeeting[i];
                      }}>
                      {props.meeting_name}
                    </td>
                    <td>{props.topic_name}</td>
                    <td>{props.meeting_date}</td>
                    <td>{props.lead_by}</td>
                    <td>
                      {#each props.attendees.split(',') as attend}
                        {attend}
                        <br />
                      {/each}
                    </td>
                    <td>{props.location}</td>
                    <td>{props.city}</td>
                    <td>
                      {#if props.priority == 0}
                        <!-- *** -->
                        <i
                          class="fa fa-star"
                          aria-hidden="true"
                          style="color: yellow;" />
                        <i
                          class="fa fa-star"
                          aria-hidden="true"
                          style="color: yellow;" />
                        <i
                          class="fa fa-star"
                          aria-hidden="true"
                          style="color: yellow;" />
                      {:else if props.priority == 1}
                        <!-- ** -->
                        <i
                          class="fa fa-star"
                          aria-hidden="true"
                          style="color: yellow;" />
                        <i
                          class="fa fa-star"
                          aria-hidden="true"
                          style="color: yellow;" />
                      {:else if props.priority == 2}
                        <i
                          class="fa fa-star"
                          aria-hidden="true"
                          style="color: yellow;" />
                      {:else}{/if}
                    </td>
                    {#if meetingStatus[i]}
                      <td class="text-center">
                        <span class="badge badge-pill badge-danger" disabled>
                          CLOSE
                        </span>
                      </td>
                    {:else}
                      <td class="text-center">
                        <span class="badge badge-pill badge-success" disabled>
                          OPEN
                        </span>
                      </td>
                    {/if}
                    <td class="text-center">
                      {#if props.evidence == ''}
                        No Evidence
                      {:else}
                        <button
                          type="button"
                          class="btn btn-outline-primary"
                          on:click={() => {
                            db_attachment
                              .ref(props.evidence)
                              .getDownloadURL()
                              .then(function(url) {
                                var xhr = new XMLHttpRequest();
                                xhr.responseType = 'blob';
                                xhr.onload = function(event) {
                                  var blob = xhr.response;
                                };
                                xhr.open('GET', url);
                                xhr.send();
                                window.open(url);
                              })
                              .catch(function(error) {});
                          }}>
                          Download Evidence
                        </button>
                      {/if}
                    </td>
                    <td>
                      <button
                        class="btn btn-warning"
                        data-toggle="modal"
                        data-target="#edit_meeting"
                        on:click={() => {
                          id = idMeeting[i];
                        }}>
                        EDIT
                      </button>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- End table meeting -->
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="add_meeting"
    tabindex="-1"
    role="dialog"
    aria-labelledby="add_meetingLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header" style="background-color:#f37121;">
          <h5 class="modal-title text-white" id="add_meetingLabel">
            ADD MEETING
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Input {user} {idMeeting} />
        </div>
      </div>
    </div>
  </div>
  <!-- End Modal -->
  <!-- Modal -->
  <div
    class="modal fade"
    id="edit_meeting"
    tabindex="-1"
    role="dialog"
    aria-labelledby="edit_meetingLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_meetingLabel">EDIT MEETING</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Edit {id} {user} />
        </div>
      </div>
    </div>
  </div>
  <!-- End Modal -->

  <!-- Modal -->
  <div
    class="modal fade"
    id="update_task"
    tabindex="-1"
    role="dialog"
    aria-labelledby="update_meetingLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_meetingLabel">UPDATE TASK</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Update
            id={taskModal}
            task={taskId}
            idTask={gotSelect}
            user={user.email.split('@')[0].toUpperCase()} />
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="input_event"
    tabindex="-1"
    role="dialog"
    aria-labelledby="input_eventLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header" style="background-color:red;">
          <h5 class="modal-title" id="add_meetingLabel" style="color:white;">
            INPUT EVENT
          </h5>
          <button
            type="button"
            class="close"
            style="color:white;"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <InputEvent user={user.email.split('@')[0].toUpperCase()} />
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="gcalender"
    tabindex="-1"
    role="dialog"
    aria-labelledby="gcalenderLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add_meetingLabel">AGENDA</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <GCalender />
        </div>
      </div>
    </div>
  </div>
  <!-- End Modal -->

  <!-- Footer -->
  <div class="footer">
    <div class="text-center">
      <p style="color: white;">@ WitelMagelang 2020</p>
    </div>
  </div>

</body>
