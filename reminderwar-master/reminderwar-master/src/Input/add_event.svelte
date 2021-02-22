<script>
  import { db_user } from "../config.js";
  import firebase from "firebase/app";
  let dataSchedule = [];
  let length = 0;
  import { onMount, afterUpdate } from "svelte";

  onMount(async () => {
    dataSchedule = [];
    db_user
      .collection("schedule")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          dataSchedule[dataSchedule.length] = doc.data();
        });
      });
  });
  export let user;
  function addEvent() {
    if (document.getElementById("event_meeting_name").value.trim() == "") {
      alert("Please input meeting name...");
    } else if (
      document.getElementById("event_meeting_date").value.trim() == ""
    ) {
      alert("Please add date of the meeting...");
    } else if (document.getElementById("event_start").value.trim() == "") {
      alert("Please add start of the meeting...");
    } else if (document.getElementById("event_end").value.trim() == "") {
      alert("Please add end of the meeting...");
    } else if (
      document.getElementById("event_location_name").value.trim() == ""
    ) {
      alert("Please input location meeting...");
    } else if (document.getElementById("event_city_name").value.trim() == "") {
      alert("Please input city...");
    } else if (document.getElementById("event_topic_name").value.trim() == "") {
      alert("Please input topic of the meeting...");
    } else if (document.getElementById("event_lead_name").value.trim() == "") {
      alert("Please input leader of the meeting...");
    } else if (document.getElementById("event_attendees").value.trim() == "") {
      alert("Please input attendees of the meeting...");
    } else {
      let j;
      let attendees = [];
      for (
        j = 0;
        j <
        Array.from(document.getElementById("event_attendees").selectedOptions)
          .length;
        j++
      ) {
        attendees[attendees.length] = document.getElementById(
          "event_attendees"
        ).selectedOptions[j].value;
      }

      for (j = 0; j < attendees.length; j++) {
        var notif = db_user.collection("unitData").doc(attendees[j]);
        notif.update({
          notif: firebase.firestore.FieldValue.arrayUnion(
            "You got invitation from " + user
          )
        });
      }
      let is_okay = true;
      for (j = 0; j < dataSchedule.length; j++) {
        if (
          document.getElementById("event_location_name").value ==
          dataSchedule[j].location
        ) {
          if (
            document.getElementById("event_meeting_date").value ==
            dataSchedule[j].date
          ) {
            if (
              document.getElementById("event_start").value >=
                dataSchedule[j].start &&
              document.getElementById("event_end").value <= dataSchedule[j].end
            ) {
              is_okay = false;
            }
          }
        }
      }

      if (is_okay) {
        db_user
          .collection("schedule")
          .add({
            created: user,
            attendees: attendees,
            city: document.getElementById("event_city_name").value,
            date: document.getElementById("event_meeting_date").value,
            start: document.getElementById("event_start").value,
            end: document.getElementById("event_end").value,
            location: document.getElementById("event_location_name").value,
            meeting_name: document.getElementById("event_meeting_name").value,
            leader: document.getElementById("event_lead_name").value,
            topic_name: document.getElementById("event_topic_name").value
          })
          .then(function(docRef) {
            alert("Success");
            location.reload();
          });
      } else {
        alert("Already Booked");
      }
    }
  }
</script>

<label for="event_meeting_name">Meeting Name</label>
<div class="form-group input-group">
  <input
    type="text"
    class="form-control"
    id="event_meeting_name"
    placeholder="Input meeting name..."
    required />
  <div class="input-group-append">
    <span class="input-group-text">
      <i class="fa fa-briefcase" aria-hidden="true" />
    </span>
  </div>
</div>
<div class="form-group">
  <label for="event_meeting_date">Meeting Date</label>
  <input
    type="date"
    class="form-control"
    id="event_meeting_date"
    placeholder="Input Date..."
    required />
</div>

<label for="event_start">Meeting Start</label>
<div class="form-group input-group">
  <input
    type="text"
    class="form-control"
    id="event_start"
    placeholder="Input start (ex 15:00)..."
    required />
  <div class="input-group-append">
    <span class="input-group-text">
      <i class="fa fa-clock-o" aria-hidden="true" />
    </span>
  </div>
</div>

<label for="event_end">Meeting End</label>
<div class="form-group input-group">
  <input
    type="text"
    class="form-control"
    id="event_end"
    placeholder="Input end (ex 16:00)..."
    required />
  <div class="input-group-append">
    <span class="input-group-text">
      <i class="fa fa-clock-o" aria-hidden="true" />
    </span>
  </div>
</div>

<label for="event_location_name">Location</label>
<div class="form-group text-center" style="width:100%;">
  <select id="event_location_name" required>
    <option value="" disabled selected>Choose Room</option>
    <option value="AULA">AULA</option>
    <option value="SEKAR">SEKAR</option>
    <option value="WAR_ROOM">WAR ROOM</option>
    <option value="5C">5C</option>
    <option value="OTHER">OTHER</option>
  </select>
</div>

<label for="event_city_name">City</label>
<div class="form-group input-group">
  <input
    type="text"
    class="form-control"
    id="event_city_name"
    placeholder="Input city name..."
    required />
  <div class="input-group-append">
    <span class="input-group-text">
      <i class="fa fa-map" aria-hidden="true" />
    </span>
  </div>
</div>

<label for="event_topic_name">Topic Name</label>
<div class="form-group input-group">
  <input
    type="text"
    class="form-control"
    id="event_topic_name"
    placeholder="Input topic name..."
    required />
  <span class="input-group-text">
    <i class="fa fa-file-word-o" aria-hidden="true" />
  </span>
</div>

<label for="event_lead_name">Meeting Leader</label>
<div class="form-group input-group">
  <input
    type="text"
    class="form-control"
    id="event_lead_name"
    placeholder="Input leader name..."
    required />
  <span class="input-group-text">
    <i class="fa fa-user" aria-hidden="true" />
  </span>
</div>
<div class="form-group text-center" style="width:100%;">
  <select id="event_attendees" multiple="true" required>
    <option value="" disabled selected>Choose Attendees</option>
    <option value="ASO">ASO</option>
    <option value="OPTIMA">OPTIMA</option>
    <option value="CCAN&WAN">CCAN & WAN</option>
    <option value="HS_CS">HS/CS</option>
    <option value="ARNET">ARNET</option>
    <option value="EGBIS">EGBIS</option>
    <option value="CC">CC</option>
    <option value="HR&GS">HR & GS</option>
    <option value="PCF">PCF</option>
    <option value="WR">WR</option>
    <option value="TA">TA</option>
    <option value="DSW">DSW</option>
    <option value="DATEL_PWJ">DATEL PWJ</option>
    <option value="DATEL_TEM">DATEL TEM</option>
    <option value="DATEL_WOS">DATEL WOS</option>
    <option value="DATEL_MUN">DATEL MUN</option>
    <option value="DATEL_KBM">DATEL KBM</option>
    <option value="OTHER">OTHER</option>
  </select>
</div>

<button
  class="btn btn-success btn-block"
  on:click={() => {
    addEvent();
  }}>
  ADD EVENT
</button>
