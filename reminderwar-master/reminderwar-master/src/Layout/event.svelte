<script>
  var date = new Date();
  function get_month() {
    let get_month = Number(date.getMonth()) + 1;
    if (get_month < 10) {
      return "0" + get_month;
    } else {
      return get_month;
    }
  }

  function get_date() {
    let get_date = date.getDate();
    if (get_date < 10) {
      return "0" + get_date;
    } else {
      return get_date;
    }
  }
  let today_date = date.getFullYear() + "-" + get_month() + "-" + get_date();

  import { db_user } from "../config.js";
  import { onMount, afterUpdate } from "svelte";
  import firebase from "firebase/app";

  let dataSchedule = [];
  let length = 0;

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
</script>

<style>
  .scroll-event-meeting {
    max-height: 45% !important;
    overflow-y: auto;
  }

  .scroll-event-meeting::-webkit-scrollbar {
    display: none;
  }

  .card-header {
    background-color: #e43f5a !important;
    color: aliceblue;
  }

  .card {
    border-radius: 10px !important;
  }
</style>

{#if dataSchedule.length != 0}
  {#each dataSchedule as props}
    <div
      class="card mb-4 scroll-event-meeting mt-2"
      style="height:45% !important;">
      <div class="card-header" style="position: sticky; top: 0;">
        <h6 style="font-family: 'Varela Round', sans-serif; font-weight:bold;">
          {props.meeting_name}
        </h6>
      </div>
      <div class="card-body">
        <blockquote class="blockquote mb-0" style="line-height: 1.5;">
          <p style="font-size:16px !important;">
            <i class="fa fa-calendar" aria-hidden="true" />
            {props.date}
            <i class="fa fa-clock-o" aria-hidden="true" />
            {props.start} - {props.end}
            <i class="fa fa-map-marker" aria-hidden="true" />
            {props.location},{props.city}
            <br />
            <span class="mr-2" style="font-weight:bold;">Description :</span>
            <span class="mr-2">
              <i class="fa fa-user" aria-hidden="true" />
              {props.leader}
            </span>
            <i class="fa fa-briefcase" aria-hidden="true" />
            {props.meeting_name}, {props.topic_name}
            <br />
            <i class="fa fa-users" aria-hidden="true" />
            {#each props.attendees as ikut}{ikut},{/each}
          </p>
          <footer class="blockquote-footer">{props.created}</footer>
        </blockquote>
      </div>
    </div>
  {/each}
{:else}
  <div style="font-style: italic; font-size: 20px;" class="m-auto text-center">
    ~ Oops, no meeting ~
  </div>
{/if}
